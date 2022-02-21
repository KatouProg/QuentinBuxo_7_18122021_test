import { createWebHistory, createRouter } from "vue-router";


const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/Home',
    name: 'Homep',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/Timeline',
    name: 'TimeLine',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    props: true,
  },
  {
    path: '/Profile/:userId',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue'),
    props: true
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;