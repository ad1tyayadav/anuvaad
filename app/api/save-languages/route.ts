/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  const body = await req.json();
  const selected: string[] = body.languages;

  const source = "en";
  const targets = selected.filter((l) => l !== "en");

  // 1. Update i18n.json
  const configPath = path.join(process.cwd(), "i18n.json");
  const raw = fs.readFileSync(configPath, "utf-8");
  const config = JSON.parse(raw);

  config.locale.targets = targets;

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

  // 2. Ensure locale files exist
  const localesDir = path.join(process.cwd(), "locales");

  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir);
  }

  // English must exist
  const enPath = path.join(localesDir, "en.json");
  if (!fs.existsSync(enPath)) {
    fs.writeFileSync(enPath, JSON.stringify({}, null, 2));
  }

  // Create missing files
  for (const lang of targets) {
    const langFile = path.join(localesDir, `${lang}.json`);
    if (!fs.existsSync(langFile)) {
      fs.writeFileSync(langFile, JSON.stringify({}, null, 2));
    }
  }

  return NextResponse.json({ success: true });
}
