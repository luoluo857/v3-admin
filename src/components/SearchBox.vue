<template>
  <div class="search-box">
    <el-form :inline="true" :model="queryParams">
      <el-form-item>
        <el-input
          v-model="queryParams.searchName"
          :placeholder="placeholder || '请输入关键词'"
          clearable
          @keyup.enter="handleSearch"
          class="input_name"
        />
      </el-form-item>
      <el-form-item v-if="showCategory">
        <el-select
          v-model="queryParams.categoryId"
          :placeholder="categoryPlaceholder || '请选择分类'"
          clearable
          style="width: 200px;"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  // 查询参数对象
  queryParams: {
    type: Object,
    required: true
  },
  // 输入框占位符
  placeholder: {
    type: String,
    default: '请输入关键词'
  },
  // 是否显示分类选择器
  showCategory: {
    type: Boolean,
    default: false
  },
  // 分类选择器占位符
  categoryPlaceholder: {
    type: String,
    default: '请选择分类'
  },
  // 分类选项
  categoryOptions: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['search', 'reset'])

// 搜索清晰的操作
const handleSearch = () => {
  emits('search', props.queryParams)
}

const handleReset = () => {
  props.queryParams.searchName = ''
  props.queryParams.categoryId = ''
  emits('reset', props.queryParams)
}
</script>

<style scoped>

</style>
