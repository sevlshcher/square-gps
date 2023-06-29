import mapboxgl from 'mapbox-gl'
import { getColorById, getUniqId, shortenCoords } from '@/common/helpers/helper'

mapboxgl.accessToken = 'pk.eyJ1IjoiYmxvd25jdWJlIiwiYSI6ImNsamNsNmxqYjI4ZGgzZHF6OTE3cjc0MXEifQ.b1bXIRHOHex9qvmoH092jA  '

export class MapboxGlService {
  constructor() {
    this.$map = null
  }

  get isLoaded () {
    return Boolean(this.$map?._isReady)
  }

  get map () {
    return this.$map
  }

  create ({ container, mapOptions, isMarkerMode, store }) {
    this.$map = new mapboxgl.Map({
      container: container.value,
      style: "mapbox://styles/mapbox/streets-v12",
      center: { lat: mapOptions.lat, lng: mapOptions.lng },
      zoom: mapOptions.zoom
    })
    this.$map._isReady = false

    this.$map.addControl(new mapboxgl.NavigationControl())
    this.$map.addControl(new mapboxgl.FullscreenControl())
    this.$map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    )

    this.$map.on('load', () => {
      this.$map.on("move", () => {
        const { lat, lng } = shortenCoords(this.$map.getCenter())
        mapOptions.lat = lat
        mapOptions.lng = lng
      })

      this.$map.on("zoom", () => {
        mapOptions.zoom = this.$map.getZoom().toFixed(2)
      })

      this.$map.on('click', async (e) => {
        if (!isMarkerMode.value) { return }
        const id = getUniqId()
        const coords = e.lngLat
        await store.dispatch('CONVERT_COORDS', { id, coords })
        this.addMarker(id, coords, isMarkerMode, store)
      })

      this.addMarkers(store)
      this.$map._isReady = true
    })
  }

  createMapMarker (id, coords, address, markers, store) {
    const color = getColorById(id)
    return new ExtendedMarker({ color })
      .setLngLat(coords)
      .setAttrs({ id })
      .onClick(this.setActiveMarker.bind(this, id, markers, store))
      .setPopup(this.createPopup(address, coords))
      .addTo(this.$map)
  }

  createPopup (address, coords) {
    const { lng, lat } = shortenCoords(coords)
    const popupHtml = `
      <span><em>${lat}</em>, <em>${lng}</em></span>
      <h3>${address}</h3>
    `
    return new mapboxgl.Popup({ className: 'mb-popup', offset: 25 }).setHTML(popupHtml)
  }

  addMarkers (store) {
    const addresses = store.getters.getAllAddresses
    const markers = store.getters.getMarkers
    markers.forEach(marker => {
      const { id, coords } = marker
      const address = addresses[id] || ''
      const el = this.createMapMarker(id, coords, address, markers, store)
      store.dispatch('UPDATE_MARKER', { id, coords, el })
    })
  }

  addMarker (id, coords, isMarkerMode, store) {
    const address = store.getters.getAddress(id)
    const markers = store.getters.getMarkers
    if (address) {
      const marker = this.createMapMarker(id, coords, address, markers, store)
      store.dispatch('ADD_MARKER', { id, coords, el: marker })
      isMarkerMode.value = false
    }
  }

  setActiveMarker (id, markers, store) {
    store.dispatch('SET_MARKER_ACTIVE', id)
    markers.forEach(marker => {
      const isActive = marker.id === id
      const el = marker.el
      const popup = el.getPopup()

      if (!isActive && popup.isOpen()) {
        el.togglePopup()
      }
    })
  }

  goToMarker (id, store) {
    const markers = store.getters.getMarkers
    const { coords, el } = markers.find(marker => marker.id === id)
    this.setActiveMarker(id, markers, store)
    this.$map.flyTo({ center: coords, essential: true })
    el.togglePopup()
  }
}

class ExtendedMarker extends mapboxgl.Marker {

  setAttrs (attributes) {
    const element = this._element
    const attrs = Object.entries(attributes)
    attrs.forEach(([key, value]) => {
      element.setAttribute(key, value)
    })
    element.classList.add('mb-marker')
    return this
  }

  onClick(handleClick) {
    this._handleClick = handleClick
    return this
  }

  _onMapClick(e) {
    const targetElement = e.originalEvent.target
    const element = this._element

    if (targetElement === element || element.contains((targetElement))) {
      this.togglePopup()
      if (this._handleClick) { this._handleClick() }
    }
  }
}
