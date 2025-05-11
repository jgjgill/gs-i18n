import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <h1>
        {t("현재 언어: ")}
        {i18n.language}
      </h1>
      <button type="button" onClick={() => changeLanguage("ko-KR")}>
        ko-KR
      </button>
      <button type="button" onClick={() => changeLanguage("en-US")}>
        en-US
      </button>
      <button type="button" onClick={() => changeLanguage("ja-JP")}>
        ja-JP
      </button>
      <button type="button" onClick={() => changeLanguage("zh-CN")}>
        zh-CN
      </button>
      <h2>{t("안녕하세요.")}</h2>
    </div>
  );
}

export default App;
