<template>
  <v-container fluid class="fill-height pa-0 map-page">
    <Sidebar @goToMarker="goToMarker" />
    <v-row no-gutters class="fill-height">
      <v-col cols="12" class="fill-height">
        <v-card :loading="isLoading" class="fill-height rounded-0">
          <div ref="mapContainer" class="map-container" />
          <div v-if="isInfoVisible" class="map-footer map-footer__info elevation-1">
            <v-table density="compact">
              <thead>
              <tr>
                <th v-for="(_, key) in mapOptions" :key="key">
                  {{ t(`map_page.${key}`)}}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td v-for="(value, key) in mapOptions" :key="key">
                  {{ value }}
                </td>
              </tr>
              </tbody>
            </v-table>
          </div>
          <div class="map-footer map-footer__btn" :class="{'info-hidden': !isInfoVisible}">
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
import { MapboxGlService } from '@/common/services/mapbox-gl.service'
import Sidebar from '@/components/Sidebar.vue'
import 'mapbox-gl/dist/mapbox-gl.css'

export default {
  components: { Sidebar },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const { t } = useI18n({ useScope: 'global' })

    const mapboxGL = reactive(new MapboxGlService())
    const isLoading = computed(() => !mapboxGL.isLoaded)
    const mapContainer = ref(null)
    const map = ref(null)
    const mapOptions = reactive({ lat: 41.6434, lng: 41.6399, zoom: 7 })
    const apiError = computed(() => store.getters.getApiError)
    const activeMarker = computed(() => store.getters.getActiveMarker)
    const isInfoVisible = computed(() => store.getters.isInfoVisible)
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
      setMarkerQuery()
    })

    function goToMarker (id) {
      mapboxGL.goToMarker(id, store)
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
      isMarkerMode,
      isInfoVisible,
      goToMarker,
      closeApiError
    }
  }
}
</script>

<style lang="scss">
.map-page {
  max-height: calc(100vh - 48px);
}

.map-container {
  width: 100%;
  height: 100%;
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
  opacity: .9;
  z-index: 2;
}

.map-footer__info {
  left: 1em;
  bottom: 1em;
  text-align: center;
  border-radius: 4px;

  @media only screen and (max-width: 480px) {
    border-radius: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 1;
  }
}

.map-footer__btn {
  right: 1em;
  bottom: 2em;

  @media only screen and (max-width: 480px) {
    &:not(.info-hidden) {
      bottom: 6em;
    }
  }
}
</style>
