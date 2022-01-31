import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Main.vue";
import Profil from "@/components/Profile.vue";

const routes = [
  { 
    name: 'login',
    path: '/', 
    component: Login,
  },
  { 
    name: 'home',
    path: '/home', 
    component: Home, 
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