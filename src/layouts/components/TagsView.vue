<!-- TagsView.vue -->
<template>
  <div class="tags-view flex gap-2">
    <el-tag
      v-for="tag in tagsList"
      :key="tag.name"
      :type="activeTag === tag.name ? 'primary' : 'info'"
      :closable="tag.closable"
      :disable-transitions="false"
      @click="handleTagClick(tag.name)"
      @close="handleClose(tag.name)"
      class="tag-item"
    >
      {{ tag.title }}
    </el-tag>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useTagsViewStore } from '@/stores/tagsView'
import { useRoute, useRouter } from 'vue-router'

const tagsViewStore = useTagsViewStore()
const route = useRoute()
const router = useRouter()

// 双向绑定 activeTag
const activeTag = computed({
  get: () => tagsViewStore.activeTag,
  set: (val) => tagsViewStore.setActiveTag(val)
})
onMounted(() => {
  // 恢复上次保存的活动标签
  const savedActiveTag = localStorage.getItem('activeTag')
  if (savedActiveTag) {
    tagsViewStore.setActiveTag(savedActiveTag)
  }
})

// 监听路由变化，更新 activeTag
watch(
  () => route.name,
  (newName) => {
    // tagsViewStore.setActiveTag(newPath)
    // 确保 activeTag 与当前路由路径同步
    if (newName !== activeTag.value) {
      tagsViewStore.setActiveTag(newName)
    }
  }
)

// 标签页列表
const tagsList = computed(() => tagsViewStore.tagsList)
// 点击标签页
const handleTagClick = (name) => {
  activeTag.value = name
}

// 关闭标签页
const handleClose = (name) => {
  tagsViewStore.removeTag(name)
}
</script>
<style scoped>
.tags-view {
  width: 100%;
  overflow: scroll;
  padding: 10px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 100;
}

.tags-list {
  display: flex;
  gap: 5px;
}

.tag-item {
  cursor: pointer;
  user-select: none;
}

.tag-item:hover {
  opacity: 0.8;
}
</style>
