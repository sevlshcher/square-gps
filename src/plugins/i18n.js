import { createI18n } from 'vue-i18n'
import en from '../locales/en.yaml'
import ru from '../locales/ru.yaml'

export default createI18n({
  legacy: false,
  locale: JSON.parse(window.localStorage.getItem('locale')) || 'en',
  fallbackLocale: 'en',
  availableLocales: ['en', 'ru'],
  messages: {
    en,
    ru
  }
})
