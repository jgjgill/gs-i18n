import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import {
	getGooglePrivateKey,
	getGoogleServiceAccountEmail,
	getSpreadsheetDocId,
} from "./libs";

export async function loadSpreadsheetInfo() {
	const serviceAccountAuth = new JWT({
		email: getGoogleServiceAccountEmail(),
		key: getGooglePrivateKey(),
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});

	if (!getSpreadsheetDocId()) {
		throw new Error("SPREADSHEET_DOC_ID is not defined");
	}

	if (!getGoogleServiceAccountEmail()) {
		throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL is not defined");
	}

	const doc = new GoogleSpreadsheet(
		String(getSpreadsheetDocId()),
		serviceAccountAuth,
	);

	await doc.loadInfo().catch((error) => {
		throw new Error(`Failed to load spreadsheet info. ${error}`);
	});

	return doc;
}
