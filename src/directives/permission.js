// 按钮权限自定义指令
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'

export const permission = {
  mounted(el, binding) {
    // 获取用户权限列表
    const userStore = useUserStore()
    const { value } = binding

    // 如果没有指定权限值，则不做处理
    if (!value) return

    // 获取用户的按钮权限列表
    const permissions = userStore.permissions || []

    // 检查是否有通配符权限
    if (permissions.includes('*')) {
      return // 有通配符权限，允许所有操作
    }

    // 检查权限
    const hasPermission = Array.isArray(value)
      ? value.some(permission => permissions.includes(permission))
      : permissions.includes(value)

    if (!hasPermission) {
      // 禁用按钮并添加提示
      el.disabled = true
      el.classList.add('is-disabled')
      el.style.cursor = 'not-allowed'

      // 添加点击事件监听器显示提示
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        ElMessage.warning('您没有操作权限')
      }, true)
    }
  }
}

export default {
  install(app) {
    app.directive('permission', permission)
  }
}
