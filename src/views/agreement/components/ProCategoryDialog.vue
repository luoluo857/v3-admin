<template>
  <el-dialog
    v-model="modelValue"
    :title="formData?.id ? '编辑分类' : '新增分类'"
    width="500px"
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

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :value="1">启用</el-radio>
          <el-radio :value="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="modelValue = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
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
  description: '',
  status: 1
})

// 验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入分类描述', trigger: 'blur' },
    { min: 2, max: 200, message: '长度在 2 到 200 个字符', trigger: 'blur' }
  ],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}


// 监听 formData 变化，初始化表单
watch(
  () => props.formData,
  (newVal) => {
    if (newVal && newVal.id) {
      // 编辑模式：使用传入的数据
      form.value = { ...newVal }
    } else if (newVal && Object.keys(newVal).length === 0) {
      // 新增模式：只有当传入空对象时才重置表单
      form.value = {
        id: '',
        name: '',
        description: '',
        status: 1
      }
    }
    // 如果传入的是非空对象但没有id，说明是新增模式的数据，直接使用
    // else if (newVal && Object.keys(newVal).length > 0 && !newVal.id) {
    //   form.value = { ...newVal }
    // }
  },{ immediate: true }
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

// 关闭弹窗时重置表单
const handleClose = () => {
  formRef.value?.resetFields()
  emit('update:modelValue', false)
}
</script>
