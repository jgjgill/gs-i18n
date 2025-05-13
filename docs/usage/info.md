# info

스프레드시트 정보 조회 기능은 현재 연결된 Google Spreadsheet의 기본 정보와 시트 목록을 확인할 수 있어요. 이는 gs-i18n의 가장 기본적인 기능으로, 설정이 올바르게 되었는지 확인할 때 유용해요.

## 기능 개요

다음 정보를 제공해요.

- 스프레드시트 제목
- 총 시트 수
- 각 시트의 이름과 ID

## 사용 방법

### 1. CLI 실행

```bash
npx gs-i18n
```

### 2. 메뉴에서 선택

```
? 원하는 작업을 선택하세요
❯ 스프레드시트 정보 조회하기
  ...
```

### 3. 결과 확인

```
스프레드시트 정보를 로드하는 중... ✔

스프레드시트 제목: 다국어 번역 관리
시트 수: 3

시트 목록
1. 번역 시트 (ID: 0)
2. 메타데이터 (ID: 123456789)
3. 변경 이력 (ID: 987654321)
```

## 주요 용도

### 연결 상태 확인

- Google Sheets API 연결 테스트
- 서비스 계정 권한 검증
- `gs-i18n.json` 설정 확인

### 시트 구조 파악

- 사용 가능한 시트 목록 확인
- 시트 ID 확인 (`gs-i18n.json` 설정용)
- 전체적인 스프레드시트 구조 이해

## 기술적 구현

내부적으로 이 기능은 다음과 같이 동작합니다.

```typescript
// googleSheets.ts
export async function loadSpreadsheetInfo() {
  const serviceAccountAuth = new JWT({
    email: getGoogleServiceAccountEmail(),
    key: getGooglePrivateKey(),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

	const doc = new GoogleSpreadsheet(
		String(getSpreadsheetDocId()),
		serviceAccountAuth,
	);
  
  await doc.loadInfo();

  return doc;
}
```

```typescript
// cli.ts
async function showSpreadsheetInfo() {
  const s = prompts.spinner();
  s.start("스프레드시트 정보를 로드하는 중...");

  try {
    const doc = await loadSpreadsheetInfo();
    s.stop("스프레드시트 정보를 성공적으로 로드했습니다.");

    prompts.log.step(`스프레드시트 제목: ${colors.green(doc.title)}`);
    prompts.log.step(
      `시트 수: ${colors.green(Object.keys(doc.sheetsById).length)}`
    );

    const sheetsInfo = doc.sheetsByIndex
      .map(
        (sheet, index) => `${index + 1}. ${sheet.title} (ID: ${sheet.sheetId})`
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
```

## 활용 팁

::: tip 개발 워크플로우
개발 시작 전 항상 `info` 명령을 실행하여 연결 상태를 확인하세요. 잠재적인 연결 문제를 미리 발견하는데 도움이 되어요.
:::

::: info 시트 ID 확인
`sheetId` 설정할 때 기본값은 0이지만, 프로젝트에 따라 다른 ID를 사용할 수 있어요.
:::

## 다음 단계

스프레드시트 연결이 확인되었다면

1. [i18next-scanner 설정 생성](/usage/scan-config)으로 진행하세요.
2. 또는 기존 설정이 있다면 [다국어 파일 스캔](/usage/scan)을 시작하세요.

## 관련 기능

- [scan-config](/usage/scan-config): i18next-scanner 설정 생성
- [upload](/usage/upload): 번역 데이터 업로드
- [download](/usage/download): 번역 데이터 다운로드
