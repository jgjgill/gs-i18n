# gs-i18n

> Google Sheets와 i18next를 활용한 다국어 관리 자동화 CLI 도구

**gs-i18n**은 Google Spreadsheet를 활용하여 다국어 번역을 효율적으로 관리할 수 있는 CLI 도구입니다. 개발자와 번역가가 협업하기 쉽도록 설계되었으며, 코드와 스프레드시트 간의 양방향 동기화를 지원합니다.

## 특징

- 🔄 **양방향 동기화**: 코드 ↔ Google Sheets 간 번역 데이터 자동 동기화
- 📊 **중앙 집중식 관리**: Google Sheets를 통한 다국어 번역 중앙 관리
- 🚀 **간편한 사용법**: 인터랙티브 CLI를 통한 직관적인 작업 플로우
- 🛠 **TypeScript 지원**: 타입 안전성이 보장된 개발 환경
- 🌍 **다국어 지원**: 한국어, 영어, 일본어, 중국어 등 다양한 언어 지원

## 빠른 시작

```bash
# 프로젝트에서 바로 실행
npx gs-i18n

# 또는 전역 설치
npm install -g gs-i18n
gs-i18n
```

## 준비사항

### 1. Google Cloud Project 설정

1. [Google Cloud Console](https://console.cloud.google.com)에서 프로젝트 생성
2. Google Sheets API 활성화
3. 서비스 계정 생성 및 JSON 키 다운로드

### 2. 환경변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 설정:

```env
SPREADSHEET_DOC_ID=your_spreadsheet_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
SHEET_ID=0  # 기본 시트 ID
```

### 3. Google Spreadsheet 권한 설정

1. 생성한 Google Spreadsheet에 서비스 계정 이메일 공유
2. 편집 권한 부여

## 사용법

### 초기 설정

```bash
# 프로젝트 초기화
npx gs-i18n
```

실행하면 다음과 같은 메뉴가 표시됩니다:

```
Google 스프레드시트 관리 도구

? 원하는 작업을 선택하세요
❯ 스프레드시트 정보 조회하기
  i18next-scanner 파일 생성하기
  다국어 관련 기본 파일 구성하기
  다국어 코드 시트에 반영하기
  시트 번역 내용 코드에 반영하기
  종료
```

### 워크플로우

#### 1. 초기 설정

```bash
# i18next-scanner 설정 파일 생성
npx gs-i18n
→ "i18next-scanner 파일 생성하기" 선택

# 다국어 파일 구조 생성
npx gs-i18n
→ "다국어 관련 기본 파일 구성하기" 선택
```

#### 2. 번역 관리 주기

```bash
# 1. 코드의 번역 키를 스프레드시트에 업로드
npx gs-i18n
→ "다국어 코드 시트에 반영하기" 선택

# 2. 번역가가 스프레드시트에서 번역 작업

# 3. 번역된 내용을 코드에 다운로드
npx gs-i18n
→ "시트 번역 내용 코드에 반영하기" 선택
```

## 기능 상세

### 스프레드시트 정보 조회하기

연결된 Google Spreadsheet의 기본 정보를 확인합니다.

```
스프레드시트 제목: My i18n Project
시트 수: 1

시트 목록
1. 번역 시트 (ID: 0)
```

### i18next-scanner 파일 생성하기

프로젝트에 맞는 i18next-scanner 설정 파일을 인터랙티브하게 생성합니다.

- 지원 언어 선택 (다중 선택 가능)
- 기본 언어 설정
- 파일 경로 자동 설정

### 다국어 관련 기본 파일 구성하기

코드에서 사용된 번역 키를 스캔하여 기본 번역 파일 구조를 생성합니다.

```
public/
  └── locales/
      ├── ko-KR/
      │   └── common.json
      ├── en-US/
      │   └── common.json
      └── ja-JP/
          └── common.json
```

### 다국어 코드 시트에 반영하기 (Upload)

로컬 JSON 파일의 번역 키를 Google Sheets에 업로드합니다.

- 새로운 키 자동 추가
- 기존 키는 유지
- 언어별 번역 값 동기화

### 시트 번역 내용 코드에 반영하기 (Download)

Google Sheets의 번역 내용을 로컬 JSON 파일에 다운로드합니다.

- 번역된 내용 자동 반영
- 파일 포맷 자동 정리

## Google Sheets 구조

| 키          | 한국어      | 영어      | 일본어     |
| ----------- | ----------- | --------- | ---------- |
| 환영합니다  | 환영합니다  | Welcome   | ようこそ   |
| 로그아웃    | 로그아웃    | Logout    | ログアウト |
| 사용자 이름 | 사용자 이름 | User Name | ユーザー名 |

## 설정 예시

### i18next-scanner.config.cjs

```javascript
module.exports = {
  input: ["./src/**/*.{ts,tsx}", "!**/node_modules/**"],
  options: {
    defaultLng: "ko-KR",
    lngs: ["ko-KR", "en-US", "ja-JP"],
    ns: ["common"],
    resource: {
      loadPath: "./public/locales/{{lng}}/common.json",
      savePath: "./public/locales/{{lng}}/common.json",
    },
    // ... 기타 설정
  },
};
```

### JSON 번역 파일 구조

```json
{
  "환영합니다": "환영합니다",
  "로그아웃": "로그아웃",
  "사용자 이름": "사용자 이름"
}
```

## 프로젝트 구조

```
my-project/
├── .env                        # 환경변수 설정
├── i18next-scanner.config.cjs  # i18next-scanner 설정
├── public/
│   └── locales/               # 번역 파일 디렉토리
│       ├── ko-KR/
│       │   └── common.json
│       └── en-US/
│           └── common.json
└── src/
    └── your-code.tsx          # 번역 키 사용 코드
```

## 자주 묻는 질문

**Q: 스프레드시트를 찾을 수 없다는 오류가 발생합니다.**
A: 서비스 계정에 스프레드시트 편집 권한이 있는지 확인하세요.

**Q: 환경변수가 인식되지 않습니다.**
A: `.env` 파일이 프로젝트 루트에 있는지, 올바른 형식인지 확인하세요.

### 이슈 보고

버그를 발견하거나 기능 제안이 있으시면 [이슈](https://github.com/jgjgill/gs-i18n/issues/new)를 생성해주세요.

## 지원

- GitHub: [@jgjgill](https://github.com/jgjgill)
- 이메일: dbdltm22@naver.com

---

Made with ❤️ by [jgjgill](https://github.com/jgjgill)
