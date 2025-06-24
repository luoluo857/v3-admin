// router/route.js
import Layouts from '@/layouts/Index.vue'

export default function generateRoutes(menus) {
  const routes = menus.map((menu) => {
    const route = {
      path: menu.path,
      name: menu.name,
      meta: {
        title: menu.title,
        icon: menu.icon || 'document',
        type: menu.type,
        hidden: menu.hidden ? true : false,
        requiresAuth: true
      }
    }
    if (menu.children && menu.children.length > 0) {
      route.component = Layouts
      route.redirect = menu.children[0].path // 默认重定向到第一个子路由
      route.children = generateRoutes(menu.children)
    } else {

      const modules = import.meta.glob('../views/**/*.vue')
      let componentPath

      if (menu.path.includes(':')) {
        // 处理动态路由，如 /agreement/detail/:id
        const basePath = menu.path.split('/:')[0]
        componentPath = `../views${basePath}.vue`
      } else {
        componentPath = `../views${menu.path}.vue`
      }

      // 验证组件是否存在
      if (!modules[componentPath]) {
        console.error(`组件路径不存在: ${componentPath}`)
        componentPath = '../views/404.vue' // 兜底错误页面
      }
      route.component = modules[componentPath]
      // route.component = () => import(/* @vite-ignore */ `../views${menu.path}/index.vue`)
    }
    return route
  })

  // 将隐藏路由添加到路由配置中
  return routes
}
