import { useTranslation } from 'react-i18next';
import type { SupportedLanguages, LanguageOption } from '../types/translation';
import { SUPPORTED_LANGUAGES, isValidLanguage } from '../utils/translation';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: SupportedLanguages) => {
    if (isValidLanguage(language)) {
      i18n.changeLanguage(language);
    }
  };

  const getCurrentLanguage = (): SupportedLanguages => {
    const currentLang = i18n.language;
    return isValidLanguage(currentLang) ? currentLang : 'ko';
  };

  const getAvailableLanguages = (): LanguageOption[] => {
    return SUPPORTED_LANGUAGES;
  };

  return {
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
  };
};
