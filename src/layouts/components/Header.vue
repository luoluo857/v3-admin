<template>
  <el-header>
    <div class="flex w-full h-full justify-between items-center">
      <div class="flex items-center">
        <div @click="collapse" class="collapse-btn">
          <el-icon size="26" v-if="userStore.isCollapse"><Expand /></el-icon>
          <el-icon size="26" v-else><Fold /></el-icon>
        </div>
        <Breadcrumb />
      </div>

      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <el-avatar
              :size="32"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            />
            {{ userStore.userInfo?.name }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import Breadcrumb from './Breadcrumb.vue'
import { Expand, Fold } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const collapse = () => {
  userStore.handleCollapse()
}

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped lang="scss">
.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  padding: 0 20px;
}

.collapse-btn {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f7fa;
  }
}

.header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.el-avatar {
  margin-right: 8px;
}
</style>
