"use client";

import { useState, useEffect } from "react";

const AVAILABLE_LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "Hindi" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "zh", label: "Chinese" },
    { code: "ja", label: "Japanese" },
    { code: "ar", label: "Arabic" },
    { code: "pt", label: "Portuguese" },
    { code: "ru", label: "Russian" },
];

export default function SettingsPage() {
    const [selected, setSelected] = useState<string[]>(["en"]);

    // Load selected languages from backend (optional)
    useEffect(() => {
        fetch("/api/get-languages")
            .then((res) => res.json())
            .then((data) => setSelected(data.languages));
    }, []);

    const toggleLang = (code: string) => {
        if (code === "en") return; // source lang cannot be removed

        setSelected((prev) =>
            prev.includes(code)
                ? prev.filter((l) => l !== code)
                : [...prev, code]
        );
    };

    const save = async () => {
        const res = await fetch("/api/save-languages", {
            method: "POST",
            body: JSON.stringify({ languages: selected }),
        });

        if (res.ok) {
            alert("Languages updated! Generating translations…");
            await fetch("/api/run-translation", { method: "POST" });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-10">
            <h1 className="text-3xl font-bold mb-4">Language Settings</h1>
            <p className="text-gray-600 mb-10">
                Choose which languages you want to translate your application into.
            </p>

            <div className="space-y-4">
                {AVAILABLE_LANGUAGES.map((lang) => (
                    <label key={lang.code} className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={selected.includes(lang.code)}
                            disabled={lang.code === "en"}
                            onChange={() => toggleLang(lang.code)}
                        />
                        <span>{lang.label}</span>
                    </label>
                ))}
            </div>

            <button
                onClick={save}
                className="mt-10 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
                Save Languages
            </button>
        </div>
    );
}
