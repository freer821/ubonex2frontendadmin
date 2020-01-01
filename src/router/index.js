import Vue from 'vue'
import VueRouter from 'vue-router'
// import { Message } from "element-ui";
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/cookies' // get token from cookie
import { getPageTitle } from '@/utils' // getPageTitle

/* Layout */
import Layout from '@/views/layout'
Vue.use(VueRouter)

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

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
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/warehouse',
    component: Layout,
    redirect: '/warehouse/parcelscan',
    name: 'Warehouse',
    meta: { title: '仓库操作', icon: 'guide' },
    children: [
      {
        path: 'parcelscan',
        component: () => import('@/views/warehouse/ParcelScan'),
        name: 'parcelscan',
        meta: { title: '包裹扫描' }
      },
      {
        path: 'mainplatemgm',
        component: () => import('@/views/warehouse/MainPlateCodeManagement'),
        name: 'mainplatemgm',
        meta: { title: '主单号管理' }
      },
      {
        path: 'picimgm',
        component: () => import('@/views/warehouse/PiciCodeManagement'),
        name: 'picimgm',
        meta: { title: '批次号管理' }
      }
    ]
  }
]

const createRouter = () =>
  new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// permission check

router.beforeEach(async (to, from, next) => {
  document.title = getPageTitle(to.meta.title)
  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

export default router
