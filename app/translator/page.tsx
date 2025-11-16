import { loadTranslations } from "../lib/load-translations";
import TranslatorDashboard from "../components/TranslatorDashboard";

export default function Page() {
  const translations = loadTranslations(); // server-side only
  return <TranslatorDashboard translations={translations} />;
}
