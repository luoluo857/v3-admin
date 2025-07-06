<template>
  <div class="app-container">
    <!-- 操作区域 -->
    <div class="flex">
      <el-button type="primary" v-permission="'menu:add'" @click="handleAdd"
        >新增一级菜单</el-button
      >
    </div>
    <!-- 菜单表格 -->
    <el-table
      :data="menuList"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
      border
      style="margin: 20px 0"
    >
      <el-table-column prop="name" label="菜单名称" width="200"> </el-table-column>
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="icon" label="图标" />
      <el-table-column label="类型">
        <template #default="{ row }">
          {{ row.type === 'directory' ? '目录' : '菜单' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" v-permission="'menu:add'" link @click="handleAddChild(row)"
            >添加子菜单</el-button
          >
          <el-button type="primary" v-permission="'menu:edit'" link @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="danger" v-permission="'menu:remove'" link @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 菜单弹窗 -->
    <MenuDialog v-model="dialogVisible" :form-data="currentMenu" @submit="handleSubmitMenu" />
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { getMenus, deleteMenu, updateMenu, addMenu } from '@/api/api'
  import MenuDialog from './components/MenuDialog.vue'

  // 数据初始化
  const menuList = ref([])
  const dialogVisible = ref(false)
  const currentMenu = ref(null)

  // 获取菜单列表
  const fetchData = async () => {
    try {
      const { data } = await getMenus()
      menuList.value = data.data
    } catch (error) {
      console.error('获取菜单列表失败:', error)
    }
  }

  const handleSubmitMenu = async formData => {
    try {
      if (formData.id) {
        await updateMenu(formData)
        ElMessage.success('编辑成功')
      } else {
        await addMenu(formData)
        ElMessage.success('新增成功')
      }
      fetchData()
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }

  // 新增菜单
  const handleAdd = () => {
    currentMenu.value = null
    dialogVisible.value = true
  }

  // 新增子菜单
  const handleAddChild = row => {
    if (row.type !== 'directory') {
      ElMessage.warning('只有目录类型可以添加子菜单')
    } else {
      currentMenu.value = {
        parentId: row.id,
        parentName: row.name,
        parentPath: row.path,
        type: 'menu'
      }
      dialogVisible.value = true
    }
  }

  // 编辑菜单
  const handleEdit = row => {
    currentMenu.value = {
      ...row,
      parentName: row.parentId ? findMenuParentName(row.parentId) : ''
    }
    dialogVisible.value = true
  }

  // 删除菜单
  const handleDelete = row => {
    ElMessageBox.confirm('确定要删除该菜单及其子菜单吗？', '提示', {
      type: 'warning'
    }).then(async () => {
      try {
        await deleteMenu({ id: row.id })
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        ElMessage.error('删除失败')
      }
    })
  }

  // 查找父菜单名称
  const findMenuParentName = parentId => {
    const parentMenu = menuList.value.find(menu => menu.id === parentId)
    return parentMenu ? parentMenu.name : ''
  }

  // 初始化
  onMounted(() => {
    fetchData()
  })
</script>

<style scoped></style>
