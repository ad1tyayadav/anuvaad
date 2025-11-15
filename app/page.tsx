"use client";

import { t } from "@/app/lib/i18n";
import { useI18n } from "@/providers/i18n-provider";

export default function Home() {
  const dict = useI18n();

  return (
    <div className="p-10 space-y-3">
      <h1 className="text-3xl font-bold">All Translations</h1>

      {Object.entries(dict).map(([key, value]) => (
        <div key={key} className="border-b pb-2">
          <strong>{key}:</strong> {t(key, dict)}
        </div>
      ))}
    </div>
  );
}
