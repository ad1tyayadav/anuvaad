import ChatPage from "./Chatpage";
import { loadTranslations } from "../lib/load-translations";

export default function Page() {
  const translations = loadTranslations(); // SERVER SIDE
  return <ChatPage translations={translations} />;
}
