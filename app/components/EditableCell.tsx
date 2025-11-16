"use client";

import { useState } from "react";

export default function EditableCell({
  locale,
  keyName,
  initial,
  source,
}: {
  locale: string;
  keyName: string;
  initial: string;
  source: string;
}) {
  const [value, setValue] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const isMissing = !value || value.trim() === "";
  const isSameAsEnglish = value === source;

  const save = async () => {
    setSaving(true);

    await fetch("/api/save-translation", {
      method: "POST",
      body: JSON.stringify({ locale, key: keyName, value }),
    });

    setSaving(false);
  };

  const retranslate = async () => {
    setLoadingAI(true);

    const res = await fetch("/api/retranslate", {
      method: "POST",
      body: JSON.stringify({
        key: keyName,
        sourceText: source,
        target: locale,
      }),
    });

    const data = await res.json();
    if (data.translated) {
      setValue(data.translated);
    }

    setLoadingAI(false);
    save();
  };

  return (
    <td
      className={`border p-2 ${
        isMissing
          ? "bg-red-50"
          : isSameAsEnglish
          ? "bg-yellow-50"
          : "bg-white"
      }`}
    >
      <div className="flex flex-col gap-2">
        <input
          className={`border rounded px-2 py-1 w-full ${
            isMissing
              ? "border-red-400"
              : isSameAsEnglish
              ? "border-yellow-500"
              : "border-gray-300"
          }`}
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          placeholder={isMissing ? "Missing translation…" : ""}
        />

        <div className="flex gap-2">
          <button
            onClick={save}
            className="text-xs bg-black text-white px-2 py-1 rounded"
          >
            {saving ? "..." : "Save"}
          </button>

          <button
            onClick={retranslate}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
          >
            {loadingAI ? "Thinking..." : "Retranslate"}
          </button>
        </div>
      </div>
    </td>
  );
}
