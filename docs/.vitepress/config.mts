import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "gs-i18n",
  description: "Google Sheets i18n automation CLI site",
  base: "/gs-i18n/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Introduce", link: "/introduce" },
      { text: "Usage", link: "/usage" },
    ],

    sidebar: [
      { text: "Introduce", link: "/introduce" },
      {
        text: "Usage",
        link: "/usage",
        items: [
          { text: "info", link: "/usage/info" },
          { text: "scan-config", link: "/usage/scan-config" },
          { text: "scan", link: "/usage/scan" },
          { text: "upload", link: "/usage/upload" },
          { text: "download", link: "/usage/download" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/jgjgill/gs-i18n" },
    ],
  },
});
