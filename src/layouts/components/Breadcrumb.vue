<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="index"
        :to="item.path"
      >
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// 从路由匹配记录中提取 meta.title 和 path，排除首页和布局路由
const breadcrumbs = computed(() => {
  return route.matched
    .filter((record) => record.meta.title && record.name !== 'Home' && record.name !== 'Layouts') // 过滤掉首页、布局路由和没有 title 的路由
    .map((record) => ({
      title: record.meta.title,
      path: record.path
    }))
})
</script>

<style scoped>
.breadcrumb {
  margin: 16px 0;
}
:deep(.el-breadcrumb) {
  font-size: 15px;
  margin-bottom: 3px;
}
</style>
