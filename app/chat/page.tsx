"use client";

import { useState } from "react";
import { translateText } from "../lib/translate";
import { useI18n } from "@/providers/i18n-provider";
import { t } from "../lib/i18n";

export default function ChatPage() {
    const dict = useI18n();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<
        { original: string; translated: string }[]
    >([]);

    // Read locale from cookie on client
    const target = typeof document !== "undefined"
        ? (document.cookie
            .split("; ")
            .find((row) => row.startsWith("locale="))
            ?.split("=")[1] || "en")
        : "en";

    const sendMessage = async () => {
        if (!input.trim()) return;

        const translated = await translateText(input, target);

        setMessages((prev) => [
            ...prev,
            { original: input, translated },
        ]);

        setInput("");
    };

    return (
        <div className="p-10 max-w-xl mx-auto space-y-5">
            <h1 className="text-3xl font-bold">{t("chat.title", dict)}</h1>

            <div className="space-y-3">
                {messages.map((m, i) => (
                    <div key={i} className="border rounded p-3">
                        <p className="font-semibold">Original:</p>
                        <p>{m.original}</p>

                        <p className="font-semibold mt-2">Translated:</p>
                        <p>{m.translated}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mt-4">
                <input
                    className="flex-1 border p-2 rounded"
                    placeholder={t("chat.placeholder", dict)}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    className="px-4 py-2 bg-black text-white rounded"
                    onClick={sendMessage}
                >
                    {t("chat.send", dict)}
                </button>
            </div>
        </div>
    );
}
