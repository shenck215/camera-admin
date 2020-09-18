import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// console.log(localStorage.getItem('username'))

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/roadposition/index'
  },

  {
    path: '/roadposition',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'switch',
        component: () => import('@/views/roadposition/index'),
        meta: { title: '路口方位管理', icon: 'el-icon-s-operation' }
      }
    ]
  },

  {
    path: '/road',
    component: Layout,
    redirect: '/road/list',
    name: 'setup',
    meta: { title: '路口管理', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'list',
        name: 'roadlist',
        component: () => import('@/views/road/list'),
        meta: { title: '路口列表' }
      },
      {
        path: 'add',
        name: 'roadadd',
        component: () => import('@/views/road/add'),
        meta: { title: '新增路口' }
      }
    ]
  },
  {
    path: '/police',
    component: Layout,
    redirect: '/police/list',
    name: 'setup',
    meta: { title: '派出所管理', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'list',
        name: 'policelist',
        component: () => import('@/views/police/list'),
        meta: { title: '派出所列表' }
      },
      {
        path: 'add',
        name: 'policeadd',
        component: () => import('@/views/police/add'),
        meta: { title: '新增派出所' }
      }
    ]
  },
  {
    path: '/chart',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'switch',
        component: () => import('@/views/chart/index'),
        meta: { title: '首页', icon: 'el-icon-pie-chart' }
      }
    ]
  },
  {
    path: '/check',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'switch',
        component: () => import('@/views/check/index'),
        meta: { title: '审核', icon: 'el-icon-circle-check' }
      }
    ]
  },
  {
    path: '/changepw',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'changepw',
        component: () => import('@/views/changepw/index'),
        meta: { title: '修改密码' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
