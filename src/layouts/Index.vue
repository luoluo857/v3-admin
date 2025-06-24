<template>
  <el-container class="layout-container">
    <Sidebar />
    <el-container>
      <div style="width: 100%;height: 100%">
        <Header />
        <el-main>
          <TagsView />
          <router-view></router-view>
        </el-main>
      </div>
    </el-container>
  </el-container>
</template>

<script setup>
  // import { useRoute } from 'vue-router'
  // import { useUserStore } from '../stores'
  // import { useTagsViewStore } from '@/stores/tagsView'
  import TagsView from './components/TagsView.vue'
  import Header from './components/Header.vue'
  import Sidebar from './components/Sidebar.vue'

  // const route = useRoute()
  // const userStore = useUserStore()
  // const tagsViewStore = useTagsViewStore()
</script>

<style scoped lang="scss">
  .layout-container {
    height: 100vh;
  }
  :deep(.el-main){
    padding: 0 20px 20px;
    height: calc(100% - 60px)
  }
</style>
