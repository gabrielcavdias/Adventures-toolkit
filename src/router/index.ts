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
      path: '/barra-de-vida',
      name: 'lifebars',
      component: () => import('../views/LifeBarsView.vue'),
    },
  ],
})

export default router
