<template>
  <v-app-bar app>
    <v-toolbar-title>
      <div class="app-logo">
        <span class="app-logo__text">gps</span>
      </div>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      v-for="link in links"
      :active="link.active"
      :key="link.path"
      :text="link.title"
      :to="link.path"
    />
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const links = computed(() => {
  return [
    { path: '/about', title: 'About' },
    { path: '/', title: 'Map' }
  ].map(link => ({...link, active: link.path === route.path}))
})
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
</style>
