/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useMemo, useState } from "react";
import EditableCell from "./EditableCell";

type Translations = Record<string, Record<string, string>>;

type Grouped = {
  groupName: string;
  items: {
    key: string;
    label: string;
    en: string;
    value: string;
  }[];
};

function prettyGroupName(raw: string) {
  // e.g. "home" -> "Home", "navbar" -> "Navbar"
  return raw.replace(/[-_]/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}

function prettyLabel(key: string) {
  // convert "home.title" -> "Title", "navbar.docs" -> "Docs"
  const parts = key.split(".");
  const last = parts[parts.length - 1];
  return last.replace(/[-_]/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}

export default function TranslatorDashboard({ translations }: { translations: Translations }) {
  const locales = Object.keys(translations).sort();
  const sourceLocale = "en";

  if (!translations[sourceLocale]) {
    return <p className="p-10 text-red-600">Missing en.json (source language)</p>;
  }

  const targetLocales = locales.filter((l) => l !== sourceLocale);
  const [activeLocale, setActiveLocale] = useState(targetLocales[0] ?? "es");
  const [search, setSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const source = translations[sourceLocale];

  // Build grouped data
  const grouped: Grouped[] = useMemo(() => {
    const map = new Map<string, Grouped["items"]>();

    for (const key of Object.keys(source)) {
      const group = key.split(".")[0] || "other";
      if (!map.has(group)) map.set(group, []);
      const items = map.get(group)!;
      items.push({
        key,
        label: prettyLabel(key),
        en: source[key],
        value: translations[activeLocale]?.[key] ?? "",
      });
    }

    const out: Grouped[] = [];
    for (const [group, items] of map.entries()) {
      out.push({
        groupName: prettyGroupName(group),
        items: items.sort((a, b) => a.key.localeCompare(b.key)),
      });
    }

    // sort groups alphabetically with Home first
    out.sort((a, b) => {
      if (a.groupName.toLowerCase() === "home") return -1;
      if (b.groupName.toLowerCase() === "home") return 1;
      return a.groupName.localeCompare(b.groupName);
    });

    return out;
  }, [translations, activeLocale, source]);

  // Filter keys by search term
  function filterItem(item: Grouped["items"][number]) {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.key.toLowerCase().includes(q) ||
      item.en?.toLowerCase().includes(q) ||
      item.value?.toLowerCase().includes(q) ||
      item.label?.toLowerCase().includes(q)
    );
  }

  return (
    <div className="p-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Translator Dashboard</h1>
          <p className="text-sm text-gray-600">Group view • Human-friendly labels • Hover actions</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search keys, English text, or translation…"
            className="border rounded px-3 py-2 w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={activeLocale}
            onChange={(e) => setActiveLocale(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {targetLocales.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* For each group render a collapsible card */}
      <div className="space-y-6">
        {grouped.map((g) => {
          const visibleItems = g.items.filter(filterItem);
          if (visibleItems.length === 0) return null;

          const isCollapsed = !!collapsedGroups[g.groupName];

          return (
            <div key={g.groupName} className="border rounded-lg overflow-hidden">
              <div
                className="px-4 py-3 bg-gray-50 flex items-center justify-between cursor-pointer"
                onClick={() =>
                  setCollapsedGroups((s) => ({ ...s, [g.groupName]: !s[g.groupName] }))
                }
              >
                <div>
                  <h3 className="font-medium">{g.groupName}</h3>
                  <div className="text-xs text-gray-500">{visibleItems.length} keys</div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // quick retranslate all missing in this group
                      // call API to retranslate each missing key (simple loop)
                      ;(async () => {
                        const missing = g.items
                          .filter((it) => {
                            const val = translations[activeLocale]?.[it.key];
                            return !val || String(val).trim() === "";
                          })
                          .map((it) => it.key);

                        if (missing.length === 0) {
                          alert("No missing keys in this group.");
                          return;
                        }

                        if (!confirm(`Retranslate ${missing.length} missing keys in ${g.groupName}?`))
                          return;

                        for (const key of missing) {
                          await fetch("/api/retranslate", {
                            method: "POST",
                            body: JSON.stringify({
                              key,
                              sourceText: source[key],
                              target: activeLocale,
                            }),
                          });
                        }

                        window.location.reload();
                      })();
                    }}
                    className="text-xs px-2 py-1 rounded border bg-white hover:bg-gray-100"
                  >
                    Retranslate missing
                  </button>

                  <button
                    className="text-xs px-2 py-1 rounded border bg-white hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCollapsedGroups((s) => ({ ...s, [g.groupName]: !s[g.groupName] }));
                    }}
                  >
                    {isCollapsed ? "Expand" : "Collapse"}
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="text-left text-xs text-gray-600">
                        <tr>
                          <th className="pb-2 pr-4">Key</th>
                          <th className="pb-2 pr-4">Label</th>
                          <th className="pb-2 pr-4">English</th>
                          <th className="pb-2 pr-4">{activeLocale.toUpperCase()}</th>
                          <th className="pb-2"></th>
                        </tr>
                      </thead>

                      <tbody className="divide-y">
                        {visibleItems.map((item) => {
                          const val = translations[activeLocale]?.[item.key] ?? "";
                          const isMissing = !val || String(val).trim() === "";
                          const isSameAsEn = val === item.en;

                          return (
                            <tr key={item.key} className="group hover:bg-gray-50">
                              <td className="py-3 pr-4 align-top font-mono text-xs text-gray-700">{item.key}</td>
                              <td className="py-3 pr-4 align-top">{item.label}</td>
                              <td className="py-3 pr-4 align-top text-gray-700 max-w-lg">{item.en}</td>

                              <td className="py-3 pr-4 align-top">
                                <div
                                  className={`rounded px-2 py-1 ${isMissing ? "bg-red-50 border border-red-200" : isSameAsEn ? "bg-yellow-50 border border-yellow-200" : ""}`}
                                >
                                  {val || <span className="text-gray-400">— missing —</span>}
                                </div>
                              </td>

                              <td className="py-3 pr-4 align-top">
                                {/* Hover actions */}
                                <div className="opacity-0 group-hover:opacity-100 transition flex gap-2">
                                  {/* Edit button opens inline edit modal via EditableCell (we keep inline flow by toggling a small edit state) */}
                                  <button
                                    onClick={async () => {
                                      // scroll to that key's editable area (small UX)
                                      const exists = document.getElementById(`edit-${item.key}`);
                                      if (exists) {
                                        exists.scrollIntoView({ behavior: "smooth", block: "center" });
                                        // focus input if possible:
                                        const input = (exists.querySelector("input") as HTMLInputElement | null);
                                        input?.focus();
                                      }
                                    }}
                                    className="px-2 py-1 text-xs rounded border bg-white hover:bg-gray-100"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={async () => {
                                      // single retranslate
                                      const ok = confirm(`Retranslate "${item.key}" to ${activeLocale.toUpperCase()}?`);
                                      if (!ok) return;

                                      const res = await fetch("/api/retranslate", {
                                        method: "POST",
                                        body: JSON.stringify({
                                          key: item.key,
                                          sourceText: item.en,
                                          target: activeLocale,
                                        }),
                                      });
                                      if (res.ok) {
                                        window.location.reload();
                                      } else {
                                        alert("Retranslate failed");
                                      }
                                    }}
                                    className="px-2 py-1 text-xs rounded border bg-white hover:bg-gray-100"
                                  >
                                    Retranslate
                                  </button>

                                  <button
                                    onClick={async () => {
                                      // quick copy english to target for fallback
                                      const ok = confirm(`Copy English text into ${activeLocale.toUpperCase()} for "${item.key}"?`);
                                      if (!ok) return;
                                      await fetch("/api/save-translation", {
                                        method: "POST",
                                        body: JSON.stringify({ locale: activeLocale, key: item.key, value: item.en }),
                                      });
                                      window.location.reload();
                                    }}
                                    className="px-2 py-1 text-xs rounded border bg-white hover:bg-gray-100"
                                  >
                                    Use EN
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Invisible inline EditableCells anchored by id so "Edit" finds them */}
                  <div className="mt-4 grid gap-2">
                    {visibleItems.map((item) => (
                      <div id={`edit-${item.key}`} key={`edit-${item.key}`} className="sr-only">
                        {/* Render EditableCell in hidden mode so it exists in DOM for focusing.
                            EditableCell will render its own input only when used in translation table,
                            but we place a hidden instance for anchor/focus. */}
                        <EditableCell
                          locale={activeLocale}
                          keyName={item.key}
                          initial={translations[activeLocale]?.[item.key] ?? ""}
                          source={item.en}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
