import { defineStore } from 'pinia'
import { useTagsViewStore } from './tagsView'
import { login, getMenus } from '../api/api'
export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
    menus: JSON.parse(localStorage.getItem('menus') || '[]'),
    permissions: JSON.parse(localStorage.getItem('permissions') || '[]'),
    isCollapse: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userRole: (state) => state.userInfo.name || 'user',
    allowedMenuId: (state) => state.userInfo.menuId || []
  },

  actions: {
    async handleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    async login(params) {
      const res = await login(params)
      this.token = res.data.token
      this.userInfo = res.data.userInfo
      // 设置按钮权限
      this.permissions = res.data.userInfo.permission || []
      localStorage.setItem('permissions', JSON.stringify(this.permissions))

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
      this.getMenus()
      const tagsViewStore = useTagsViewStore()
      tagsViewStore.clearTags()
    },
    async getMenus() {
      const res = await getMenus()
      this.menus = this.filterMenusByRole(res.data.data)
      localStorage.setItem('menus', JSON.stringify(this.menus))
      // console.log(this.menus);
    },
    // 根据角色过滤菜单
    filterMenusByRole(allMenus) {
      if (!this.allowedMenuId) return [] // 防御性代码
      // 超级管理员返回全部菜单
      if (this.allowedMenuId.includes('*')) return allMenus

      const filter = (menus) => {
        return menus
          .map((menu) => ({
            ...menu
          }))
          .filter((menu) => this.allowedMenuId.includes(menu.id))
      }

      return filter(allMenus)
    },
    logout() {
      this.token = ''
      this.user = null
      this.menus = []
      this.permissions = []
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('menus')
      localStorage.removeItem('permissions')
      // const tagsViewStore = useTagsViewStore()
      // tagsViewStore.clearTags()
      localStorage.removeItem('tagsList')
      localStorage.removeItem('activeTag')
    },


  }
})
