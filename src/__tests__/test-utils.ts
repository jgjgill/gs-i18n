import { vi } from "vitest";
import * as libs from "../libs";

/**
 * getScannerInfo 함수를 mock합니다.
 * @param overrides - 기본값을 오버라이드할 설정
 */
export function mockGetScannerInfo(overrides: Partial<ReturnType<typeof libs.getScannerInfo>> = {}) {
	const defaultMock = {
		loadPath: "public/locales/{{lng}}/common.json",
		localePath: "public/locales",
		namespace: "common",
		languages: ["ko", "en"],
		columnKeyToHeader: {
			key: "키",
			ko: "한국어",
			en: "English",
		},
		headerValues: ["키", "한국어", "English"],
	};

	return vi.spyOn(libs, "getScannerInfo").mockReturnValue({
		...defaultMock,
		...overrides,
	});
}
