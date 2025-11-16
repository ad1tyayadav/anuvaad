"use client";

import Link from "next/link";

export default function Hero() {
  return (
<section className="max-w-5xl mx-auto px-6 pt-24 pb-32 text-center">
        <h1 className="text-5xl font-semibold tracking-tight">
          Translate your entire app in minutes — not months.
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Anuvaad helps you localize your product across multiple languages with
          AI-powered translation, manual review tools, and seamless GitHub automation.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <a
            href="/chat"
            className="px-6 py-3 bg-black text-white rounded-lg text-sm hover:bg-gray-900"
          >
            Open Translator Chat
          </a>

          <a
            href="/settings"
            className="px-6 py-3 border border-gray-300 text-sm rounded-lg hover:bg-gray-50"
          >
            Manage Languages
          </a>
        </div>
      </section>
  );
}
