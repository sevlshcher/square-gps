<template>
  <v-container fluid class="fill-height about-page">
    <v-row class="justify-center">
      <v-col cols="9">
      <v-card
        :title="t('about_page.header')"
        :subtitle="t('about_page.description')"
      >
        <v-card-text>
          <v-timeline density="compact" align="start">
            <v-timeline-item
              v-for="task in tasks"
              :key="task.id"
              :dot-color="task.isSection ? 'pink' : 'teal-lighten-3'"
              :size="task.isSection ? 'small' : 'x-small'"
            >
              <div class="mb-4">
                <div class="font-weight-normal">
                  <span v-html="t(`about_page.${task.id}`)" />
                </div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
const tasks = reactive([
  { id: 'about_section.title', isSection: true },
  { id: 'about_section.content' },
  { id: 'map_section.title', isSection: true },
  { id: 'map_section.content.1' },
  { id: 'map_section.content.2' },
  { id: 'map_section.content.3' },
  { id: 'map_section.content.4' },
  { id: 'map_section.content.5' },
  { id: 'map_section.content.6' },
  { id: 'map_section.content.7' },
  { id: 'optional_section.title', isSection: true },
  { id: 'optional_section.content.1' },
  { id: 'optional_section.content.2' },
  { id: 'optional_section.content.3' },
  { id: 'reminder_section', isSection: true },
])
</script>

<style lang="scss">
.about-page {
  a {
    color: #4CAF50;
    text-decoration: none;
  }

  .v-card-subtitle {
    white-space: unset;
  }

  .v-timeline--vertical.v-timeline {
    grid-row-gap: 1rem;
  }
}
</style>
