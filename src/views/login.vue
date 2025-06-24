<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginForm = ref({
  username: 'admin', // 默认管理员用户名
  password: '123456' // 默认管理员密码
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const loginFormRef = ref()
const selectedRole = ref('admin') // 默认选中管理员

const handleLogin = async () => {
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await userStore.login(loginForm.value)
        ElMessage.success('登录成功')
        router.push('/home')
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
      }
    }
  })
}

const handleRoleChange = (role) => {
  switch (role) {
    case 'admin':
      loginForm.value.username = 'admin'
      loginForm.value.password = '123456'
      break
    case 'editor':
      loginForm.value.username = 'editor'
      loginForm.value.password = '123456'
      break
    case 'user':
      loginForm.value.username = 'user'
      loginForm.value.password = '123456'
      break
    default:
      loginForm.value.username = ''
      loginForm.value.password = ''
  }
}
</script>

<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <h2>系统登录</h2>
      </template>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="rules"
        label-width="0"
        size="large"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="selectedRole" @change="handleRoleChange" class="role-radio-group">
            <el-radio label="admin" class="role-radio">管理员</el-radio>
            <el-radio label="editor" class="role-radio">编辑</el-radio>
            <el-radio label="user" class="role-radio">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
$bg-color: #f5f5f5;
$card-width: 400px;

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: $bg-color;
}

.login-card {
  width: $card-width;

  :deep(.el-card__header) {
    text-align: center;
  }
}

.login-button {
  width: 100%;
}

.role-radio-group {
  display: flex;
  justify-content: space-evenly;
  width: 100%;

}
</style>
