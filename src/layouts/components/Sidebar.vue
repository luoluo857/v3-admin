<template>
  <el-aside :width="userStore.isCollapse ? '64px' : '200px'" class="aside">
    <div class="logo_container" v-if="!userStore.isCollapse">
      <img src="@/assets/logo.png" class="logo" alt="" />
      后台管理系统
    </div>
    <img src="@/assets/logo.png" class="logos" v-else alt="" />
    <el-menu
      :router="true"
      :default-active="$route.path"
      :collapse="userStore.isCollapse"
      class="el-menu-vertical"
      active-text-color="#ffd04b"
      background-color="#545c64"
      text-color="#fff"
      @select="handleSelect"
    >
      <Asides :menus="userStore.menus" />
    </el-menu>
  </el-aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { useTagsViewStore } from '@/stores/tagsView'
import Asides from './Asides.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const tagsViewStore = useTagsViewStore()

const handleSelect = (path) => {
  const routeRecord = router.getRoutes().find((route) => route.path === path)

  if (routeRecord) {
    const tag = {
      path: routeRecord.path,
      name: routeRecord.name,
      title: routeRecord.meta.title || '未命名',
      hidden: routeRecord.meta.hidden || false,
      closable: true
    }
    if (routeRecord.name === 'Home') {
      tagsViewStore.setActiveTag('Home')
    } else {
      tagsViewStore.addTag(tag)
    }
  }
}
</script>

<style scoped lang="scss">
.aside {
  background-color: #545c64;
  transition: width 0.3s ease;
  height: 100vh;
}

.el-menu-vertical {
  border-right: none;
  /* height: 100vh; */
  flex: 1;
  overflow-y: auto;
}

.logo_container {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
  white-space: nowrap;

  .logo {
    width: 35px;
    margin-right: 5px;
  }
}

.logos {
  width: 35px;
  margin: 10px 14px;
}
</style>
