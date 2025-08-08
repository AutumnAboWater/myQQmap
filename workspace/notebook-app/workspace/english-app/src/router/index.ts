import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: () => import('../views/Dashboard.vue') },
    { path: '/study', component: () => import('../views/Study.vue') },
    { path: '/words', component: () => import('../views/Words.vue') },
    { path: '/settings', component: () => import('../views/Settings.vue') },
  ],
})

export default router