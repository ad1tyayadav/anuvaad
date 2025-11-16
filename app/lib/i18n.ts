/* eslint-disable @typescript-eslint/no-unused-vars */
export async function getTranslations(locale: string) {
  try {
    const file = await import(`@/locales/${locale}.json`);
    return file.default;
  } catch (error) {
    console.warn(`Locale file missing: ${locale}. Falling back to en.`);
    const file = await import(`@/locales/en.json`);
    return file.default;
  }
}

export function t(key: string, dict: Record<string, string>) {
  return dict[key] || key;
}
