import 'server-only';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { logServiceError } from './upload-service';

export function getDriveClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Drive OAuth credentials are not fully configured.');
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

/**
 * Finds an existing folder or creates it under the specified parent folder.
 */
export async function getOrCreateFolder(folderName: string, parentFolderId?: string): Promise<string> {
  const drive = getDriveClient();
  const parent = parentFolderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

  let query = `mimeType = 'application/vnd.google-apps.folder' and name = '${folderName.replace(/'/g, "\\'")}' and trashed = false`;
  if (parent) {
    query += ` and '${parent}' in parents`;
  }

  const res = await drive.files.list({
    q: query,
    fields: 'files(id, name)',
    spaces: 'drive',
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id!;
  }

  // Create folder if it doesn't exist
  const folderMetadata: { name: string; mimeType: string; parents?: string[] } = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parent) {
    folderMetadata.parents = [parent];
  }

  const createRes = await drive.files.create({
    requestBody: folderMetadata,
    fields: 'id',
  });

  if (!createRes.data.id) {
    throw new Error(`Failed to create folder ${folderName}`);
  }

  return createRes.data.id;
}

/**
 * Uploads a file buffer or stream to Google Drive and sets public read permissions.
 */
export async function uploadFileToDrive({
  fileName,
  mimeType,
  buffer,
  folderId,
}: {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
  folderId?: string;
}): Promise<{ fileId: string; previewUrl: string; downloadUrl: string }> {
  const drive = getDriveClient();
  const targetFolderId = folderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

  const fileMetadata: { name: string; parents?: string[] } = {
    name: fileName,
  };

  // Verify the destination before upload; never silently place files elsewhere.
  if (targetFolderId) {
    await drive.files.get({ fileId: targetFolderId, fields: 'id' });
    fileMetadata.parents = [targetFolderId];
  }

  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const media = {
    mimeType,
    body: stream,
  };

  const fileRes = await drive.files.create({
    requestBody: fileMetadata,
    media,
    fields: 'id, webViewLink, webContentLink',
  });

  const fileId = fileRes.data.id;
  if (!fileId) {
    throw new Error('Failed to retrieve file ID from Google Drive upload.');
  }

  // Make the file publicly viewable so preview & download work reliably
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
  } catch (permErr) {
    logServiceError(
      '[drive] File uploaded, but public sharing could not be configured.',
      permErr,
    );
  }

  // Fetch updated links
  const detailRes = await drive.files.get({
    fileId,
    fields: 'id, webViewLink, webContentLink',
  });

  const previewUrl =
    detailRes.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
  const downloadUrl =
    detailRes.data.webContentLink || `https://drive.google.com/uc?export=download&id=${fileId}`;

  return {
    fileId,
    previewUrl,
    downloadUrl,
  };
}
