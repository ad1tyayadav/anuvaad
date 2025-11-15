import { cookies } from "next/headers";

export async function getLocale() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value;
  return locale || "en";
}
