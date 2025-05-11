
// i18next-scanner 설정 파일
// 자동 생성됨: 2025-05-11T07:41:25.512Z

module.exports = {
  input: ["./src/**/*.{ts,tsx}", "!**/node_modules/**"],
  options: {
    defaultLng: "ko-KR",
    lngs: ["ko-KR","en-US","ja-JP","zh-CN"],
    ns: ["common"],
    func: {
      list: ["i18next.t", "i18n.t", "t"],
      extensions: [".ts", ".tsx"],
    },
    resource: {
      loadPath: "./public/locales/{{lng}}/common.json",
      savePath: "./public/locales/{{lng}}/common.json",
    },
    defaultValue(lng, ns, key) {
      const keyAsDefaultValue = ["ko-KR"];

      if (keyAsDefaultValue.includes(lng)) {
        const separator = "~~";
        const value = key.includes(separator) ? key.split(separator)[1] : key;

        return value;
      }

      return "";
    },
    compatibilityJSON: "v4", // https://github.com/i18next/i18next-scanner/pull/252
    keySeparator: false,
    nsSeparator: false,
    prefix: "%{",
    suffix: "}",
    metadata: {
      columnKeyToHeader: {"key":"키","ko-KR":"ko-KR","en-US":"en-US","ja-JP":"ja-JP","zh-CN":"zh-CN"}
    }
  },
};
