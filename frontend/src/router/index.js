import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import PostsList from "@/components/PostsList.vue";
import Profil from "@/components/Profile.vue";

const routes = [
  { 
    name: 'login',
    path: '/', 
    component: Login,
  },
  { 
    name: 'postslist',
    path: '/posts', 
    component: PostsList, 
    props:true 
  },
  { 
    name: 'profil',
    path: '/profil', 
    component: Profil,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;