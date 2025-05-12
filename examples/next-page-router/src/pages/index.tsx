import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

export default function Home() {
	const { t, i18n } = useTranslation("common");

	return (
		<div>
			<h1>
				{t("현재 언어: ")}
				{i18n.language}
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

			<h2>{t("안녕하세요.")}</h2>
		</div>
	);
}

export const getStaticProps = (async (context) => {
	console.log(context.locale);
	return {
		props: { ...(await serverSideTranslations(context.locale ?? "ko-KR")) },
	};
}) satisfies GetStaticProps;
