<template>
  <el-dialog
    v-model="modelValue"
    :title="formData.id ? '编辑角色' : '新增角色'"
    width="40%"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="角色名称" prop="label">
        <el-input v-model="form.label" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="角色标识" prop="name">
        <el-input v-model="form.name" placeholder="请输入角色标识" />
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          placeholder="请输入角色描述"
        />
      </el-form-item>
      <el-form-item label="关联菜单" prop="menuId">
        <el-tree
          ref="menuTree"
          :data="menuOptions"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          :default-checked-keys="form.menuId"
          @check="handleMenuCheck"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  menuOptions: {
    type: Array,
    required: true
  },
  formData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const modelValue = ref(props.modelValue)
const menuTree = ref(null)
const formRef = ref(null)

// 表单数据
const form = ref({
  id: '',
  label: '',
  name: '',
  description: '',
  menuId: []
})

// 树结构配置
const defaultProps = {
  children: 'children',
  label: 'title'
}

// 获取所有菜单 ID
const getAllMenuIds = (menus) => {
  const ids = []
  const traverse = (nodes) => {
    nodes.forEach(node => {
      ids.push(node.id)
      if (node.children) traverse(node.children)
    })
  }
  traverse(menus)
  return ids
}

// 处理菜单勾选
const handleMenuCheck = (checkedNodes, { checkedKeys }) => {
  form.menuId = checkedKeys
}

// 验证规则
const rules = {
  label: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  name: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
  menuId: [{ required: true, message: '请选择关联菜单', trigger: 'change' }]
}

// 监听 modelValue 变化，同步表单数据
watch(
  () => props.modelValue,
  (newVal) => {
    modelValue.value = newVal
    if (newVal && props.formData.id) {
      // 编辑模式：复制数据
      // Object.assign(form, props.formData)
      form.value = { ...props.formData }
      nextTick(() => {
        if (form.value.menuId.includes('*')) {
          // 如果是超级管理员，勾选所有菜单
          menuTree.value.setCheckedNodes(props.menuOptions)
        } else {
          // 普通角色，勾选指定菜单
          menuTree.value.setCheckedKeys(form.value.menuId)
        }
      })
    } else {
      // 新增模式：重置数据
      // Object.assign(form, {
      //   id: '',
      //   label: '',
      //   name: '',
      //   description: '',
      //   menuId: []
      // })
      form.value = {
        id: '',
        label: '',
        name: '',
        description: '',
        menuId: []
      }
    }
  }
)

// 监听 modelValue 关闭弹窗
watch(
  () => modelValue.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  }
)

// 取消按钮
const handleCancel = () => {
  modelValue.value = false
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    // 验证菜单是否选择
    if (!form.value.menuId || form.value.menuId.length === 0) {
      ElMessage.warning('请选择关联菜单')
      return
    }

    // 全选检测
    const allMenuIds = getAllMenuIds(props.menuOptions)
    if (form.value.menuId.length === allMenuIds.length) {
      form.value.menuId = ['*']
    }

    emit('submit', { ...form.value })
    modelValue.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}
</script>

<style scoped></style>
