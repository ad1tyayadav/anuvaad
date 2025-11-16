/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext } from "react";

const I18nContext = createContext<Record<string, string>>({});

export function I18nProvider({ dict, children }: any) {
  return (
    <I18nContext.Provider value={dict}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
