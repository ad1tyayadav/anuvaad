import "./globals.css";
import { getLocale } from "@/app/lib/get-locale";
import { getTranslations } from "@/app/lib/i18n";
import { I18nProvider } from "@/providers/i18n-provider";
import LanguageSwitcher from "./(ui)/lang-switcher";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = await getTranslations(locale);

  return (
    <html lang={locale}>
      <body>
        <div className="p-4 border-b flex justify-end">
          <LanguageSwitcher />
        </div>

        <I18nProvider dict={dict}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
