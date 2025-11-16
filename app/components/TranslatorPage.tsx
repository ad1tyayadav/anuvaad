"use client";

import { useState } from "react";
import EditableCell from "./EditableCell";

type Translations = Record<string, Record<string, string>>;

export default function TranslatorPage({ translations }: { translations: Translations }) {
    const locales = Object.keys(translations);

    const sourceLocale = "en";
    const source = translations[sourceLocale];

    const targetLocales = locales.filter((l) => l !== sourceLocale);

    const [activeLocale, setActiveLocale] = useState(targetLocales[0]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newLocale, setNewLocale] = useState("");

    // Filtering keys (search in ANY language)
    const keys = Object.keys(source).filter((key) => {
        const term = search.toLowerCase();

        return (
            key.toLowerCase().includes(term) ||
            source[key]?.toLowerCase().includes(term) ||
            targetLocales.some((loc) =>
                translations[loc][key]?.toLowerCase().includes(term)
            )
        );
    });

    // Active translation file
    const activeFile = translations[activeLocale];

    return (
        <div className="space-y-10">
            <h1 className="text-3xl font-bold">Translator Dashboard</h1>
            <p className="text-gray-600">Review and correct translations for all languages.</p>

            {/* Search Bar */}
            <input
                placeholder="Search translations…"
                className="w-full border rounded px-3 py-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Language Tabs */}
            <div className="flex items-center gap-3 mt-4">
                {targetLocales.map((loc) => (
                    <button
                        key={loc}
                        onClick={() => setActiveLocale(loc)}
                        className={`px-3 py-1 rounded border ${activeLocale === loc
                                ? "bg-black text-white"
                                : "bg-white text-black"
                            }`}
                    >
                        {loc.toUpperCase()}
                    </button>
                ))}

                {/* Add Language Button */}
                <button
                    onClick={() => setShowModal(true)}
                    className="px-3 py-1 rounded bg-green-600 text-white"
                >
                    + Add Language
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border text-sm mt-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2 text-left">Key</th>
                            <th className="border p-2 text-left">English</th>
                            <th className="border p-2 text-left">{activeLocale.toUpperCase()}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {keys.map((key) => (
                            <tr key={key} className="border-b">
                                <td className="border p-2 font-mono">{key}</td>
                                <td className="border p-2">{source[key]}</td>

                                <EditableCell
                                    locale={activeLocale}
                                    keyName={key}
                                    initial={activeFile[key] ?? ""}
                                    source={source[key]}
                                />
                            </tr>
                        ))}
                    </tbody>
                </table>

                {keys.length === 0 && (
                    <p className="text-gray-500 mt-4 text-center">No matches found.</p>
                )}
            </div>

            {/* Modal — Add New Language */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow space-y-4 w-80">
                        <h2 className="text-lg font-bold">Add New Language</h2>

                        <input
                            placeholder="Locale code (e.g., fr, de, ja)"
                            value={newLocale}
                            onChange={(e) => setNewLocale(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        />

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-3 py-1 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {
                                    await fetch("/api/add-language", {
                                        method: "POST",
                                        body: JSON.stringify({ locale: newLocale }),
                                    });

                                    setShowModal(false);
                                    window.location.reload();
                                }}
                                className="px-3 py-1 rounded bg-blue-600 text-white"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
