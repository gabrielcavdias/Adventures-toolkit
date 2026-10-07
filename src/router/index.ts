import { createRouter, createWebHistory } from 'vue-router'
import SpellsView from '../views/SpellsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SpellsView,
    },
    {
      path: '/personagens',
      name: 'chars',
      component: () => import('../views/CharacterView.vue'),
    },
    {
      path: '/personagens/:slug',
      name: 'chars-single',
      component: () => import('../views/CharacterSingleView.vue'),
    },
    {
      path: '/npcs',
      name: 'lifebars',
      component: () => import('../views/NPCsView.vue'),
    },
    {
      path: '/mestre',
      name: 'gmtools',
      component: () => import('../views/GMToolsView.vue'),
    },
  ],
})

export default router
