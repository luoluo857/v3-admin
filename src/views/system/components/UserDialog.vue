<template>
  <el-dialog v-model="modelValue" :title="formData.id ? '编辑用户' : '新增用户'" width="40%">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="角色标识符" prop="role">
        <el-select v-model="form.role" multiple placeholder="请选择角色">
          <el-option
            v-for="role in roleOptions"
            :key="role.id"
            :label="role.label"
            :value="role.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" maxlength="11" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <Image :src="form.avatar" @click="handleUpload" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
    <MediaUpload v-model="imageVisible" @select="handleImageSelected" />
  </el-dialog>
</template>

<script setup>
  import { ref, defineProps, defineEmits, watch } from 'vue'
  import Image from '@/components/Image.vue'
  import MediaUpload from '@/components/MediaUpload.vue'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    },
    roleOptions: {
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
  const imageVisible = ref(false)

  // 表单数据
  const form = ref({
    username: '',
    mobile: '',
    email: '',
    avatar: '',
    role: [],
    status: 1
  })

  // 表单验证规则
  const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }],
    mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
  }

  // 监听 modelValue 变化
  watch(
    () => props.modelValue,
    newVal => {
      modelValue.value = newVal
      if (newVal && props.formData.id) {
        form.value = { ...props.formData }
      } else {
        form.value = {
          username: '',
          mobile: '',
          email: '',
          avatar: '',
          role: [],
          status: 1
        }
      }
    }
  )

  // 监听 modelValue 关闭弹窗
  watch(
    () => modelValue.value,
    newVal => {
      emit('update:modelValue', newVal)
    }
  )

  const handleUpload = () => {
    imageVisible.value = true
  }

  const handleImageSelected = url => {
    form.value.avatar = url.url
    imageVisible.value = false
  }

  const handleCancel = () => {
    modelValue.value = false
  }

  const formRef = ref(null)

  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      emit('submit', { ...form.value }) // 提交表单数据
      modelValue.value = false
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }
</script>

<style scoped></style>
