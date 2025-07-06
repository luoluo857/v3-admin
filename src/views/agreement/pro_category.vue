<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="flex">
      <SearchBox
        :queryParams="queryParams"
        placeholder="请输入分类名称"
        @search="handleSearch"
        @reset="resetQuery"
      />
      <el-button type="primary" @click="handleAdd">新增分类</el-button>
    </div>

    <!-- 表格区域 -->
    <el-table v-loading="loading" border :data="categoryList" style="width: 100%">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column prop="description" label="分类描述" show-overflow-tooltip />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <Pagination
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.limit"
      :total="total"
      @pagination-change="getList"
    />

    <!-- 分类弹窗组件 -->
    <ProCategoryDialog
      v-model="dialogVisible"
      :form-data="form"
      @submit="handleSubmitProCategory"
    />
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import {
    getProCategories,
    deleteProCategory,
    updateProCategory,
    addProCategory
  } from '@/api/pro_category'
  import ProCategoryDialog from './components/ProCategoryDialog.vue'

  // 查询参数
  const queryParams = reactive({
    page: 1,
    limit: 10,
    searchName: ''
  })

  // 数据列表
  const categoryList = ref([])
  const total = ref(0)
  const loading = ref(false)

  const dialogVisible = ref(false)

  // 编辑数据
  const form = ref({})

  // 获取数据列表
  const getList = async () => {
    loading.value = true
    try {
      const { data } = await getProCategories(queryParams)
      categoryList.value = data.data
      total.value = data.total
    } catch (error) {
      console.error('获取协议分类列表失败：', error)
    } finally {
      loading.value = false
    }
  }

  // 查询操作
  const handleSearch = () => {
    queryParams.page = 1
    getList()
  }

  // 重置查询
  const resetQuery = () => {
    queryParams.searchName = ''
    handleSearch()
  }

  // 新增操作
  const handleAdd = () => {
    form.value = {}
    dialogVisible.value = true
  }

  // 编辑操作
  const handleEdit = row => {
    form.value = { ...row }
    dialogVisible.value = true
  }

  const handleSubmitProCategory = async formData => {
    try {
      if (formData.id) {
        await updateProCategory(formData)
        ElMessage.success('编辑成功')
      } else {
        await addProCategory(formData)
        ElMessage.success('新增成功')
      }
      getList()
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }

  // 删除操作
  const handleDelete = id => {
    ElMessageBox.confirm('确认要删除该协议分类吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        await deleteProCategory({ id })
        ElMessage.success('删除成功')
        getList()
      })
      .catch(() => {})
  }

  // 弹窗成功回调
  const handleDialogSuccess = () => {
    getList()
  }

  // 初始化
  onMounted(() => {
    getList()
  })
</script>

<style lang="scss" scoped></style>
