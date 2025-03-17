import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/personalise',
    name: 'personalise',
    component: () => import('@/views/PersonalisePage.vue'),
    meta: { buttonClass: 'high' }
  },
  {
    path: '/remind',
    name: 'remind',
    component: () => import('@/views/RemindPage.vue'),
    meta: { buttonClass: 'moderate' }
  },
  {
    path: '/plan',
    name: 'plan',
    component: () => import('@/views/PlanPage.vue'),
    meta: { buttonClass: 'very-high' }
  },
  // ✅ Add the test route
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/TestVue.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
