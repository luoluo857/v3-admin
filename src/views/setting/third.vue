<template>
  <div class="app-container">
    <!-- 操作按钮和表格 -->
    <div class="flex">
      <el-button type="primary" @click="addNewConfig">新增配置</el-button>
    </div>

    <el-table
      :data="serviceConfigData"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="serviceType" label="服务类型"></el-table-column>
      <el-table-column label="服务商">
        <template #default="scope">
          <div v-if="Array.isArray(scope.row.selectedProviders)">
            <div
              v-for="(provider, index) in scope.row.selectedProviders"
              :key="index"
            >
              {{ provider }}
            </div>
          </div>
          <div v-else>
            {{ scope.row.selectedProvider }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{row}">
          <el-button type="primary" link @click="editRow(row)">编辑</el-button>
          <el-button type="danger" link @click="deleteRow(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 服务配置弹窗 -->
    <ServiceConfigDialog
      v-model="dialogVisible"
      :service-types="serviceTypes"
      :form-data="currentRow"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
    <!-- <ServiceConfigDialog
      v-model="dialogVisible"
      :service-types="serviceTypes"
      :row-data="currentRow"
      @save="handleSave"
      @cancel="handleCancel"
    /> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ServiceConfigDialog from './components/ServiceConfigDialog.vue'
import {
  getServiceConfigs,
  addServiceConfig,
  updateServiceConfig,
  deleteServiceConfig,
  getServiceTypes
} from '@/api/third'

// 表格数据
const serviceConfigData = ref([])

// 弹窗相关状态
const dialogVisible = ref(false)
const currentRow = ref({})

// 服务类型选项
const serviceTypes = ref([])
// const serviceTypes = ref(['支付服务', '短信服务', '地图服务', '第三方登录'])

// 初始化加载数据
onMounted(async () => {
  await fetchServiceTypes()
  await fetchConfigs()
})

// 获取服务类型
const fetchServiceTypes = async () => {
  try {
    const res = await getServiceTypes()
    serviceTypes.value = res.data.data
  } catch (error) {
    ElMessage.error('获取服务类型失败')
  }
}

// 获取配置列表
const fetchConfigs = async () => {
  try {
    const res = await getServiceConfigs({
      page: 1,
      limit: 10
    })
    serviceConfigData.value = res.data.data
  } catch (error) {
    ElMessage.error('获取配置列表失败')
  }
}

// 新增配置
const addNewConfig = () => {
  currentRow.value = {}
  dialogVisible.value = true
}

// 编辑配置
const editRow = (row) => {
  currentRow.value = {...row}
  dialogVisible.value = true
}

// 删除配置
const deleteRow = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该配置吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteServiceConfig({id})
    await fetchConfigs()
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 处理保存
const handleSubmit = async (data) => {
  try {
    if (data.id) {
      // 更新操作
      await updateServiceConfig(data)
      ElMessage.success('更新成功')
    } else {
      // 新增操作
      await addServiceConfig(data)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    await fetchConfigs()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 处理取消
const handleCancel = () => {
  currentRow.value = {}
  dialogVisible.value = false
}
</script>

<style scoped>
.el-table {
  margin-top: 20px;
}

.dynamic-fields {
  margin: 0 0 20px 30px;
}

.provider-title {
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}
</style>
