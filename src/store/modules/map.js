import { backendApiService } from '@/common/api/backend.api-service'

export default {
  state: {
    markers: []
  },
  getters: {
    getMarkers: state => state.markers,
    getMarkerById: state => id => {
      return state.markers.find(marker => marker.id === id)
    }
  },
  actions: {
    async FETCH_MARKERS ({dispatch, commit, rootGetters}) {
      const markers = await backendApiService.fetchMarkers()
      if (markers.length) {
        await Promise.all(markers.map(async (marker) => {
          const { id, coords } = marker
          return await dispatch('CONVERT_COORDS', { id, coords, ignoreError: true })
        }))
        const addresses = Object.keys(rootGetters.getAllAddresses)
        const allowedMarkers = markers.filter(marker => addresses.includes(marker.id))
        commit('setMarkers', allowedMarkers)
      }
    },
    async ADD_MARKER ({commit}, marker) {
      const markerWithoutEl = { id: marker.id, coords: marker.coords }
      await backendApiService.addMarker(markerWithoutEl)
      commit('addMarker', marker)
    },
    UPDATE_MARKER ({commit}, marker) {
      commit('updateMarker', marker)
    },
    async REMOVE_MARKER ({commit}, id) {
      await backendApiService.removeMarker(id)
      commit('removeMarker', id)
    },
    SET_LOCALE (_, locale) {
      backendApiService.setLocale(locale)
    }
  },
  mutations: {
    setMarkers (state, markers) {
      state.markers = markers
    },
    addMarker (state, marker) {
      if (!state.markers.some(item => item.id === marker.id)) {
        state.markers.push(marker)
      }
    },
    updateMarker (state, marker) {
      const index = state.markers.findIndex(item => item.id === marker.id)
      if (index > -1) {
        state.markers.splice(index, 1, marker)
      }
    },
    removeMarker (state, id) {
      const index = state.markers.findIndex(item => item.id === id)
      if (index > -1) {
        state.markers.splice(index, 1)
      }
    }
  }
}
