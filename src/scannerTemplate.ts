interface ScannerConfig {
	defaultLanguage: string;
	selectedLanguages: string[];
	columnKeyToHeader: Record<string, string>;
}

export const generateConfigContent = ({
	defaultLanguage,
	selectedLanguages,
	columnKeyToHeader,
}: ScannerConfig) => `
// i18next-scanner 설정 파일
// 자동 생성됨: ${new Date().toISOString()}

module.exports = {
  input: ["./src/**/*.{ts,tsx}", "!**/node_modules/**"],
  options: {
    removeUnusedKeys: true,
    sort: true,
    defaultLng: "${defaultLanguage}",
    lngs: ${JSON.stringify(selectedLanguages)},
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
      const keyAsDefaultValue = ["${defaultLanguage}"];

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
      columnKeyToHeader: ${JSON.stringify(columnKeyToHeader)}
    }
  },
};
`;
