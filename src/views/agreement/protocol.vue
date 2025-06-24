<template>
  <div class="app-container">
    <div class="flex">
      <SearchBox
        :queryParams="queryParams"
        :placeholder="'请输入协议内容'"
        :showCategory="true"
        :categoryPlaceholder="'请选择分类'"
        :categoryOptions="categoryOptions"
        @search="handleSearch"
        @reset="resetQuery"
      />
      <el-button type="primary" @click="handleAdd">新增协议</el-button>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="categoryId" label="所属分类" width="120">
        <template #default="{ row }">
          {{ getCategoryName(row.categoryId) }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="协议内容">
        <template #default="{ row }">
          <div class="content-cell" v-html="stripHtml(row.content)"></div>
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
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button link type="danger" @click="handleDelete(row.id)"
            >删除</el-button
          >
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProtocols, deleteProtocol } from '@/api/protocol'
import { getProCategories } from '@/api/pro_category'
import { useTagsViewStore } from '@/stores/tagsView'
const tagsViewStore = useTagsViewStore()
const router = useRouter()
const tableData = ref([])
const total = ref(0)
const queryParams = reactive({
  searchName: '',
  categoryId: '',
  page: 1,
  limit: 10
})

const categoryOptions = ref([])

const loadData = async () => {
  try {
    const { data } = await getProtocols(queryParams)

    tableData.value = data.data
    total.value = data.total
  } catch (error) {
    console.error('加载协议列表失败:', error)
    ElMessage.error('加载协议列表失败')
  }
}
// 根据分类ID获取分类名称
const getCategoryName = (categoryId) => {
  const category = categoryOptions.value.find((item) => item.id === categoryId)
  return category ? category.name : '未知分类'
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

const handleSearch = () => {
  queryParams.page = 1
  loadData()
}
// 在 script 中添加方法
const stripHtml = (html) => {
  if (!html) return ''
  // 移除 HTML 标签
  const text = html.replace(/<[^>]*>/g, '')
  // 可选：截断字符（双重保护）
  return text.length > 120 ? text.slice(0, 120) + '...' : text
}

const resetQuery = () => {
  queryParams.searchName = ''
  queryParams.categoryId = ''
  handleSearch()
}

const handleAdd = () => {
  router.push(`/agreement/detail/0`)
  tagsViewStore.addTag({
    path: `/agreement/detail/0`,
    title: '协议详情',
    name: 'ADetail' // 使用统一的名称
  })
}

const handleEdit = (row) => {
  router.push(`/agreement/detail/${row.id}`)
  tagsViewStore.addTag({
    path: `/agreement/detail/${row.id}`,
    title: '协议详情',
    name: 'ADetail' // 使用统一的名称
  })
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确认删除该协议？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteProtocol({id})
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      console.error('删除协议失败:', error)
      ElMessage.error('删除协议失败')
    }
  })
}

const loadProCategories = async () => {
  try {
    const { data } = await getProCategories()

    categoryOptions.value = data.data
  } catch (error) {
    console.error('加载分类列表失败:', error)
    ElMessage.error('加载分类列表失败')
  }
}

onMounted(() => {
  loadProCategories()
  loadData()
})
</script>

<style lang="scss" scoped>
.content-cell {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限制行数 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
