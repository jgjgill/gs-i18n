import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

export default function Home() {
	const t = useTranslations()
	const locale = useLocale()
	
  return (
		<div>
			<h1>
				{t("현재 언어: ")}
				{locale}
			</h1>

			<Link href="/" locale="ko-KR" style={{ marginRight: "10px" }}>
				ko-KR
			</Link>
			<Link href="/" locale="en-US" style={{ marginRight: "10px" }}>
				en-US
			</Link>
			<Link href="/" locale="ja-JP" style={{ marginRight: "10px" }}>
				ja-JP
			</Link>
			<Link href="/" locale="zh-CN" style={{ marginRight: "10px" }}>
				zh-CN
			</Link>

			<h2>{t("안녕하세요")}</h2>
		</div>
  );
}
