<template>
  <v-container fluid class="fill-height map-page">
    <v-row class="fill-height">
      <v-col cols="3" class="fill-height">
        <v-card :title="t('map_page.markers')" class="fill-height">
          <template v-slot:prepend>
            <v-icon icon="mdi-map-marker" color="red"></v-icon>
          </template>
          <v-divider></v-divider>
          <v-virtual-scroll :items="markersList" height="92%">
            <template v-slot:default="{ item }">
              <v-list-item
                :active="item.active"
                :title="item.title"
                :value="item"
                class="pa-3"
                lines="two"
                @click="setActiveMarker(item.id)"
              >
                <template #subtitle>
                  <span>{{ t('map_page.latitude') + item.coords.lat}}</span><br>
                  <span>{{ t('map_page.longitude') + item.coords.lng}}</span>
                </template>
                <template #append>
                  <v-btn
                    color="red-lighten-3"
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    @click.stop="removeMarker(item)"
                  />
                </template>
              </v-list-item>
            </template>
          </v-virtual-scroll>
        </v-card>
      </v-col>
      <v-col cols="9" class="fill-height">
        <v-card :loading="isLoading" class="fill-height">
          <div ref="mapContainer" class="map-container" />
          <div class="map-footer">
            <div class="map-footer__info">
              <v-sheet><strong>{{ t('map_page.latitude') }}</strong>{{ mapOptions.center.lat }}</v-sheet>
              <v-divider class="ms-3" thickness="2" vertical></v-divider>
              <v-sheet><strong>{{ t('map_page.longitude') }}</strong>{{ mapOptions.center.lng }}</v-sheet>
              <v-divider class="ms-3" thickness="2" vertical></v-divider>
              <v-sheet><strong>{{ t('map_page.zoom') }}</strong> {{ mapOptions.zoom }}</v-sheet>
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
import { useI18n } from 'vue-i18n'
import { shortenCoords } from '@/common/helpers/helper';
import { MapboxGlService } from '@/common/services/mapbox-gl.service'
import 'mapbox-gl/dist/mapbox-gl.css'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })
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
      console.log({newVal, oldVal})
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
      setMarkerQuery()
    })

    function getMarkersList (markers) {
      return markers.value.map(marker => {
        const title = store.getters.getAddress(marker.id)
        return {
          ...marker,
          coords: shortenCoords(marker.coords),
          active: marker.id === activeMarker.value,
          title
        }
      })
    }

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
      t,
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
.map-page {
  max-height: calc(100vh - 64px);
}

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

    span {
      display: block;
      padding-bottom: .7em;
      margin-bottom: .7em;
      border-bottom: 1px solid lightgray;
      text-align: center;
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
