import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Main.vue";
import UserInfos from "../views/UserInfos.vue";


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
    path: "/userInfos",
    name: "UserInfos",
    component: UserInfos,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;