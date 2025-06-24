<template>
  <div
    class="custom-image-wrapper"
    :style="{ width: finalWidth, height: finalHeight }"
  >
    <!-- 空状态或加载前占位 -->
    <div v-if="shouldShowPlaceholder" class="image-placeholder">
      <slot name="placeholder">
        <el-icon :size="iconSize" class="loading-icon"><Picture /></el-icon>
      </slot>
    </div>
    <el-image
      v-else
      :src="src"
      :fit="fit"
      :lazy="lazy"
      :preview-src-list="shouldPreview ? previewList : []"
      :z-index="previewZIndex"
      :hide-on-click-modal="hideOnClickModal"
      class="custom-image"
      v-bind="$attrs"
      :preview-teleported="true"
    >
      <!-- 加载失败插槽 -->
      <template #error>
        <slot name="error">
          <div class="image-error">
            <el-icon :size="iconSize" class="error-icon"><Picture /></el-icon>
            <span class="error-text">加载失败</span>
          </div>
        </slot>
      </template>

      <!-- 默认插槽（用于额外内容） -->
      <slot />
    </el-image>
  </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { ElImage, ElIcon } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'

const props = defineProps({
  // 图片地址
  src: {
    type: String,
    default: ''
  },
  // 宽度（支持CSS单位）
  width: {
    type: String,
    default: '100'
  },
  // 高度（支持CSS单位）
  height: {
    type: String,
    default: '100'
  },
  // 适应方式
  fit: {
    type: String,
    default: 'contain',
    validator: (value) =>
      ['fill', 'contain', 'cover', 'none', 'scale-down'].includes(value)
  },
  // 是否开启懒加载
  lazy: {
    type: Boolean,
    default: false
  },
  // 预览图片列表
  previewSrcList: {
    type: Array,
    default: () => []
  },
  // 是否启用预览
  preview: {
    type: Boolean,
    default: false
  },
  // 预览图层级
  previewZIndex: {
    type: Number,
    default: 2000
  },
  // 是否点击遮罩关闭预览
  hideOnClickModal: {
    type: Boolean,
    default: true
  },
  // 图标尺寸
  iconSize: {
    type: Number,
    default: 28
  }
})

// 计算最终宽高（添加单位自动补全）
const finalWidth = computed(() => addUnit(props.width))
const finalHeight = computed(() => addUnit(props.height))

// 是否应该显示预览
const shouldPreview = computed(() => {
  return props.preview && props.previewSrcList.length > 0
})
// 判断是否显示占位图（空值或未加载时）
const shouldShowPlaceholder = computed(() => {
  return !props.src
})

// 处理单位自动补全
const addUnit = (value) => {
  if (/(%|px|em|rem|vw|vh)$/.test(value)) {
    return value
  }
  return `${value}px`
}

// 计算预览列表
const previewList = computed(() => {
  return props.previewSrcList.length > 0 ? props.previewSrcList : [props.src]
})
</script>

<style scoped>
.custom-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  transition: all 0.3s ease;
  /* display: inline-block; 改为行内块级元素 */
  border: 1px solid #eee;
  padding: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.custom-image {
  width: 100%;
  height: 100%;
  display: block;
  vertical-align: top; /* 消除行内块间隙 */
}

.image-placeholder,
.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  color: #909399;
}

.loading-text,
.error-text {
  font-size: 14px;
}
</style>
