<template>
  <template v-for="item in filteredMenus" :key="item.id">
    <el-sub-menu v-if="item.type === 'directory' && item.children && item.children.length" :index="item.path">
      <template #title>
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.title }}</span>
      </template>
      <Asides :menus="item.children" />
    </el-sub-menu>
    <el-menu-item v-else :index="item.path">
      <el-icon><component :is="item.icon" /></el-icon>
      <span>{{ item.title }}</span>
    </el-menu-item>
  </template>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  menus: {
    type: Array,
    required: true
  }
});
// 过滤逻辑：排除 meta.hidden 为 true 的菜单项
const filteredMenus = computed(() => {
  return props.menus.filter((menu) => !menu.hidden)
})
</script>

<style scoped>
.el-sub-menu__title span,
.el-menu-item span {
  white-space: nowrap; /* 禁止换行 */
  overflow: hidden;    /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 显示省略号 */
}
.el-menu-item, .el-sub-menu {
  text-align: left;
}

:deep(.el-sub-menu__title) {
  padding-left: 20px !important;
}

.el-menu-item {
  padding-left: 20px !important;
}

:deep(.el-menu--inline) .el-menu-item {
  padding-left: 40px !important;
}
</style>
