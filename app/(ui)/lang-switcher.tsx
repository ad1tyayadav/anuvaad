/* eslint-disable react-hooks/immutability */
"use client";

import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const router = useRouter();

  const changeLang = (locale: string) => {
    document.cookie = `locale=${locale}; path=/;`;
    router.refresh();
  };

  return (
    <div className="flex gap-3">
      {["en", "hi", "es"].map((l) => (
        <button
          key={l}
          onClick={() => changeLang(l)}
          className="px-3 py-1 border rounded"
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
