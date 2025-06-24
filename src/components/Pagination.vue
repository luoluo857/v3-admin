<template>
  <div class="page">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      :layout="layout"
      @update:current-page="handleCurrentPageUpdate"
      @update:page-size="handlePageSizeUpdate"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default: () => [10, 20, 30, 50]
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  }
})

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'pagination-change'])

const handleCurrentPageUpdate = (newPage) => {
  emit('update:currentPage', newPage)
  emit('pagination-change')
}

const handlePageSizeUpdate = (newSize) => {
  emit('update:pageSize', newSize)
  emit('pagination-change')
}
</script>

<style scoped>
</style>
