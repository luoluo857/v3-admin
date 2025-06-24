<template>
  <div class="app-container">
    <div class="flex">
      <SearchBox
        :queryParams="queryParams"
        placeholder="请输入用户名"
        @search="handleSearch"
        @reset="resetQuery"
      />
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="loginTime" label="登录时间" />
      <el-table-column prop="ip" label="登录IP" />
      <el-table-column prop="browser" label="浏览器" />
      <el-table-column prop="os" label="操作系统" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '成功' : '失败' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.limit"
      :total="total"
      @pagination-change="loadData"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getLoginLogs } from '@/api/login_log'

const tableData = ref([])
const total = ref(0)
// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  searchName: ''
})

const loadData = async () => {
  try {
    const { data } = await getLoginLogs(queryParams)
    tableData.value = data.data
    total.value = data.total
  } catch (error) {
    console.error('加载登录日志失败:', error)
    ElMessage.error('加载登录日志失败')
  }
}

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}
// 重置查询
const resetQuery = () => {
  queryParams.searchName = ''
  handleSearch()
}
// 分页相关方法
const handleSizeChange = (val) => {
  queryParams.limit = val
  loadData()
}

const handleCurrentChange = (val) => {
  queryParams.page = val
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
</style>
