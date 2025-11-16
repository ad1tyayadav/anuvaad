/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";

export default function LangSwitcher() {
  const [langs, setLangs] = useState<string[]>(["en"]);
  const [active, setActive] = useState("en");

  useEffect(() => {
    // Load selected languages (from settings)
    const saved = localStorage.getItem("anuvaad-langs");
    if (saved) {
      setLangs(JSON.parse(saved));
    }

    // Load active locale from cookie
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1];

    if (cookieLocale) setActive(cookieLocale);
  }, []);

  const changeLang = (locale: string) => {
    document.cookie = `locale=${locale}; path=/`;
    setActive(locale);
    window.location.reload();
  };

  return (
    <div className="flex gap-2">
      {langs.map((lng) => (
        <button
          key={lng}
          onClick={() => changeLang(lng)}
          className={`text-xs border px-2 py-1 rounded 
            ${active === lng ? "bg-black text-white" : "hover:bg-gray-100"}`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
