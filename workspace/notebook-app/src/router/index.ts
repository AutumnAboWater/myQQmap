import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    components: {
      default: () => import('../views/NotebookView.vue'),
      sidebar: () => import('../views/Sidebar.vue'),
      header: () => import('../views/HeaderBar.vue'),
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/NotebookView.vue'),
      },
      {
        path: 'note/:id',
        name: 'note',
        component: () => import('../views/NotebookView.vue'),
        props: true,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router