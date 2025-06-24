<template>
  <div class="app-container">
    <!-- 操作区域 -->
    <div class="flex">
      <SearchBox
        :queryParams="queryParams"
        placeholder="请输入分类名称"
        @search="handleSearch"
        @reset="resetQuery"
      />
      <el-button type="primary" @click="handleAdd">新增分类</el-button>
    </div>

    <!-- 分类表格 -->
    <el-table :data="categoryList" border>
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="danger" link @click="handleDelete(row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.limit"
      :total="total"
      @pagination-change="fetchData"
    />

    <!-- 表单弹窗 -->
    <CategoryDialog
      v-model="dialogVisible"
      :form-data="form"
      @submit="handleSubmitCategory"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getCategories, deleteCategory, addCategory, updateCategory } from '@/api/category'
import { ElMessage, ElMessageBox } from 'element-plus'
import CategoryDialog from './components/CategoryDialog.vue'

// 数据初始化
const categoryList = ref([])
const total = ref(0)
const dialogVisible = ref(false)

// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  searchName: ''
})

const form = ref({})

// 获取分类列表
const fetchData = async () => {
  try {
    const { data } = await getCategories(queryParams)
    categoryList.value = data.data
    total.value = data.total
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

const handleSubmitCategory = async (formData) => {
  try {
    if (formData.id) {
      await updateCategory(formData)
      ElMessage.success('编辑成功')
    } else {
      await addCategory(formData)
      ElMessage.success('新增成功')
    }
    fetchData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 搜索分类
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

// 重置查询
const resetQuery = () => {
  queryParams.searchName = ''
  handleSearch()
}

// 新增分类
const handleAdd = () => {
  form.value = {}
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

// 删除分类
const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteCategory({ id })
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 初始化
onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
