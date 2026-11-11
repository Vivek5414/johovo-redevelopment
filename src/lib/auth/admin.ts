import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createServerComponentClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (
    error &&
    error.status !== 401 &&
    error.name !== "AuthSessionMissingError"
  ) {
    throw error;
  }

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (profileError) {
    throw profileError;
  }

  if (!profile) {
    redirect("/admin/login?error=unauthorized");
  }

  return user;
}
