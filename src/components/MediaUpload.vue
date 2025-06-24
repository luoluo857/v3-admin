<template>
  <el-dialog v-model="dialogVisible" title="媒体管理" width="650px">
    <!-- 上传区域 -->
    <div class="upload-container">
      <el-upload
        ref="uploadRef"
        :show-file-list="false"
        :http-request="handleUpload"
        name="file"
        :before-upload="beforeUpload"
        class="upload-area"
      >
        <div v-if="!uploading" class="upload-button">
          <el-icon :size="22"><Plus /></el-icon>
          <div class="el-upload__text">点击上传</div>
        </div>
        <!-- 上传进度条 -->
        <div v-else class="upload-progress">
          <el-progress
            :percentage="uploadProgress"
            :show-text="false"
            style="width: 90px"
          />
          <div class="progress-text">{{ uploadProgress }}%</div>
          <el-button
            size="small"
            type="danger"
            @click.stop="cancelUpload"
            class="cancel-btn"
          >
            取消
          </el-button>
        </div>
      </el-upload>

      <!-- 图片展示区域 -->
      <div
        v-for="(item, index) in paginatedImages"
        :key="index"
        class="media-item"
        @click="handleImageSelect(item.url, item.type)"
      >
        <!-- <img :src="item.url" alt="图片" /> -->
        <template v-if="item.type === 'image'">
          <img :src="item.url" alt="图片" />
        </template>
        <template v-else>
          <div class="video-preview">
            <video :src="item.url"></video>
            <div class="video-icon">
              <el-icon :size="24"><VideoPlay /></el-icon>
            </div>
          </div>
        </template>
        <div class="media-hover">点击选择</div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, watchEffect, defineProps } from 'vue'

import {
  ElDialog,
  ElUpload,
  ElProgress,
  ElPagination,
  ElIcon,
  ElMessage
} from 'element-plus'
import { Plus, VideoPlay } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue', 'select'])

// API配置
const uploadUrl = 'http://localhost:3000/api/upload'
const listUrl = 'http://localhost:3000/api/images'

// 状态管理
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)
const imageList = ref([])
const uploadRef = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)
const controller = ref(null)
// 计算分页后的图片
const paginatedImages = computed(() => {
  return imageList.value
})

// 自定义上传逻辑
const handleUpload = async (options) => {
  try {
    uploading.value = true
    uploadProgress.value = 0

    controller.value = new AbortController()
    const formData = new FormData()
    formData.append('file', options.file) // 确保字段名与后端一致
    const response = await axios.post(uploadUrl, formData, {
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          uploadProgress.value = progress
        }
      },
      signal: controller.value.signal
    })

    if (response.data?.code === 200) {
      setTimeout(() => {
        ElMessage.success(response.data.message || '上传成功')
        uploading.value = false
        uploadProgress.value = 0
        fetchImages() // 等待列表刷新完成
      }, 1000)
    } else {
      throw new Error(response.data.message || '上传失败')
    }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('用户的上传已取消')
    } else {
      console.error('Upload error:', error)
    }
    // ElMessage.error(`上传失败: ${error.message}`)
  } finally {
    // uploading.value = false
    // uploadProgress.value = 0
  }
}

// 获取图片列表
const fetchImages = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value
    }

    const { data } = await axios.get(listUrl, { params })

    imageList.value = data.data.images
    currentPage.value = data.data.pagination.page
    pageSize.value = data.data.pagination.pageSize
    total.value = data.data.pagination.total
  } catch (error) {
    ElMessage.error('获取图片列表失败')
    console.error('Error fetching images:', error)
  }
}
// 取消上传
const cancelUpload = () => {
  controller.value.abort()

  uploading.value = false
  uploadProgress.value = 0
  // 清除上传组件内部文件列表
  ElMessage.warning('上传已取消')
  setTimeout(() => {
    fetchImages()
  }, 500)
}
// 文件上传前校验
const beforeUpload = (file) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/ogg'
  ]
  const isAllowed = allowedTypes.includes(file.type)
  const isLt500M = file.size / 1024 / 1024 < 500

  if (!isAllowed) {
    ElMessage.error('只能上传图片或视频文件!')
    return false
  }

  if (!isLt500M) {
    ElMessage.error('文件大小不能超过500MB!')
    return false
  }

  return true
}

// 分页操作
const handleSizeChange = (val) => {
  pageSize.value = val
  fetchImages()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchImages()
}

// 图片选择处理
const handleImageSelect = (url, type) => {
  emit('select', { url, type })
  dialogVisible.value = false
}

// 控制弹窗显示
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    if (val) fetchImages() // 打开弹窗时自动加载
  }
})

// 初始化加载
watchEffect(() => {
  if (dialogVisible.value) {
    fetchImages()
  }
})
</script>

<style scoped>
.upload-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  height: 236px;
}

.upload-button {
  width: 100px;
  height: 100px;
  padding: 5px;
  color: #999;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
}
.el-upload__text {
  font-size: 12px;
}

.media-item {
  width: 100px;
  height: 100px;
  position: relative;
  cursor: pointer;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.media-item img,
.media-item video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.video-preview {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
}

.video-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.8);
}

.media-hover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: none;
  align-items: center;
  justify-content: center;
}

.media-item:hover .media-hover {
  display: flex;
}

.media-hover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: none;
  align-items: center;
  justify-content: center;
}

.media-item:hover .media-hover {
  display: flex;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
.total {
  margin-left: 10px;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 26px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.progress-text {
  font-size: 12px;
  color: #409eff;
  margin-top: 8px;
}

.cancel-btn {
  margin-top: 8px;
  width: 100%;
}
</style>
