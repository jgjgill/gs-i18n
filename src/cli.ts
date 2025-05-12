import fs from "node:fs";
import path from "node:path";
import * as prompts from "@clack/prompts";
import colors from "picocolors";
import { updateJsonFromSheet } from "./download";
import { loadSpreadsheetInfo } from "./googleSheets";
import { runCommand } from "./libs";
import { generateConfigContent } from "./scannerTemplate";
import { updateSheetFromJson } from "./upload";

export async function main() {
	prompts.intro(colors.blue("Google 스프레드시트 관리 도구"));

	try {
		await mainMenu();
	} catch (error) {
		if (error instanceof Error) {
			prompts.log.error(error.message);
		}
	}

	prompts.outro(
		colors.green("Google 스프레드시트 관리 도구를 이용해 주셔서 감사합니다."),
	);
}

async function mainMenu() {
	const action = await prompts.select({
		message: "원하는 작업을 선택하세요",
		options: [
			{ value: "info", label: "스프레드시트 정보 조회하기" },
			{ value: "scan-config", label: "i18next-scanner 파일 생성하기" },
			{ value: "scan", label: "다국어 관련 기본 파일 구성하기" },
			{ value: "upload", label: "다국어 코드 시트에 반영하기" },
			{ value: "download", label: "시트 번역 내용 코드에 반영하기" },
			{ value: "exit", label: "종료" },
		],
	});

	if (prompts.isCancel(action)) {
		prompts.log.info("작업이 취소되었습니다.");
		return;
	}

	switch (action) {
		case "info":
			await showSpreadsheetInfo();
			break;
		case "scan-config":
			await createI18nextScannerConfig();
			break;
		case "scan":
			await runI18nextScanner();
			break;
		case "upload":
			await uploadTranslations();
			break;
		case "download":
			await downloadTranslations();
			break;
		case "exit":
			return;
	}

	const continueAction = await prompts.confirm({
		message: "메인 메뉴로 돌아가시겠습니까?",
	});

	if (!prompts.isCancel(continueAction) && continueAction) {
		await mainMenu();
	}
}

async function showSpreadsheetInfo() {
	const s = prompts.spinner();
	s.start("스프레드시트 정보를 로드하는 중...");

	try {
		const doc = await loadSpreadsheetInfo();

		s.stop("스프레드시트 정보를 성공적으로 로드했습니다.");

		prompts.log.step(`스프레드시트 제목: ${colors.green(doc.title)}`);
		prompts.log.step(
			`시트 수: ${colors.green(Object.keys(doc.sheetsById).length)}`,
		);

		const sheetsInfo = doc.sheetsByIndex
			.map(
				(sheet, index) => `${index + 1}. ${sheet.title} (ID: ${sheet.sheetId})`,
			)
			.join("\n");

		prompts.note(sheetsInfo, "시트 목록");
	} catch (error) {
		s.stop("스프레드시트 정보 로드 실패");

		if (error instanceof Error) {
			prompts.log.error(error.message);
		}
	}
}

async function createI18nextScannerConfig() {
	const s = prompts.spinner();
	s.start("i18next-scanner 설정 파일 생성 준비 중...");

	try {
		const cwd = process.cwd();
		const configFilePath = path.join(cwd, "i18next-scanner.config.cjs");

		if (fs.existsSync(configFilePath)) {
			s.stop("설정 파일이 이미 존재합니다");
			return;
		}

		s.stop("사용자 설정 입력");

		const options = [
			{ value: "ko-KR", label: "한국어", hint: "기본값" },
			{ value: "en-US", label: "영어 (미국)" },
			{ value: "ja-JP", label: "일본어" },
			{ value: "zh-CN", label: "중국어 (간체)" },
			{ value: "zh-TW", label: "중국어 (번체)" },
			{ value: "fr-FR", label: "프랑스어" },
			{ value: "de-DE", label: "독일어" },
		];

		const selectedLanguages = await prompts.multiselect({
			message: "지원할 언어를 선택하세요 (선택: 스페이스바)",
			options,
			initialValues: ["ko-KR"],
		});

		if (prompts.isCancel(selectedLanguages)) {
			prompts.log.info("설정 파일 생성이 취소되었습니다.");
			return;
		}

		const defaultLanguage = await prompts.select({
			message: "기본 언어를 선택하세요",
			options: selectedLanguages.map((lng) => ({ value: lng, label: lng })),
			initialValue: "ko-KR",
		});

		if (prompts.isCancel(defaultLanguage)) {
			prompts.log.info("설정 파일 생성이 취소되었습니다.");
			return;
		}

		s.start("설정 파일 생성 중...");
		const configContent = generateConfigContent({
			defaultLanguage,
			selectedLanguages,
			columnKeyToHeader: selectedLanguages.reduce(
				(acc, lng) => {
					acc[lng] = lng;
					return acc;
				},
				{ key: "키" } as Record<string, string>,
			),
		});

		await fs.promises.writeFile(configFilePath, configContent, "utf8");

		s.stop("설정 파일 생성 완료");
		prompts.log.success(
			`i18next-scanner 설정 파일이 생성되었습니다: ${configFilePath}`,
		);
	} catch (error) {
		s.stop("설정 파일 생성 실패");

		if (error instanceof Error) {
			prompts.log.error(error.message);
		}
	}
}

async function runI18nextScanner() {
	const s = prompts.spinner();
	s.start("다국어 스캔 실행 중...");

	try {
		const cwd = process.cwd();
		const configFilePath = path.join(cwd, "i18next-scanner.config.cjs");

		if (!fs.existsSync(configFilePath)) {
			s.stop("설정 파일이 없습니다.");
			prompts.log.error(
				`i18next-scanner.config.cjs 파일을 찾을 수 없습니다: ${configFilePath}`,
			);

			const createConfig = await prompts.confirm({
				message: "i18next-scanner 설정 파일을 생성하시겠습니까?",
			});

			if (prompts.isCancel(createConfig) || !createConfig) {
				return;
			}

			await createI18nextScannerConfig();
		}

		const config = require(configFilePath);

		// 필요한 값 추출
		const lngs = config.options?.lngs || [];

		// loadPath 추출
		const loadPath = config.options?.resource?.loadPath || "";

		// savePath에서 경로와 파일명 분리
		const savePath = config.options?.resource?.savePath || "";

		console.log(lngs, loadPath, savePath);

		s.message(`설정 파일 사용: ${configFilePath}`);

		await runCommand(`npx i18next-scanner --config ${configFilePath}`);

		s.stop("i18next-scanner가 성공적으로 실행되었습니다.");
	} catch (error) {
		s.stop("다국어 스캔 실패");

		if (error instanceof Error) {
			prompts.log.error(error.message);
		}
	}
}

async function uploadTranslations() {
	const s = prompts.spinner();
	s.start("로컬 JSON 파일의 번역 데이터를 스프레드시트에 업로드하는 중...");

	try {
		await updateSheetFromJson();
		s.stop("번역 데이터가 성공적으로 업로드되었습니다.");
		prompts.log.success("모든 번역 키가 스프레드시트에 반영되었습니다.");
	} catch (error) {
		s.stop("번역 데이터 업로드 실패");

		if (error instanceof Error) {
			prompts.log.error(error.message);
		}
	}
}

async function downloadTranslations() {
	const s = prompts.spinner();
	s.start("스프레드시트에서 번역 데이터를 다운로드하는 중...");

	try {
		await updateJsonFromSheet();
		s.stop("번역 데이터가 성공적으로 다운로드되었습니다.");
		prompts.log.success("모든 언어 파일이 업데이트되었습니다.");
	} catch (error) {
		s.stop("번역 데이터 다운로드 실패");

		if (error instanceof Error) {
			prompts.log.error(error.message);
		}
	}
}
