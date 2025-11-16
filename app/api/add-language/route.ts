/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { locale } = await req.json();
    const clean = locale.toLowerCase().trim();

    if (!clean.match(/^[a-z]{2,3}$/)) {
      return NextResponse.json(
        { error: "Invalid locale code" },
        { status: 400 }
      );
    }

    const basePath = path.join(process.cwd(), "app/locales");
    const newFile = path.join(basePath, `${clean}.json`);

    if (fs.existsSync(newFile)) {
      return NextResponse.json(
        { error: "Locale already exists" },
        { status: 400 }
      );
    }

    // Load EN as base keys
    const enFile = path.join(basePath, "en.json");
    const en = JSON.parse(fs.readFileSync(enFile, "utf-8"));

    // Build empty template
    const template: Record<string, string> = {};
    for (const key of Object.keys(en)) {
      template[key] = "";
    }

    fs.writeFileSync(newFile, JSON.stringify(template, null, 2));

    return NextResponse.json({ success: true, locale: clean });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
