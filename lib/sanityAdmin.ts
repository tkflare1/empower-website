import { createClient } from "@sanity/client";

export const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1ld5igqx",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2023-05-03",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export function checkAdminAuth(token: string | null | undefined): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return true; // no password set → dev mode, allow all
  return token === password;
}

export function generateKey(length = 12): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
