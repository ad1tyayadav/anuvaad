/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { LingoDotDevEngine } from "lingo.dev/sdk";

export async function POST(req: Request) {
  try {
    const { text, target } = await req.json();

    const lingo = new LingoDotDevEngine({
      apiKey: process.env.LINGODOTDEV_API_KEY!,
    });

    const result = await lingo.localizeText(text, {
      sourceLocale: null,   // auto-detect source language
      targetLocale: target,
      fast: true,           // optional: faster responses
    });

    return NextResponse.json({ translated: result });
  } catch (error: any) {
    console.error("Translation failed:", error);
    return NextResponse.json(
      { error: error.message || "Translation failed" },
      { status: 500 }
    );
  }
}
