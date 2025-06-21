import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ko-KR', 'en-US', 'ja-JP', 'zh-CN'],
 
  // Used when no locale matches
  defaultLocale: 'ko-KR'
});