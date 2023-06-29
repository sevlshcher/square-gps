<template>
  <v-app-bar app :density="mobile ? 'compact' : 'default'" :elevation="1">
    <v-img :src="logoUrl"  max-width="50" class="mx-6" />
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
    <v-menu>
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
import { useDisplay } from 'vuetify'
import logoUrl from '@/assets/logo.jpg'

const route = useRoute()
const store = useStore()
const { t, availableLocales, locale } = useI18n({ useScope: 'global' })
const { mobile } = useDisplay()

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
.navbar-link {
  &.v-btn--active {
    opacity: 1;
  }
}
</style>
