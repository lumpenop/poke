import type { SupportedLanguages, LanguageOption } from '../types/translation';

/**
 * 지원되는 언어 목록
 */
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ko', name: '한국어' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
];

/**
 * 언어 코드가 유효한지 확인
 */
export const isValidLanguage = (code: string): code is SupportedLanguages => {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
};

/**
 * 언어 코드로 언어 옵션 찾기
 */
export const getLanguageOption = (
  code: SupportedLanguages
): LanguageOption | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

/**
 * 기본 언어 설정
 */
export const DEFAULT_LANGUAGE: SupportedLanguages = 'ko';

/**
 * 브라우저 언어 감지 및 지원되는 언어로 변환
 */
export const detectBrowserLanguage = (): SupportedLanguages => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const browserLang = navigator.language.split('-')[0];
  return isValidLanguage(browserLang) ? browserLang : DEFAULT_LANGUAGE;
};
