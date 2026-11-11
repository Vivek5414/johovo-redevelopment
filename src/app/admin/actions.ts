"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createServerActionClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1).max(128),
});

export async function signIn(formData: FormData): Promise<void> {
  const credentials = credentialsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!credentials.success) {
    redirect("/admin/login?error=invalid");
  }

  const supabase = await createServerActionClient();
  const { data, error } = await supabase.auth.signInWithPassword(credentials.data);

  if (error) {
    if (
      error.code === "invalid_credentials" ||
      error.code === "email_not_confirmed"
    ) {
      redirect("/admin/login?error=invalid");
    }

    throw error;
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", data.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (!profile) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw signOutError;
    }

    redirect("/admin/login?error=unauthorized");
  }

  redirect("/admin");
}

export async function signOut(): Promise<void> {
  const supabase = await createServerActionClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }

  redirect("/admin/login");
}
