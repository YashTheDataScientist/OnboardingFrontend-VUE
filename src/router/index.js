// import { createRouter, createWebHistory } from 'vue-router'
// import HomePage from '@/views/HomeView.vue'

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomePage
//   },
//   {
//     path: '/personalise',
//     name: 'personalise',
//     component: () => import('@/views/PersonalisePage.vue'),
//     meta: { buttonClass: 'high' }
//   },
//   {
//     path: '/remind',
//     name: 'remind',
//     component: () => import('@/views/RemindPage.vue'),
//     meta: { buttonClass: 'moderate' }
//   },
//   {
//     path: '/plan',
//     name: 'plan',
//     component: () => import('@/views/PlanPage.vue'),
//     meta: { buttonClass: 'very-high' }
//   },
//   // ✅ Add the test route
//   // {
//   //   path: '/test',
//   //   name: 'test',
//   //   component: () => import('@/views/TestVue.vue')
//   // }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// export default router


import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  // { path: '/recommendations', name: 'Recommendations', component: () => import('@/views/Recommendations.vue') },
  { path: '/reminders', name: 'Reminders', component: () => import('@/views/RemindPage.vue') },
  { path: '/plan', name: 'PlanTrip', component: () => import('@/views/PlanPage.vue') }
  // { path: '/about', name: 'About', component: () => import('@/views/AboutPage.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
