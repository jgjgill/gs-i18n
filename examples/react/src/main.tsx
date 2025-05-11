import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n.use(initReactI18next).use(Backend).init({
  ns: "common",
  fallbackLng: "ko-KR",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
