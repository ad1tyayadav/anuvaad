/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const { locale, key, value } = await req.json();

    const filePath = path.join(process.cwd(), "locales", `${locale}.json`);
    const file = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    file[key] = value;

    fs.writeFileSync(filePath, JSON.stringify(file, null, 2));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
