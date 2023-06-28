import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Map',
        component: () => import('@/views/Map.vue'),
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/views/About.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
