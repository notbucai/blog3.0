import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Index.vue';
import Login from '../views/auth/Login.vue';
import UserList from '../views/user/List.vue';
import ArticleList from '../views/article/List.vue';
import CommentList from '../views/comment/List.vue';
import TagList from '../views/tag/List.vue';
import RoleList from '../views/role/List.vue';
import AclList from '../views/acl/List.vue';
import LinksList from '../views/links/List.vue';
import KeywordsList from '../views/keywords/List.vue';

Vue.use(VueRouter)

/*
export enum UserRole {
  Normal = 1, // 普通用户
  Editor = 2, // 网站编辑
  Admin = 3, // 管理员
  SuperAdmin = 4, // 超级管理员
}
*/

export const navRoutes = [
  {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      role: 'home_page',
      title: "主页",
      icon: "iconjiaobenkongzhitai"
    }
  },
  {
    path: '/user/list',
    name: 'UserList',
    component: UserList,
    meta: {
      role: 'user_page',
      title: "用户管理",
      icon: "iconshiliangzhinengduixiang"
    }
  },
  {
    path: '/article/list',
    name: 'ArticleList',
    component: ArticleList,
    meta: {
      role: 'article_page',
      title: "文章管理",
      icon: "iconwenzhang"
    }
  },
  {
    path: '/comment/list',
    name: 'CommentList',
    component: CommentList,
    meta: {
      role: 'comment_page',
      title: "评论管理",
      icon: "iconpinglun"
    }
  },
  {
    path: '/tag/list',
    name: 'TagList',
    component: TagList,
    meta: {
      role: 'tag_page',
      title: "标签管理",
      icon: "iconpinglun"
    }
  },
  {
    path: '/links/list',
    name: 'linksList',
    component: LinksList,
    meta: {
      role: 'links_page',
      title: "友邻管理",
      icon: "iconpinglun"
    }
  },
  {
    path: '/role/list',
    name: 'RoleList',
    component: RoleList,
    meta: {
      role: 'role_page',
      title: "角色管理",
      icon: "iconpinglun"
    }
  },
  {
    path: '/acl/list',
    name: 'AclList',
    component: AclList,
    meta: {
      role: 'acl_page',
      title: "权限点管理",
      icon: "iconpinglun"
    }
  },
  {
    path: '/keywords/list',
    name: 'KeywordsList',
    component: KeywordsList,
    meta: {
      role: 'keywords_page',
      title: "词云管理",
      icon: "iconwordCloud-chart"
    }
  }
];

export const routes = [

  {
    path: '/',
    name: 'adminSystem',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      noLayout: true, // 表示不需要布局
    }
  },
  ...navRoutes
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