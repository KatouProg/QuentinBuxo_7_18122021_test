import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import PostsList from "@/components/PostsList.vue";

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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;