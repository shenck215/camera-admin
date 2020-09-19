
/* Layout */
import Layout from '@/layout'

const adminRoutes = [
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
        meta: { title: '新增/修改路口' }
      }
    ]
  },
  {
    path: '/police',
    component: Layout,
    redirect: '/police/list',
    name: 'setup',
    meta: { title: '派出所管理', icon: 'el-icon-menu' },
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
        meta: { title: '新增/修改派出所' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'setup',
    meta: { title: '用户管理', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'list',
        name: 'userlist',
        component: () => import('@/views/user/list'),
        meta: { title: '用户列表' }
      },
      {
        path: 'add',
        name: 'useradd',
        component: () => import('@/views/user/add'),
        meta: { title: '新增/修改用户' }
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

export default adminRoutes
