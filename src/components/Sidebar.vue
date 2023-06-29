<template>
  <v-navigation-drawer
    v-model="drawer"
    :class="{'sidebar__collapsed--mob': xs && rail}"
    :location="xs ? 'bottom' : 'left'"
    :permanent="true"
    :rail="rail"
    @click="rail = false"
  >
    <v-list-item
      class="pa-1"
      :class="{'justify-center': xs && rail}"
      :ripple="false"
      id="sidebar-item"
      variant="plain"
      @click.stop="rail = !rail"
    >
      <template v-if="!rail" #title>
        <span class="d-block text-center">{{ t('map_page.markers') }}</span>
      </template>
      <template v-if="rail">
        <v-btn
          :icon="xs ? 'mdi-chevron-double-up' : 'mdi-menu'"
          variant="plain"
        />
      </template>
      <template v-if="!rail" #append>
        <v-btn
          :icon="`mdi-chevron-${xs ? 'down' : 'left'}`"
          variant="plain"
        />
      </template>
    </v-list-item>
    <v-divider></v-divider>
    <v-virtual-scroll
      :items="markersList"
      class="overflow-x-hidden"
      :class="{'sidebar__markers': rail}"
      :height="scrollerHeight"
    >
      <template #default="{ item }">
        <v-list-item
          :active="item.id === activeMarker"
          :title="item.title"
          :value="item"
          class="pa-1"
          :lines="xs ? 'one' : 'two'"
          @click="!rail && goToMarker(item.id)"
        >
          <template #prepend>
            <v-btn
              :color="item.color"
              :disabled="true"
              icon="mdi-map-marker"
              style="opacity: 0.8"
              variant="plain"
            />
          </template>
          <template v-if="!xs" #subtitle>
            <span>{{ `${t('map_page.lat')}: ${item.coords.lat}` }}</span><br>
            <span>{{ `${t('map_page.lng')}: ${item.coords.lng}` }}</span>
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
    <v-divider></v-divider>
    <v-list-item class="pa-1" id="sidebar-item" variant="plain">
      <template #title>
        <span class="d-block text-center">{{ t('map_page.info_panel') }}</span>
      </template>
      <template v-if="rail" #prepend>
        <v-btn icon="mdi-information-outline" style="opacity: 0.8" variant="plain" />
      </template>
      <template #append>
        <v-switch
          v-model="infoPanel"
          class="py-1 px-2"
          color="success"
          density="compact"
          hide-details
        />
      </template>
    </v-list-item>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { getColorById, shortenCoords } from '@/common/helpers/helper';

const store = useStore()
const { t } = useI18n({ useScope: 'global' })
const { xs } = useDisplay()
const emit = defineEmits(['goToMarker'])

const markersList = computed(() => getMarkersList())
const activeMarker = computed(() => store.getters.getActiveMarker)
const scrollerHeight = ref('0')
const infoPanel = ref(true)
const drawer = ref(true)
const rail = ref(true)

watch(infoPanel, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    store.dispatch('TOGGLE_INFO', newVal)
  }
})

onMounted(() => {
  infoPanel.value = JSON.parse(localStorage.getItem('info_panel')) ?? true
  scrollerHeight.value = calcScrollerHeight()
})

function calcScrollerHeight () {
  const items = document.querySelectorAll('#sidebar-item')
  const itemsHeight = Array.from(items).reduce((sum, item) => sum + Math.round(item?.getBoundingClientRect()?.height || 0), 2)
  return `calc(100% - ${itemsHeight}px)`
}

function getMarkersList () {
  const markers = store.getters.getMarkers
  return markers.map(marker => {
    const title = store.getters.getAddress(marker.id)
    return {
      ...marker,
      coords: shortenCoords(marker.coords),
      color: getColorById(marker.id),
      title
    }
  })
}

function goToMarker (id) {
  emit('goToMarker', id)
}

async function removeMarker (marker) {
  const { id, el } = marker
  await store.dispatch('REMOVE_MARKER', id)
  el.remove()
  if (id === activeMarker.value) {
    await store.dispatch('SET_MARKER_ACTIVE')
  }
}
</script>

<style lang="scss">
.sidebar__collapsed--mob {
  .v-navigation-drawer__content {
    overflow: hidden;
  }
}

.sidebar__markers {
  overflow-y: hidden;
  opacity: 0;
}
</style>
