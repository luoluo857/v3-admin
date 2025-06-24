<template>
  <div class="app-container">
    <div class="flex">
      <SearchBox
        :queryParams="queryParams"
        placeholder="请输入用户名称"
        @search="handleSearch"
        @reset="resetQuery"
      />
      <el-button type="primary" v-permission="'user:add'" @click="handleAdd"
        >新增用户</el-button
      >
    </div>

    <!-- 用户表格 -->
    <el-table :data="userList" border>
      <el-table-column prop="id" label="用户ID" width="100" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column label="角色">
        <template #default="{ row }">
          {{ getRoleNames(row.role) }}
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="头像" width="125">
        <template #default="{ row }">
          <Image
            :src="row.avatar"
            :preview="true"
            :previewSrcList="[row.avatar]"
          />
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">
            {{ row.status ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button
            type="primary"
            v-permission="'user:edit'"
            link
            @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            v-permission="'user:remove'"
            link
            @click="handleDelete(row.id)"
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

    <!-- 用户弹窗 -->
    <UserDialog
      v-model="dialogVisible"
      :roleOptions="roleOptions"
      :formData="form"
      @submit="handleSubmitUser"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { getUser, deleteUser, updateUser, addUser, getRoles } from '@/api/api'
import UserDialog from './components/UserDialog.vue'

// 初始化数据
const userList = ref([])
const total = ref(0)
const dialogVisible = ref(false)
const roleOptions = ref([])
const roleIdToName = ref({})
// 查询参数
const queryParams = reactive({
  page: 1,
  limit: 10,
  searchName: ''
})

// 表单数据
const form = ref({})

// 获取用户列表
const fetchData = async () => {
  try {
    const { data } = await getUser(queryParams)
    // console.log(data)
    userList.value = data.data
    total.value = data.total
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

// 获取角色选项
const fetchRoles = async () => {
  try {
    const { data } = await getRoles()
    roleOptions.value = data.data.map((role) => ({
      id: role.id,
      name: role.name,
      label: role.label
    }))
    // 创建角色ID到名称的映射
    const map = {}
    data.data.forEach((role) => {
      map[role.id] = role.label
    })
    roleIdToName.value = map
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

// 角色名称转换方法
const getRoleNames = (roleIds) => {
  if (!Array.isArray(roleIds)) return ''
  return roleIds
    .map((roleId) => {
      const role = roleOptions.value.find((r) => r.name === roleId)
      return role ? role.label : '未知角色'
    })
    .join('、')
}
// 新增用户
const handleAdd = () => {
  form.value = {}
  dialogVisible.value = true
}

// 编辑用户
const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmitUser = async (formData) => {
  if (formData.id) {
    await updateUser(formData)
    ElMessage.success('编辑成功')
  } else {
    await addUser(formData)
    ElMessage.success('新增成功')
  }
  fetchData()
}

// 删除用户
const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    try {
      await deleteUser({ id })
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

// 搜索用户
const handleSearch = () => {
  queryParams.page = 1
  fetchData()
}
// 重置查询
const resetQuery = () => {
  queryParams.searchName = ''
  handleSearch()
}

// 在组件挂载时获取角色数据和用户数据
onMounted(async () => {
  await fetchRoles()
  fetchData()
})
</script>

<style scoped></style>
