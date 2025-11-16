import fs from "fs";
import path from "path";

export function loadTranslations(): Record<string, Record<string, string>> {
  const dir = path.join(process.cwd(), "locales");

  const files = fs.readdirSync(dir).filter((file) => file.endsWith(".json"));

  const map: Record<string, Record<string, string>> = {};

  for (const file of files) {
    const locale = file.replace(".json", "");
    const content = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
    map[locale] = content;
  }

  return map;
}
