type ErrorDetails = {
  name?: string;
  code?: string;
  status?: number;
};

function getErrorDetails(error: unknown): ErrorDetails {
  const queue: unknown[] = [error];
  const seen = new Set<object>();
  const details: ErrorDetails = {};

  while (queue.length) {
    const current = queue.shift();
    if (typeof current !== "object" || current === null || seen.has(current)) {
      continue;
    }

    seen.add(current);
    const record = current as Record<string, unknown>;

    if (!details.name && typeof record.name === "string") {
      details.name = record.name.slice(0, 60);
    }
    if (!details.code && typeof record.code === "string") {
      details.code = record.code.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);
    }
    if (!details.status && typeof record.status === "number") {
      details.status = record.status;
    }
    if (!details.status && typeof record.statusCode === "number") {
      details.status = record.statusCode;
    }

    queue.push(record.cause, record.sourceError, record.response);
  }

  return details;
}

function isTransientError(error: unknown): boolean {
  const transientCodes = new Set([
    "ECONNRESET",
    "ECONNREFUSED",
    "ETIMEDOUT",
    "EAI_AGAIN",
    "UND_ERR_CONNECT_TIMEOUT",
    "UND_ERR_HEADERS_TIMEOUT",
    "UND_ERR_SOCKET",
  ]);
  const queue: unknown[] = [error];
  const seen = new Set<object>();

  while (queue.length) {
    const current = queue.shift();
    if (typeof current !== "object" || current === null || seen.has(current)) {
      continue;
    }

    seen.add(current);
    const record = current as Record<string, unknown>;
    const status =
      typeof record.status === "number"
        ? record.status
        : typeof record.statusCode === "number"
          ? record.statusCode
          : undefined;
    const code = typeof record.code === "string" ? record.code : undefined;

    if (
      status === 408 ||
      status === 429 ||
      (status !== undefined && status >= 500) ||
      transientCodes.has(code ?? "")
    ) {
      return true;
    }

    queue.push(record.cause, record.sourceError, record.response);
  }

  return false;
}

export async function retryTransientRequest<T>(
  operation: () => Promise<T>,
  retries = 1,
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      if (!isTransientError(error) || attempt >= retries) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 250 * 2 ** attempt),
      );
    }
  }
}

export function logServiceError(context: string, error: unknown): void {
  console.error(context, getErrorDetails(error));
}
