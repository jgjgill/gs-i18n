import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import {
  googlePrivateKey,
  googleServiceAccountEmail,
  spreadsheetDocId,
} from "./libs";

export async function loadSpreadsheetInfo() {
  const serviceAccountAuth = new JWT({
    email: googleServiceAccountEmail,
    key: googlePrivateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  if (!spreadsheetDocId) {
    throw new Error("SPREADSHEET_DOC_ID is not defined");
  }

  if (!googleServiceAccountEmail) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL is not defined");
  }

  const doc = new GoogleSpreadsheet(spreadsheetDocId, serviceAccountAuth);

  await doc.loadInfo().catch((error) => {
    throw new Error(`Failed to load spreadsheet info. ${error}`);
  });

  return doc;
}
