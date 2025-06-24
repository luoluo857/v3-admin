<template>
  <el-dialog v-model="modelValue" :title="formData?.id ? '编辑配置' : '新增配置'">
    <el-form ref="formRef" :model="currentRow" label-width="100px">
      <!-- 服务类型选择 -->
      <el-form-item label="服务类型" v-if="!currentRow.id" prop="serviceType">
        <el-select
          v-model="currentRow.serviceType"
          placeholder="请选择服务类型"
          @change="handleServiceTypeChange"
        >
          <el-option
            v-for="type in serviceTypes"
            :key="type"
            :label="type"
            :value="type"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 服务商选择 -->
      <div v-if="currentRow.serviceType">
        <el-form-item label="服务商">
          <div v-if="isMultiSelect(currentRow.serviceType)">
            <el-checkbox-group v-model="currentRow.selectedProviders">
              <el-checkbox
                v-for="provider in getProvidersByServiceType(
                  currentRow.serviceType
                )"
                :key="provider"
                :value="provider"
                >{{ provider }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
          <div v-else>
            <el-radio-group v-model="currentRow.selectedProvider">
              <el-radio
                v-for="provider in getProvidersByServiceType(
                  currentRow.serviceType
                )"
                :key="provider"
                :value="provider"
                >{{ provider }}</el-radio
              >
            </el-radio-group>
          </div>
        </el-form-item>
      </div>

      <!-- 动态表单字段 -->
      <div v-if="currentRow.serviceType">
        <div
          v-for="(provider, index) in getSelectedProviders"
          :key="index"
          class="dynamic-fields"
        >
          <div
            v-if="isMultiSelect(currentRow.serviceType)"
            class="flex"
            style="margin: 0 0 20px 30px"
          >
            <h4>{{ provider }}</h4>
          </div>
          <el-form-item
            v-for="(field, fieldIndex) in getFormFields(
              currentRow.serviceType
            )"
            :key="fieldIndex"
            :label="field.label"
          >
            <el-input
              :model-value="getFieldValue(field.prop, index)"
              @update:model-value="
                updateFieldValue(field.prop, index, $event)
              "
              :placeholder="`请输入${field.label}`"
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  serviceTypes: {
    type: Array,
    default: () => []
  },
  formData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// 弹窗相关状态
const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 表单数据
const currentRow = reactive({
  id: '',
  serviceType: '',
  selectedProvider: '',
  selectedProviders: [],
  merchantId: [],
  secretKey: [],
  apiKey: '',
  apiSignature: '',
  appId: [],
  appSecret: [],
  // 初始化所有字段为空数组或空字符串
  initFields() {
    this.merchantId = []
    this.secretKey = []
    this.apiKey = ''
    this.apiSignature = ''
    this.appId = []
    this.appSecret = []
  }
})

// 工具函数
const isMultiSelect = (serviceType) => {
  return ['支付服务', '第三方登录'].includes(serviceType)
}

const getProvidersByServiceType = (serviceType) => {
  const providersMap = {
    支付服务: ['微信支付', '支付宝支付', '银联支付'],
    短信服务: ['阿里云短信', '腾讯云短信'],
    地图服务: ['高德地图', '百度地图'],
    第三方登录: ['QQ登录', '微信登录']
  }
  return providersMap[serviceType] || []
}

const getFormFields = (serviceType) => {
  const fieldsMap = {
    支付服务: [
      { label: '商户ID', prop: 'merchantId' },
      { label: '密钥', prop: 'secretKey' }
    ],
    短信服务: [
      { label: 'API密钥', prop: 'apiKey' },
      { label: 'API签名', prop: 'apiSignature' }
    ],
    地图服务: [{ label: 'API Key', prop: 'apiKey' }],
    第三方登录: [
      { label: '应用ID', prop: 'appId' },
      { label: '应用密钥', prop: 'appSecret' }
    ]
  }
  return fieldsMap[serviceType] || []
}

const getSelectedProviders = computed(() => {
  return isMultiSelect(currentRow.serviceType)
    ? currentRow.selectedProviders
    : [currentRow.selectedProvider]
})

// 获取字段值
const getFieldValue = (prop, index) => {
  if (isMultiSelect(currentRow.serviceType)) {
    return currentRow[prop]?.[index] || ''
  }
  return currentRow[prop] || ''
}

// 更新字段值
const updateFieldValue = (prop, index, value) => {
  if (isMultiSelect(currentRow.serviceType)) {
    if (!Array.isArray(currentRow[prop])) {
      currentRow[prop] = []
    }
    currentRow[prop][index] = value
  } else {
    currentRow[prop] = value
  }
}

// 获取动态字段
const getDynamicFields = () => {
  const fields = {}
  const formFields = getFormFields(currentRow.serviceType)

  formFields.forEach((field) => {
    if (isMultiSelect(currentRow.serviceType)) {
      fields[field.prop] = currentRow[field.prop] || []
    } else {
      fields[field.prop] = currentRow[field.prop] || ''
    }
  })
  return fields
}

// 重置表单
const resetCurrentRow = () => {
  Object.assign(currentRow, {
    id: '',
    serviceType: '',
    selectedProvider: '',
    selectedProviders: []
  })
  currentRow.initFields()
}

// 服务类型变更处理
const handleServiceTypeChange = (newType) => {
  resetCurrentRow()
  currentRow.serviceType = newType
  const providers = getProvidersByServiceType(newType)
  if (providers.length > 0) {
    if (isMultiSelect(newType)) {
      currentRow.selectedProviders = [providers[0]]
    } else {
      currentRow.selectedProvider = providers[0]
    }
  }
}

// 取消操作
const handleCancel = () => {
  resetCurrentRow()
  emit('cancel')
  modelValue.value = false
}

// 保存操作
const handleSave = () => {
  if (!currentRow.serviceType) {
    ElMessage.error('请选择服务类型')
    return
  }

  // 构造请求数据
  const requestData = {
    serviceType: currentRow.serviceType,
    ...(isMultiSelect(currentRow.serviceType)
      ? { selectedProviders: currentRow.selectedProviders }
      : { selectedProvider: currentRow.selectedProvider }),
    ...getDynamicFields()
  }

  if (currentRow.id) {
    requestData.id = currentRow.id
  }

  emit('submit', requestData)
}

// 监听formData变化
watch(
  () => props.formData,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      // 深度复制数据
      const deepCopy = JSON.parse(JSON.stringify(newVal))
      // 确保数组字段初始化
      deepCopy.merchantId = deepCopy.merchantId || []
      deepCopy.secretKey = deepCopy.secretKey || []
      deepCopy.appId = deepCopy.appId || []
      deepCopy.appSecret = deepCopy.appSecret || []
      deepCopy.selectedProviders = deepCopy.selectedProviders || []
      // 重置当前行数据
      Object.assign(currentRow, deepCopy)
    } else {
      resetCurrentRow()
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.dynamic-fields {
  margin: 0 0 20px 30px;
}
</style>
