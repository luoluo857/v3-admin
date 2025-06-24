<template>
  <div class="app-container">
    <div class="flex">
      <SearchBox
        :queryParams="queryParams"
        :placeholder="'请输入文章标题'"
        :showCategory="true"
        :categoryPlaceholder="'请选择分类'"
        :categoryOptions="categories"
        @search="handleSearch"
        @reset="resetQuery"
      />
      <el-button type="primary" @click="handleAdd">新增文章</el-button>
    </div>
    <el-table
      :data="articleList"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="title" label="标题" />
      <!-- <el-table-column prop="author" label="作者" width="120" /> -->
      <el-table-column label="分类" width="120">
        <template #default="{ row }">
          {{ getCategoryName(row.categoryId) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '已发布' : '草稿' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="180" fixed="right">
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

    <Pagination
      v-model:current-page="queryParams.page"
      v-model:page-size="queryParams.limit"
      :total="total"
      @pagination-change="getList"
    />

    <!-- 文章表单弹窗 -->
    <!-- <ArticleDialog
      v-model:visible="dialog.visible"
      :edit-data="articleForm"
      :categories="categories"
      @success="getList"
    /> -->
    <ArticleDialog
      v-model="dialogVisible"
      :form-data="articleForm"
      :categories="categories"
      @submit="handleSubmitArticle"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getArticleList, deleteArticle, updateArticle, createArticle } from '@/api/article'
import { getCategories } from '@/api/category'
import ArticleDialog from './components/ArticleDialog.vue'

// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  searchName: '',
  categoryId: ''
})

// 文章列表数据
const articleList = ref([])
const total = ref(0)
const loading = ref(false)
const categories = ref([])
const dialogVisible = ref(false)


// 表单数据
const articleForm = ref({})

// 获取文章列表
const getList = async () => {
  loading.value = true
  try {
    const {data} = await getArticleList(queryParams)
    // if (data.code === 200) {
      articleList.value = data.data
      total.value = data.total
    // }
  } catch (error) {
    console.error('获取文章列表失败:', error)
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 获取分类列表
const getCategory = async () => {
  try {
    const { data } = await getCategories()
    // if (data.code === 200) {
      categories.value = data.data
    // }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  }
}

// 根据分类ID获取分类名称
const getCategoryName = (categoryId) => {
  const category = categories.value.find((item) => item.id === categoryId)
  return category ? category.name : ''
}

const handleSubmitArticle = async (formData) => {
  try {
    if (formData.id) {
      await updateArticle(formData)
      ElMessage.success('编辑成功')
    } else {
      await createArticle(formData)
      ElMessage.success('新增成功')
    }
    getList()
  } catch (error) {
    ElMessage.error('操作失败')
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
  queryParams.categoryId = ''
  handleSearch()
}

// 新增文章
const handleAdd = () => {

  articleForm.value = {}
  dialogVisible.value = true
}

// 编辑文章
const handleEdit = (row) => {

  articleForm.value = { ...row }
  dialogVisible.value = true
}

// 删除文章
const handleDelete = (id) => {
  ElMessageBox.confirm('确认删除该文章吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteArticle({id})
      ElMessage.success('删除成功')
      getList()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}


onMounted(() => {
  getCategory()
  getList()
})
</script>

<style lang="scss" scoped>
</style>
