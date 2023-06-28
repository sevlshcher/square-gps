import { geocodeApiService } from '@/common/api/geocode.api-service';

export default {
  state: {
    apiError: { isError: false, message: '' },
    addresses: {}
  },
  getters: {
    getApiError: state => state.apiError,
    getAllAddresses: state => state.addresses,
    getAddress: state => id => {
      return state.addresses[id]
    }
  },
  actions: {
    SET_API_ERROR ({commit}, msg) {
      commit('setApiError', msg)
    },
    async CONVERT_COORDS ({commit}, { id, coords, ignoreError = false }) {
      const data = await geocodeApiService.convertCoords(coords)
      !data.error
        ? commit('setAddress', { id, data })
        : !ignoreError && commit('setApiError', data.error)
    }
  },
  mutations: {
    setApiError(state, msg = '') {
      state.apiError = {
        isError: !!msg,
        message: msg
      }
    },
    setAddress (state, { id, data }) {
      state.addresses[id] = data?.display_name || ''
    }
  }
}
