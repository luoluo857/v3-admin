<template>
  <div class="app-container">
    <el-page-header title="返回" @back="goBack">
      <template #content>
        <span class="text-large font-600 mr-3">协议类目</span>
      </template>
    </el-page-header>
    <div class="detail-wrapper">
      <el-form
        ref="protocolFormRef"
        :model="protocolForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="协议标题" prop="categoryId">
          <el-select
            v-model="protocolForm.categoryId"
            placeholder="请选择协议分类"
            style="width: 100%"
          >
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="usedCategories.includes(item.id)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="协议内容" prop="content">
          <!-- <el-input
            v-model="protocolForm.content"
            type="textarea"
            :rows="15"
            placeholder="请输入协议内容"
          /> -->
          <WangEditor
            v-model="protocolForm.content"
            placeholder="请输入协议内容"
          />
        </el-form-item>
        <el-form-item label="发布状态" prop="status">
          <el-radio-group v-model="protocolForm.status">
            <el-radio :value="1">发布</el-radio>
            <el-radio :value="0">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProCategories } from '@/api/pro_category'
import { getProtocol, addProtocol, updateProtocol } from '@/api/protocol'
import { useTagsViewStore } from '@/stores/tagsView'
import WangEditor from '@/components/WangEditor.vue'
const tagsViewStore = useTagsViewStore()
const route = useRoute()
const router = useRouter()
const isEdit = ref(false)

// 表单数据
const protocolFormRef = ref(null)
const protocolForm = reactive({
  id: '',
  categoryId: '',
  content: '',
  status: 1
})

// 表单校验规则
const rules = {
  categoryId: [
    { required: true, message: '请选择协议标题', trigger: 'change' }
  ],
  content: [{ required: true, message: '请输入协议内容', trigger: 'blur' }],
  status: [{ required: true, message: '请选择发布状态', trigger: 'change' }]
}

// 分类列表
const categories = ref([])
const usedCategories = ref([])
const goBack = () => {
  history.back()
  tagsViewStore.removeTag('ADetail')
}

// 获取分类列表
const getCategories = async () => {
  try {
    const { data } = await getProCategories({ page: 1, limit: 999 })
    categories.value = data.data
  } catch (error) {
    console.error('获取协议分类列表失败：', error)
  }
}
// 获取协议详情
const getDetail = async (id) => {
  try {
    const { data } = await getProtocol({id})
    console.log(data)

    Object.assign(protocolForm, data.data)
  } catch (error) {
    console.error('获取协议详情失败：', error)
  }
}

// 提交表单
const handleSubmit = () => {
  protocolFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        if (protocolForm.id) {
          await updateProtocol(protocolForm)
          ElMessage.success('更新成功')
        } else {
          await addProtocol(protocolForm)
          ElMessage.success('新增成功')
        }
        // router.push('/agreement/protocol')
        history.back()
        tagsViewStore.removeTag('ADetail')
      } catch (error) {
        console.error('保存失败：', error)
      }
    }
  })
}

// 取消操作
const handleCancel = () => {
  // router.push('/agreement/protocol')
  history.back()
  tagsViewStore.removeTag('ADetail')
}

// 初始化
onMounted(async () => {
  const id = route.params.id

  if (id !== 0) {
    isEdit.value = true
    await getDetail(id)
  }
  await getCategories()
})
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;

  .detail-wrapper {
    max-width: 800px;
    margin-top: 20px;
  }
}
</style>
