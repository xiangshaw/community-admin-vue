import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/Layout.vue'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect:"/home", // 路由跳转
    children:[
      {
        path: 'home',
        name: 'Home',
        component: () => import("@/views/Home"), // 懒加载
      },
      {
        path: 'tag',
        name: 'Tag',
        component: () => import("@/views/Tag"), // 懒加载
      },
      {
        path: 'comment',
        name: 'Comment',
        component: () => import("@/views/Comment"), // 懒加载
      },
      {
        path: 'news',
        name: 'News',
        component: () => import("@/views/News"), // 懒加载
      },
      {
        path: 'badge',
        name: 'Badge',
        component: () => import("@/views/Badge"), // 懒加载
      },
      {
        path: 'sort',
        name: 'Sort',
        component: () => import("@/views/Sort"), // 懒加载
      },
      {
        path: 'user',
        name: 'User',
        component: () => import("@/views/User"), // 懒加载
      },
      {
        path: 'person',
        name: 'Person',
        component: () => import("@/views/Person"), // 懒加载
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import("@/views/Login")
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
