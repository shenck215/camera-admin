
/* Layout */
import Layout from '@/layout'

const userRoutes = [
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
    redirect: '/chart/index'
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

export default userRoutes
