/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "i18n.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    return NextResponse.json({
      languages: [data.locale.source, ...data.locale.targets],
    });
  } catch (err) {
    return NextResponse.json({ languages: ["en"] });
  }
}
