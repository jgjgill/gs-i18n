---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "gs-i18n"
  text: "Google Sheets i18n automation CLI"
  tagline: Google Sheets와 i18next를 활용한 다국어 관리 CLI 도구
  actions:
    - theme: brand
      text: Introduce
      link: /introduce
    - theme: alt
      text: Usage
      link: /usage

features:
  - title: 양방향 동기화
    details: 코드의 번역 키를 Google Sheets로 업로드하고, 번역된 내용을 다시 JSON 파일로 다운로드하는 완벽한 동기화 시스템
  - title: Google Sheets 기반 협업
    details: 친숙한 스프레드시트 환경에서 실시간 협업이 가능하며, 번역 진행 상황을 한눈에 파악
  - title: 간편한 CLI 인터페이스
    details: npx gs-i18n 한 줄로 모든 작업을 시작할 수 있는 직관적인 인터랙티브 CLI 제공
  - title: i18next 생태계 통합
    details: 기존 i18next 프로젝트와 완벽하게 호환되며, i18next-scanner와 통합되어 자동으로 번역 키 추출
---
