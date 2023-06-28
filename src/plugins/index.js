import vuetify from './vuetify'
import i18n from './i18n'
import router from '../router'
import store from '../store'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(i18n)
    .use(router)
    .use(store)
}
