<template>
  <div class="app-container">
    <div class="storage_title flex">阿里云OSS文件存储配置</div>
    <el-form ref="formRef" :model="ossConfig" :rules="rules" label-width="120px">
      <el-form-item label="地域">
        <el-select v-model="ossConfig.region" placeholder="请选择地域">
          <el-option label="杭州" value="oss-cn-hangzhou"></el-option>
          <el-option label="北京" value="oss-cn-beijing"></el-option>
          <el-option label="上海" value="oss-cn-shanghai"></el-option>
          <el-option label="广州" value="oss-cn-guangzhou"></el-option>
          <el-option label="成都" value="oss-cn-chengdu"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="AccessKeyId">
        <el-input v-model="ossConfig.accessKeyId" placeholder="请输入AccessKeyId"></el-input>
      </el-form-item>
      <el-form-item label="AccessKeySecret">
        <el-input v-model="ossConfig.accessKeySecret" placeholder="请输入AccessKeySecret"></el-input>
      </el-form-item>
      <el-form-item label="BucketName">
        <el-input v-model="ossConfig.bucket" placeholder="请输入BucketName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveConfig">保存配置</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getStorageConfig, saveStorageConfig, resetStorageConfig } from '@/api/storage'

const ossConfig = reactive({
  region: '',
  accessKeyId: '',
  accessKeySecret: '',
  bucket: ''
})

const formRef = ref()

const rules = reactive({
  region: [{ required: true, message: '请选择地域', trigger: 'change' }],
  accessKeyId: [{ required: true, message: '请输入AccessKeyId', trigger: 'blur' }],
  accessKeySecret: [{ required: true, message: '请输入AccessKeySecret', trigger: 'blur' }],
  bucket: [{ required: true, message: '请输入BucketName', trigger: 'blur' }]
})

const getConfig = async () => {
  try {
    const { data } = await getStorageConfig()
    if (data.code === 200) {
      Object.assign(ossConfig, data.data)
    }
  } catch (error) {
    ElMessage.error('获取配置失败，请稍后重试')
    console.error('获取存储配置失败:', error)
  }
}

const saveConfig = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const { data } = await saveStorageConfig(ossConfig)
        if (data.code === 200) {
          ElMessage.success('存储配置保存成功')
        }
      } catch (error) {
        ElMessage.error('保存配置失败，请检查网络连接')
        console.error('保存存储配置失败:', error)
      }
    }
  })
}

const resetForm = async () => {
  try {
    const { data } = await resetStorageConfig()
    if (data.code === 200) {
      ElMessage.success('存储配置已重置')
      await getConfig()
    }
  } catch (error) {
    ElMessage.error('重置配置失败，请稍后重试')
    console.error('重置存储配置失败:', error)
  }
}

onMounted(() => {
  getConfig()
})
</script>

<style scoped>
.storage_title{
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>
