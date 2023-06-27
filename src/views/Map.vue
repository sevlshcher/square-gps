<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height">
      <v-col cols="3">
        <v-card class="fill-height" title="Markers">
          <template v-slot:prepend>
            <v-icon icon="mdi-map-marker" color="red"></v-icon>
          </template>
          <v-divider></v-divider>
          <v-list>
            <v-list-item
              v-for="marker in markersList"
              :active="marker.active"
              :key="marker.id"
              :subtitle="`lng: ${marker.coords.lng.toFixed(4)} | lat: ${marker.coords.lat.toFixed(4)}`"
              :title="marker.title"
              :value="marker"
              lines="two"
              @click="setActiveMarker(marker.id)"
            >
              <template #append>
                <v-btn
                  color="red-lighten-3"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  @click.stop="removeMarker(marker)"
                />
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-card :loading="isLoading" class="fill-height map-wrapper">
          <div ref="mapContainer" class="map-container" />
          <div class="map-footer">
            <div class="map-footer__info">
              <v-sheet><strong>Longitude:</strong> {{ mapOptions.center.lng }}</v-sheet>
              <v-divider class="ms-3" thickness="2" vertical></v-divider>
              <v-sheet><strong>Latitude:</strong> {{ mapOptions.center.lat }}</v-sheet>
              <v-divider class="ms-3" thickness="2" vertical></v-divider>
              <v-sheet><strong>Zoom:</strong> {{ mapOptions.zoom }}</v-sheet>
            </div>
            <v-btn
              v-show="!isMarkerMode"
              icon="mdi-plus"
              color="primary"
              @click="() => isMarkerMode = !isMarkerMode"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="apiError.isError"
      color="red-lighten-3"
    >
      Error: {{ apiError.message }}

      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="closeApiError"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import 'mapbox-gl/dist/mapbox-gl.css'
import { MapboxGlService } from '@/common/services/mapbox-gl.service';

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const mapboxGL = reactive(new MapboxGlService())
    const isLoading = computed(() => !mapboxGL.isLoaded)
    const mapContainer = ref(null)
    const map = ref(null)
    const mapOptions = reactive({
      center: { lng: 41.6399, lat: 41.6434 },
      zoom: 7,
    })
    const apiError = computed(() => store.getters.getApiError)
    const markers = computed(() => store.getters.getMarkers)
    const markersList = computed(() => getMarkersList(markers))
    const activeMarker = computed(() => mapboxGL.activeMarker)
    const isMarkerMode = ref(false)

    watch(activeMarker, (newVal, oldVal) => {
      if (newVal !== oldVal) { setMarkerQuery() }
    })

    onMounted(async () => {
      await store.dispatch('FETCH_MARKERS')
      if (map.value) return
      mapboxGL.create({
        container: mapContainer,
        mapOptions,
        isMarkerMode,
        store
      })
      map.value = mapboxGL.map
    })

    function getMarkersList (markers) {
      return markers.value.map(marker => {
        const title = store.getters.getAddress(marker.id)
        return {
          ...marker,
          active: marker.id === activeMarker.value,
          title
        }
      })
    }

    // function getMarker(id) {
    //   return store.getters.getMarkerById(id)
    // }

    function setActiveMarker (id) {
      mapboxGL.goToMarker(id, store)
    }

    function removeMarker (marker) {
      mapboxGL.removeMarker(marker, store)
    }

    function setMarkerQuery () {
      const query = !activeMarker.value ? '' : `?id=${activeMarker.value}`
      router.replace(route.path + query)
    }

    function closeApiError () {
      store.dispatch('SET_API_ERROR')
    }

    return {
      isLoading,
      mapContainer,
      mapOptions,
      apiError,
      markersList,
      isMarkerMode,
      setActiveMarker,
      removeMarker,
      closeApiError
    }
  }
}
</script>

<style lang="scss">
.map-container {
  width: 100%;
  height: 100%;
}

.mb-marker {
  --marker-color: dodgerblue;
  path {
    fill: var(--marker-color);
  }
}

.mb-popup {
  .mapboxgl-popup-content {
    padding: 1.2em;
    border-radius: 4px;

    h3 {
      padding-bottom: .7em;
      margin-bottom: .7em;
      border-bottom: 1px solid lightgray;
    }

    button {
      padding-inline: 6px;
    }
  }
}

.map-footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1em;
  background-color: transparent;
  z-index: 1;
}

.map-footer__info {
  display: flex;
  justify-content: space-between;
  padding: .75em 1em;
  color: #fff;
  background-color: rgba(66, 66, 66, .8);
  border-radius: 4px;

  .v-sheet {
    color: inherit;
    background-color: transparent;

    &:not(:first-of-type) {
      margin-left: 12px;
    }
  }
}
</style>
