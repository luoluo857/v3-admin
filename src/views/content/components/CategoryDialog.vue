<template>
  <el-dialog
    v-model="modelValue"
    :title="formData.id ? '编辑分类' : '新增分类'"
    width="40%"
    @closed="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          placeholder="请输入分类描述"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="modelValue = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

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

// 弹窗显隐控制
const modelValue = ref(props.modelValue)

// 表单数据（使用 ref 管理）
const form = ref({
  id: '',
  name: '',
  description: ''
})

// 验证规则
const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入分类描述', trigger: 'blur' }]
}


// 监听 formData 变化，同步到表单
watch(
  () => props.formData,
  (newVal) => {
    if (newVal && newVal.id) {
      form.value = { ...newVal }
    } else {
      form.value = { ...form.value, status: 1}
    }
  }
)

// 监听 modelValue 变化，同步弹窗状态
watch(
  () => props.modelValue,
  (newVal) => {
    modelValue.value = newVal
  }
)

// 监听 modelValue 关闭弹窗
watch(
  () => modelValue.value,
  (newVal) => {
    emit('update:modelValue', newVal)
  }
)

// 表单引用
const formRef = ref(null)

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    emit('submit', { ...form.value })
    modelValue.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 关闭弹窗时重置表单和验证状态
const handleClose = () => {
  formRef.value?.resetFields()
  emit('update:modelValue', false)
}
</script>
