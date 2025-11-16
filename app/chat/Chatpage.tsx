"use client";

import { useState } from "react";
import { translateText } from "../lib/translate";

type Translations = Record<string, Record<string, string>>;

export default function ChatPage({ translations }: { translations: Translations }) {
  const locales = Object.keys(translations).sort();
  const sourceLocale = "en";

  const targetLocales = locales.filter((l) => l !== sourceLocale);

  const [activeLocale, setActiveLocale] = useState(targetLocales[0]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { original: string; translated: string }[]
  >([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // translate message to active tab language
    const translated = await translateText(input, activeLocale);

    setMessages((prev) => [
      ...prev,
      { original: input, translated },
    ]);

    setInput("");
  };

  return (
    <div className="p-10 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">AI Translator Chat</h1>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto py-3">
        {targetLocales.map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveLocale(loc)}
            className={`px-4 py-1 rounded border ${
              activeLocale === loc
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="border rounded p-3">
            <p className="font-semibold text-gray-700">Original:</p>
            <p>{msg.original}</p>

            <p className="font-semibold text-gray-700 mt-3">
              Translated ({activeLocale.toUpperCase()}):
            </p>
            <p>{msg.translated}</p>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="text-gray-500 text-sm">Start typing to translate…</p>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
