import { NextResponse } from "next/server";
import { exec } from "child_process";

export async function POST() {
  return new Promise((resolve) => {
    exec("npx lingo.dev@latest run", (error, stdout, stderr) => {
      if (error) {
        console.error("Translation error:", stderr);
        resolve(NextResponse.json({ error: true, message: stderr }));
        return;
      }

      console.log(stdout);
      resolve(NextResponse.json({ success: true, logs: stdout }));
    });
  });
}
