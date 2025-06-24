<template>
  <el-dialog
    v-model="modelValue"
    title="权限配置"
    width="60%"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane
        v-for="menu in filteredMenus"
        :key="menu.id"
        :label="menu.title"
        :name="menu.id.toString()"
      >
        <div
          v-for="subMenu in menu.children"
          :key="subMenu.id"
          style="margin-bottom: 10px; display: flex; align-items: center"
        >
          <div
            v-if="subMenu.permission && subMenu.permission.length > 0"
            style="font-weight: bold; margin-right: 10px; white-space: nowrap"
          >
            {{ subMenu.title }}
          </div>
          <el-checkbox-group v-model="form.permission">
            <el-checkbox
              v-for="permission in subMenu.permission"
              :key="permission.id"
              :value="permission.value"
            >
              {{ permission.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

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
const activeTab = ref(null)

// 表单数据
const form = ref({
  permission: []
})

// 筛选有权限配置的菜单
const filteredMenus = computed(() => {
  return props.menuOptions.filter(menu => {
    if (!menu.children) return false
    return menu.children.some(subMenu => {
      return subMenu.permission && subMenu.permission.length > 0
    })
  })
})

// 获取所有权限值
const getAllPermissions = (menus) => {
  const permissions = []
  const traverse = (nodes) => {
    nodes.forEach(node => {
      if (node.permission) {
        node.permission.forEach(p => permissions.push(p.value))
      }
      if (node.children) traverse(node.children)
    })
  }
  traverse(menus)
  return permissions
}

// 监听 modelValue 变化，同步表单数据
watch(
  () => props.modelValue,
  (newVal) => {
    modelValue.value = newVal
    if (newVal) {
      // 默认激活第一个 tab
      activeTab.value = filteredMenus.value[0]?.id.toString() || null
      // 打开弹窗时初始化权限
      const allPermissions = getAllPermissions(props.menuOptions)

      nextTick(() => {
        if (props.formData.permission?.includes('*')) {
          form.value = {
            permission: allPermissions
          }
        } else {
          form.value = {
            permission: props.formData.permission || []
          }
        }

      })
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
  try {
    // 判断是否全选权限
    const allPermissions = getAllPermissions(props.menuOptions)
    const isAllSelected = form.value.permission.length === allPermissions.length

    emit('submit', {
      ...props.formData,
      permission: isAllSelected ? ['*'] : [...new Set(form.value.permission)]
    })

    modelValue.value = false
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped></style>
