class BackendApiService {
  async fetchMarkers () {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const data = localStorage.getItem('markers')
    return data ? JSON.parse(data) : []
  }

  async addMarker (marker) {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const data = localStorage.getItem('markers')
    const existingData = data ? JSON.parse(data) : []
    const updatedData = [...existingData, marker]
    localStorage.setItem('markers', JSON.stringify(updatedData))
  }

  async removeMarker (markerId) {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const data = localStorage.getItem('markers')
    const existingData = data ? JSON.parse(data) : []
    const updatedData = existingData.filter(item => item.id !== markerId)
    localStorage.setItem('markers', JSON.stringify(updatedData))
  }

  setLocale (locale) {
    localStorage.setItem('locale', JSON.stringify(locale))
  }

  toggleInfo (value) {
    localStorage.setItem('info_panel', JSON.stringify(value))
  }
}

export const backendApiService = new BackendApiService()
