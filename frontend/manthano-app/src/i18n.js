import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
 
i18n
 .use(Backend)
 // detect user language
  //.use(LanguageDetector)
 // pass the i18n instance to react-i18next.
 .use(initReactI18next)
 // init i18next
 .init({
   fallbackLng: 'en',
   debug: true,
   interpolation: {
     escapeValue: false, // not needed for react as it escapes by default
   },
   react: {
     bindI18n: 'languageChanged',
     bindI18nStore: '',
     transEmptyNodeValue: '',
     transSupportBasicHtmlNodes: true,
     transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
     useSuspense: false,
   }
 });
export default i18n;