import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import fs from "fs";
import path from "path";
import {
  addNewSheet,
  getScannerInfo,
  NOT_AVAILABLE_CELL,
  sheetId,
} from "./libs";
import { loadSpreadsheetInfo } from "./googleSheets";
import { each, fx, reduce } from "@fxts/core";

type LanguageMap = {
  [language: string]: {
    [key: string]: string;
  };
};

/**
 * 스프레드시트로부터 번역 데이터를 가져와 JSON 형태로 변환
 * @param doc 구글 스프레드시트 문서 객체
 * @returns 언어별 번역 데이터 매핑 객체
 */

async function fetchTranslationsFromSheetToJson(
  doc: GoogleSpreadsheet
): Promise<LanguageMap> {
  if (!sheetId) {
    throw new Error("SHEET_ID is not defined");
  }

  const title = "번역 시트";
  const { headerValues } = getScannerInfo();

  const sheet =
    doc.sheetsById[Number(sheetId)] ??
    (await addNewSheet(doc, title, sheetId, headerValues));

  await sheet.setHeaderRow(headerValues);
  const rows = await sheet.getRows();

  console.log(sheet);

  const languagesMap = reduce(makeLanguagesMap, {}, rows);

  return languagesMap;
}

const makeLanguagesMap = (
  acc: LanguageMap,
  row: GoogleSpreadsheetRow
): LanguageMap => {
  const { languages, columnKeyToHeader } = getScannerInfo();

  const key = row.get(columnKeyToHeader.key);

  each((language) => {
    const translatedExpression = row.get(columnKeyToHeader[language]);

    if (!acc[language]) {
      acc[language] = {};
    }

    if (translatedExpression === NOT_AVAILABLE_CELL) {
      return;
    }

    acc[language][key] = translatedExpression ?? "";
  }, languages);

  return acc;
};

export async function updateJsonFromSheet(): Promise<void> {
  try {
    const { localePath, namespace } = getScannerInfo();

    const doc = await loadSpreadsheetInfo();
    const languagesMap = await fetchTranslationsFromSheetToJson(doc);

    const languageDirs = await fs.promises.readdir(localePath);

    await fx(languageDirs)
      .filter((language) => languagesMap[language])
      .toAsync()
      .each(async (language) => {
        const localeJsonFilePath = path.join(
          localePath,
          language,
          `${namespace}.json`
        );

        const jsonString = JSON.stringify(languagesMap[language], null, 2);
        fs.promises.writeFile(localeJsonFilePath, jsonString, "utf-8");
      });
  } catch (error) {
    throw new Error(`Download Error: ${error}`);
  }
}
