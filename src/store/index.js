import { createStore } from 'vuex'
import geocode from './modules/geocode'
import map from './modules/map'

export default createStore({
  modules: {
    geocode,
    map
  }
})
