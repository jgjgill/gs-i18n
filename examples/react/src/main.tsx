import i18n from "i18next";
import Backend from "i18next-http-backend";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initReactI18next } from "react-i18next";
import App from "./App.tsx";

i18n.use(initReactI18next).use(Backend).init({
	ns: "common",
	fallbackLng: "ko-KR",
});

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
