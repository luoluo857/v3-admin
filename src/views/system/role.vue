<template>
  <div class="app-container">
    <!-- 操作区域 -->
    <div class="flex">
      <SearchBox
        :queryParams="queryParams"
        placeholder="请输入角色名称"
        @search="handleSearch"
        @reset="resetQuery"
      />
      <el-button type="primary" @click="handleAdd">新增角色</el-button>
    </div>

    <!-- 角色表格 -->
    <el-table :data="roleList" border>
      <el-table-column prop="id" label="角色ID" width="100" />
      <el-table-column prop="label" label="角色名称" />
      <el-table-column prop="name" label="角色标识" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="success" link @click="openPermissionDialog(row)"
            >权限配置</el-button
          >
          <el-button type="danger"  v-permission="'role:remove'" link @click="handleDelete(row.id)"
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

    <RoleDialog
      v-model="dialogVisible"
      :menuOptions="menuOptions"
      :formData="form"
      @submit="handleSubmitRole"
    />
    <!-- 权限配置弹窗 -->
    <RolePermissionDialog
      v-model="permissionDialogVisible"
      :menuOptions="menuOptions"
      :formData="currentRole"
      @submit="handleSavePermissions"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getRoles, deleteRole, addRole, updateRole, getMenus } from '@/api/api'
import RoleDialog from './components/RoleDialog.vue'
import RolePermissionDialog from './components/RolePermissionDialog.vue'

// 数据初始化
const roleList = ref([])
const total = ref(0)
const menuOptions = ref([])
const form = ref({})
const dialogVisible = ref(false)


const currentRole = ref({})
const permissionDialogVisible = ref(false)

// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  searchName: ''
})

// 组件引用
const permissionDialog = ref(null)

// 获取角色列表
const fetchData = async () => {
  try {
    const { data } = await getRoles(queryParams)

    roleList.value = data.data
    total.value = data.total // 实际应使用后端返回的总数
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

// 搜索角色
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}

// 重置查询
const resetQuery = () => {
  queryParams.searchName = ''
  handleSearch()
}

// 打开权限配置弹窗
const openPermissionDialog = (row) => {

  // permissionDialog.value.open(row)
  currentRole.value = row
  permissionDialogVisible.value = true

}

// 新增角色
const handleAdd = () => {
  form.value = {}
  dialogVisible.value = true
}

// 编辑角色
const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmitRole = async (formData) => {
  if (formData.id) {
    await updateRole(formData)
    ElMessage.success('编辑成功')
  } else {
    await addRole(formData)
    ElMessage.success('新增成功')
  }
  fetchData()
}
const handleSavePermissions = async (data) => {
  try {
    await updateRole(data)
    ElMessage.success('权限配置保存成功')
    fetchData()
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 删除角色
const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await deleteRole({ id })
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}



// 获取菜单数据
const fetchMenus = async () => {
  try {
    const { data } = await getMenus()
    menuOptions.value = data.data
  } catch (error) {
    console.error('获取菜单列表失败:', error)
  }
}

// 初始化
onMounted(() => {
  fetchData()
  fetchMenus()
})
</script>

<style scoped>
</style>
