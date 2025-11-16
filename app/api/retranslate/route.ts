/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { LingoDotDevEngine } from "lingo.dev/sdk";

export async function POST(req: Request) {
  try {
    const { key, sourceText, target } = await req.json();

    const lingo = new LingoDotDevEngine({
      apiKey: process.env.LINGODOTDEV_API_KEY!,
    });

    // Translate using SDK
    const translated = await lingo.localizeText(sourceText, {
      sourceLocale: "en",
      targetLocale: target,
      fast: true,
    });

    // Save to file
    const filePath = path.join(process.cwd(), `locales`, `${target}.json`);
    const file = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    file[key] = translated;
    fs.writeFileSync(filePath, JSON.stringify(file, null, 2));

    return NextResponse.json({ translated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
