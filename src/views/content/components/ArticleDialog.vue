<template>
  <el-dialog
    v-model="modelValue"
    :title="formData?.id ? '编辑文章' : '新增文章'"
    width="800px"
    append-to-body
    @closed="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入文章标题" />
      </el-form-item>

      <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择分类">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="6"
          placeholder="请输入文章内容"
        />
      </el-form-item>

      <el-form-item label="发布状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :value="1">发布</el-radio>
          <el-radio :value="0">草稿</el-radio>
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
    default: () => null
  },
  categories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

// 弹窗显隐控制
const modelValue = ref(props.modelValue)

// 表单数据（使用 ref 管理）
const form = ref({
  id: '',
  title: '',
  content: '',
  categoryId: '',
  status: 1
})

// 验证规则
const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

// 监听 formData 变化，同步到表单
watch(
  () => props.formData,
  (newVal) => {
    if (newVal && newVal.id) {
      form.value = { ...newVal }
    } else {
      form.value = {
        id: '',
        title: '',
        content: '',
        categoryId: '',
        status: 1
      }
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
