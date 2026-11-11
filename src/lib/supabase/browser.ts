"use client";

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import { getPublicSupabaseEnv } from "./env";

export function createBrowserClient() {
  const { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY } =
    getPublicSupabaseEnv();

  return createSupabaseBrowserClient(
    NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
