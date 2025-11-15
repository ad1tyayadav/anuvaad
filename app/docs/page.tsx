import { getLocale } from "../lib/get-locale";
import fs from "fs";
import path from "path";
import Markdown from "react-markdown";

export default async function DocsPage() {
  const locale = await getLocale(); // MUST await

  const filePath = path.join(process.cwd(), "app/docs", `${locale}.md`);

  const fileContents = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="prose p-10">
      <Markdown>{fileContents}</Markdown>
    </div>
  );
}
