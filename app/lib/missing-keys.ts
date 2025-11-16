import fs from "fs";
import path from "path";
import { loadTranslations } from "./load-translations";

type MissingSummary = {
  usedKeys: string[];
  definedKeys: string[];
  missingInEn: string[];
  unusedInCode: string[];
  missingByLocale: Record<string, string[]>;
};

export function getMissingSummary(): MissingSummary {
  const translations = loadTranslations();
  const sourceLocale = "en";

  const en = translations[sourceLocale] || {};
  const definedKeys = Object.keys(en);

  const usedKeysSet = getUsedKeysFromCode();
  const usedKeys = Array.from(usedKeysSet);

  // Keys used in code but not in en.json
  const missingInEn = usedKeys.filter((k) => !definedKeys.includes(k));

  // Keys defined in en.json but never used in code
  const unusedInCode = definedKeys.filter((k) => !usedKeysSet.has(k));

  // For each target locale, which keys from en are missing or empty
  const missingByLocale: Record<string, string[]> = {};

  for (const locale of Object.keys(translations)) {
    if (locale === sourceLocale) continue;

    const dict = translations[locale] || {};
    const missing = definedKeys.filter((key) => {
      const v = dict[key];
      return v === undefined || v === null || String(v).trim() === "";
    });

    missingByLocale[locale] = missing;
  }

  return {
    usedKeys,
    definedKeys,
    missingInEn,
    unusedInCode,
    missingByLocale,
  };
}

function getUsedKeysFromCode(): Set<string> {
  const roots = ["app", "components"]; // scan these dirs
  const exts = [".ts", ".tsx", ".js", ".jsx"];

  const keys = new Set<string>();

  for (const root of roots) {
    const rootPath = path.join(process.cwd(), root);
    if (!fs.existsSync(rootPath)) continue;
    scanDir(rootPath);
  }

  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip junk dirs
        if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
        scanDir(full);
      } else {
        if (!exts.some((ext) => entry.name.endsWith(ext))) continue;
        processFile(full);
      }
    }
  }

  function processFile(filePath: string) {
    const content = fs.readFileSync(filePath, "utf-8");

    // Match t("some.key") or t('some.key') or t(`some.key`)
    const regex = /t\(\s*["'`]([^"'`]+)["'`]/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      keys.add(match[1]);
    }
  }

  return keys;
}
