import { exec } from "node:child_process";
import path from "node:path";
import dotenv from "dotenv";
import type {
	GoogleSpreadsheet,
	GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

dotenv.config();

export const spreadsheetDocId = process.env.SPREADSHEET_DOC_ID;
export const googleServiceAccountEmail =
	process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
export const googlePrivateKey = process.env.GOOGLE_PRIVATE_KEY;
export const sheetId = process.env.SHEET_ID;

export const NOT_AVAILABLE_CELL = "_N/A";

export async function runCommand(command: string) {
	return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(error);
				return;
			}

			resolve({ stdout, stderr });
		});
	});
}

export async function addNewSheet(
	doc: GoogleSpreadsheet,
	title: string,
	sheetId: string,
	headerValues: string[],
): Promise<GoogleSpreadsheetWorksheet> {
	const sheet = await doc.addSheet({
		sheetId: Number(sheetId),
		title,
		headerValues,
	});

	return sheet;
}

export function getScannerInfo() {
	const cwd = process.cwd();
	const configFilePath = path.join(cwd, "i18next-scanner.config.cjs");
	const config = require(configFilePath);

	const loadPath: string = config.options.resource.loadPath;
	const localePath: string = loadPath.replace("/{{lng}}/common.json", "");
	const namespace: string = config.options.ns[0];
	const languages: string[] = config.options.lngs;
	const columnKeyToHeader: Record<string, string> =
		config.options.metadata.columnKeyToHeader;
	const headerValues: string[] = Object.values(columnKeyToHeader);

	return {
		loadPath,
		localePath,
		namespace,
		languages,
		columnKeyToHeader,
		headerValues,
	};
}
