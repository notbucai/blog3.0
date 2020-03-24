import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Index.vue';
import Login from '../views/auth/Login.vue';
import UserList from '../views/user/List.vue';
import ArticleList from '../views/article/List.vue';
import CommentList from '../views/comment/List.vue';
import TagList from '../views/tag/List.vue';

Vue.use(VueRouter)

/*
export enum UserRole {
  Normal = 1, // 普通用户
  Editor = 2, // 网站编辑
  Admin = 3, // 管理员
  SuperAdmin = 4, // 超级管理员
}
*/

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      role: 2
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      noLayout: true, // 表示不需要布局
    }
  },
  {
    path: '/user/list',
    name: 'UserList',
    component: UserList,
    meta: {
      role: 3
    }
  },
  {
    path: '/article/list',
    name: 'ArticleList',
    component: ArticleList,
    meta: {
      role: 2
    }
  },
  {
    path: '/comment/list',
    name: 'CommentList',
    component: CommentList,
    meta: {
      role: 2
    }
  },
  {
    path: '/tag/list',
    name: 'TagList',
    component: TagList,
    meta: {
      role: 2
    }
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackchunkname: "about" */ '../views/about.vue')
  // }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router;