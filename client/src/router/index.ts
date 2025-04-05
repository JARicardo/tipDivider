import { createRouter, createWebHistory } from 'vue-router'
import Tips from '../views/tips.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'propinas',
      component: Tips,
    }
  ],
})

export default router
