import "./globals.css";
import { getLocale } from "@/app/lib/get-locale";
import { getTranslations } from "@/app/lib/i18n";
import { I18nProvider } from "@/app/providers/i18n-provider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const dict = await getTranslations(locale);

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-gray-50 text-gray-900">
          <I18nProvider dict={dict}>
            <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-10">
            {children}
        </main>
        <Footer />
          </I18nProvider>
      </body>
    </html>
  );
}
