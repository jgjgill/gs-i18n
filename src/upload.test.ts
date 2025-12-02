import { beforeEach, describe, expect, it } from "vitest";
import { mockGetScannerInfo } from "./__tests__/test-utils";
import { makeUpdateSheetRow, updateSheetRow } from "./upload";

describe("makeUpdateSheetRow", () => {
	beforeEach(() => {
		mockGetScannerInfo();
	});

	it("헤더가 존재할 때 원본 객체에 번역 값을 추가하고 반환해야 한다.", () => {
		const result = { 키: "안녕하세요" };
		const language: [string, string] = ["ko", "안녕하세요"];

		const returned = makeUpdateSheetRow(result, language);

		expect(result).toEqual({
			키: "안녕하세요",
			한국어: "안녕하세요",
		});
		expect(returned).toBe(result);
	});
});

describe("updateSheetRow", () => {
	beforeEach(() => {
		mockGetScannerInfo({
			columnKeyToHeader: {
				key: "키",
				ko: "한글",
				en: "영어",
				ja: "일본어",
			},
		});
	});

	it("기본 키와 번역 값을 시트 row로 변환해야 한다.", () => {
		const row = updateSheetRow("이름", { ko: "이름", en: "name" });

		expect(row).toEqual({
			키: "이름",
			한글: "이름",
			영어: "name",
		});
	});

	it("복수형 _one 케이스를 처리해야 한다.", () => {
		const row = updateSheetRow("이름_one", { ko: "_N/A", ja: "_N/A" });

		expect(row).toEqual({
			키: "이름_one",
			한글: "_N/A",
			일본어: "_N/A",
		});
	});

	it("복수형 _other 케이스를 처리해야 한다.", () => {
		const row = updateSheetRow("이름_other", { ko: "이름", en: "name" });

		expect(row).toEqual({
			키: "이름_other",
			한글: "이름",
			영어: "name",
		});
	});
});
