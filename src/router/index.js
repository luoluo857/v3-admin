import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import generateRoutes from './route'
import Layouts from '@/layouts/Index.vue'
import Home from '@/views/home.vue'
import Login from '@/views/login.vue'
import NotFound from '@/views/404.vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置NProgress选项
NProgress.configure({ showSpinner: false })
const routes = [
  {
    path: '/',
    name: 'Layouts',
    component: Layouts,
    meta: { requiresAuth: true },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页',
          icon: 'home',
          requiresAuth: true
        }
      }
      // 默认没有定义其他子路由，等待动态添加
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录',
      requiresAuth: false
    }
  },
  {
    path: '/404',
    name: '404',
    component: NotFound,
    meta: {
      title: '404',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由转换器

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const userStore = useUserStore()

  // 1. 未登录且访问需权限的路由 → 跳登录页
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 清除所有可能残留的状态
    localStorage.removeItem('menus')
    localStorage.removeItem('activeTag')
    return next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  // 2. 已登录且访问登录页 → 跳首页
  if (to.name === 'Login' && userStore.isLoggedIn) {
    const lastVisited = localStorage.getItem('activeTag') || '/home'
    return next(lastVisited)
  }

  // 3. 已登录且需要初始化菜单和路由
  if (userStore.isLoggedIn) {
    try {
      if (!router.hasRoute('dynamicRouteAdded')) {
        // 保存当前目标路由
        const originalPath = to.fullPath
        // 加载菜单数据（优先从本地存储读取）
        if (!userStore.menus.length) {
          const savedMenus = localStorage.getItem('menus')
          userStore.menus = savedMenus ? JSON.parse(savedMenus) : await userStore.getMenus()
        }
        // 生成并添加动态路由
        const dynamicRoutes = generateRoutes(userStore.menus)

        dynamicRoutes.forEach(route => {
          if (!router.hasRoute(route.name)) {
            router.addRoute(route) // 添加到Layouts下
          }
        })
        // 添加路由加载标记
        router.addRoute({
          path: '/dynamic-route-added',
          name: 'dynamicRouteAdded',
          component: () => null
        })

        // 特殊处理根路径
        if (to.path === '/') {
          const target = localStorage.getItem('activeTag') || '/home'
          return next(target)
        }

        // 重定向到原始路径（保留查询参数和hash）
        return next(originalPath)
      }
    } catch (error) {
      console.error('路由初始化失败:', error)
      return next('/login')
    }
  }

  next()
})

router.afterEach(() => {
  NProgress.done()
})

export default router
