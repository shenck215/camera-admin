import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

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
    redirect: '/setup/ntp'
  },

  {
    path: '/setup',
    component: Layout,
    redirect: '/setup/ntp',
    name: 'setup',
    meta: { title: '设置', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'ntp',
        name: 'ntp',
        component: () => import('@/views/setup/ntp'),
        meta: { title: 'NTP服务器设置' }
      },
      {
        path: 'ip',
        name: 'ip',
        component: () => import('@/views/setup/ip'),
        meta: { title: '本机IP设置' }
      },
      {
        path: 'server',
        name: 'server',
        component: () => import('@/views/setup/server'),
        meta: { title: '服务器IP设置' }
      },
      {
        path: 'camera1',
        name: 'camera',
        component: () => import('@/views/setup/camera1'),
        meta: { title: '摄像机1设置' }
      },
      {
        path: 'camera2',
        name: 'camera',
        component: () => import('@/views/setup/camera2'),
        meta: { title: '摄像机2设置' }
      }
      // {
      //   path: 'cameraline',
      //   name: 'cameraline',
      //   component: () => import('@/views/setup/cameraline'),
      //   meta: { title: '摄像机画线设置' }
      // }
    ]
  },

  {
    path: '/switch',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'switch',
        component: () => import('@/views/switch/index'),
        meta: { title: '监控', icon: 'el-icon-open' }
      }
    ]
  },
  {
    path: '/list',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'list',
        component: () => import('@/views/list/index'),
        meta: { title: '违法列表', icon: 'el-icon-tickets' }
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
