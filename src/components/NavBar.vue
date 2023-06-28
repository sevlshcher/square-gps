<template>
  <v-app-bar app>
    <v-toolbar-title class="flex-0-1 pr-16">
      <div class="app-logo">
        <span class="app-logo__text">gps</span>
      </div>
    </v-toolbar-title>
    <v-btn
      v-for="link in links"
      :active="link.active"
      :key="link.path"
      :text="link.title"
      :to="link.path"
      class="navbar-link"
      variant="plain"
    />
    <v-spacer></v-spacer>
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-translate"
          size="small"
          variant="plain"
          v-bind="props"
        />
      </template>
      <v-list>
        <v-list-item
          v-for="(lng, i) in availableLocales"
          :disabled="lng === locale"
          :key="i"
          :value="lng"
          @click="switchLocale(lng)"
        >
          <v-list-item-title>{{ t(`navbar.${lng}`) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const store = useStore()
const { t, availableLocales, locale } = useI18n({ useScope: 'global' })
const links = computed(() => {
  return [
    { path: '/about', title: t('navbar.about') },
    { path: '/', title: t('navbar.map') }
  ].map(link => ({...link, active: link.path === route.path}))
})

function switchLocale (lng) {
  locale.value = lng
  store.dispatch('SET_LOCALE', lng)
}
</script>

<style lang="scss">
.app-logo {
  position: relative;
  width: max-content;
  margin-left: 1em;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -40%;
    width: 1.4em;
    aspect-ratio: 1;
    background: linear-gradient(to bottom, #696969 15%, transparent 30%, transparent 100%) no-repeat 100% 0;
    background-size: 2px 100%;
    border: 2px solid #696969;
    border-right: 0;
    border-radius: 2px;
  }
}

.navbar-link {
  &.v-btn--active {
    opacity: 1;
  }
}
</style>
