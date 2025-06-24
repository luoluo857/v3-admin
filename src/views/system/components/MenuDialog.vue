<template>
  <el-dialog
    v-model="modelValue"
    :title="formData?.id ? '编辑菜单' : '新增菜单'"
    width="40%"
    @close="resetForm"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
      <!-- 父级菜单 -->
      <el-form-item label="父级菜单" v-if="form.parentId">
        <el-input disabled v-model="form.parentName" />
      </el-form-item>

      <!-- 菜单名称 -->
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入菜单名称" />
      </el-form-item>

      <!-- 路径 -->
      <el-form-item label="路径" prop="path">
        <el-input v-model="form.path" placeholder="请输入路由路径，如: /home" />
      </el-form-item>

      <!-- 图标 -->
      <el-form-item label="图标" prop="icon">
        <el-select v-model="form.icon" placeholder="请选择图标" popper-class="icon-select-popper">
          <el-option
            v-for="icon in icons"
            :key="icon.name"
            :label="icon.name"
            :value="icon.name"
            class="icon-option"
          >
            <el-icon :size="20" class="icon-item">
              <component :is="icon.component" />
            </el-icon>
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 类型 -->
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择类型">
          <el-option label="目录" value="directory" />
          <el-option label="菜单" value="menu" />
        </el-select>
      </el-form-item>

      <!-- 按钮权限 -->
      <div v-if="form.type === 'menu'">
        <el-form-item label="按钮权限">
          <div style="margin-bottom: 10px">
            <el-button type="primary" size="small" @click="handleAddPermission">添加权限</el-button>
          </div>
          <el-table :data="form.permission" border>
            <el-table-column prop="value" label="Value">
              <template #default="{ row }">
                <el-input v-model="row.value" placeholder="请输入权限值" />
              </template>
            </el-table-column>
            <el-table-column prop="label" label="Label">
              <template #default="{ row }">
                <el-input v-model="row.label" placeholder="请输入权限标签" />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ $index }">
                <el-button type="danger" size="small" @click="handleDeletePermission($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { HomeFilled, UserFilled, Setting, StarFilled, BellFilled, Search, Edit, Delete, Share, Upload } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  formData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const modelValue = ref(props.modelValue)
const formRef = ref(null)

// 监听 modelValue 关闭弹窗
watch(
  () => modelValue.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  }
)

// 默认表单数据
const defaultForm = {
  id: '',
  parentId: null,
  parentName: '',
  name: '',
  path: '',
  icon: '',
  type: 'directory',
  permission: []
}

// 表单数据
const form = ref({ ...defaultForm })

// 验证规则
const rules = reactive({
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路径', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  icon: [{ required: true, message: '请选择图标', trigger: 'change' }]
})

// 图标选项
const icons = [
  { name: 'HomeFilled', component: HomeFilled },
  { name: 'UserFilled', component: UserFilled },
  { name: 'Setting', component: Setting },
  { name: 'StarFilled', component: StarFilled },
  { name: 'BellFilled', component: BellFilled },
  { name: 'Search', component: Search },
  { name: 'Edit', component: Edit },
  { name: 'Delete', component: Delete },
  { name: 'Share', component: Share },
  { name: 'Upload', component: Upload }
]

// 监听弹窗显示状态
watch(
  () => props.modelValue,
  (val) => {
    modelValue.value = val
    if (val) {
      if (props.formData?.id || props.formData?.parentId) {
        // 编辑或新增子菜单时填充表单数据
        form.value = { ...props.formData, permission: props.formData.permission || [] }
      } else {
        // 新增一级菜单时重置表单
        form.value = { ...defaultForm, permission: [] }
      }
    }
  },
  { immediate: true }
)





// 重置表单
const resetForm = () => {
  form.value = {
    ...defaultForm,
    permission: [] // 确保权限数组被正确初始化
  }
  formRef.value?.resetFields()
}

// 关闭弹窗
const handleClose = () => {
  modelValue.value = false
  resetForm()
}

// 添加权限
const handleAddPermission = () => {
  form.value.permission.push({ value: '', label: '', status: 1 })
}

// 删除权限
const handleDeletePermission = (index) => {
  form.value.permission.splice(index, 1)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    // 验证权限配置
    if (form.value.type === 'menu' && (!form.value.permission || form.value.permission.length === 0)) {
      ElMessage.warning('菜单类型需要配置按钮权限')
      return
    }

    // 处理路径拼接
    const formData = { ...form.value }
    if (!formData.id && props.formData?.parentPath && formData.path) {
      // 新增子菜单时，确保路径以/开头并与父路径正确拼接
      const processedPath = formData.path.startsWith('/') ? formData.path : '/' + formData.path
      formData.path = props.formData.parentPath + processedPath
    }

    emit('submit', formData)
    modelValue.value = false
    resetForm()
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('表单验证失败，请检查必填项')
  }
}
</script>

<style scoped>
.icon-select-popper {
  width: 300px !important;
}

.icon-select-popper .el-select-dropdown__item {
  padding: 5px 5px;
  display: inline-block;
  width: 12.5%;
  text-align: center;
}

.icon-select-popper .el-select-dropdown__item span {
  display: block;
  font-size: 12px;
}

.icon-select-popper .el-select-dropdown__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  row-gap: 10px;
}

.icon-option .el-select-dropdown__item.hover {
  background-color: transparent;
}
</style>
