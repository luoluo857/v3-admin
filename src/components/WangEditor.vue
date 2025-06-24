<template>
  <div class="wang-editor-container">
    <Toolbar
      class="editor-toolbar"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      class="editor-content"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
      :style="{ height: props.height + 'px' }"
    />
    <MediaUpload v-model="imageVisible" @select="handleMediaSelected" />
  </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, shallowRef, watch, ref, defineEmits } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 500
  },
  placeholder: {
    type: String,
    default: '请输入内容...'
  },
  mode: {
    type: String,
    default: 'default' // 或 'simple'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const imageVisible = ref(false)
const insertMediaFn = ref(null)

// 内容 HTML
const valueHtml = ref(props.modelValue)

// 工具栏配置
const toolbarConfig = {
  excludeKeys: [
    'group-video',
    'insertVideo',
    'codeBlock',
    'divider',
    '|',
    'group-more-style', // 排除菜单组，写菜单组 key 的值即可
    'group-image', // 排除图片菜单组
    'insertImage'
  ],
  insertKeys: {
    index: 22, // 将图片按钮移动到链接按钮后面
    keys: ['uploadImage', 'uploadVideo'] // 添加单个图片按钮
  }
}

// 编辑器配置
const editorConfig = {
  placeholder: props.placeholder,
  MENU_CONF: {
    uploadImage: {
      customBrowseAndUpload(insertFn) {
        insertMediaFn.value = (url) => insertFn(url) // 明确图片插入逻辑
        imageVisible.value = true
      }
    },
    uploadVideo: {
      customBrowseAndUpload(insertFn) {
        insertMediaFn.value = (url) => insertFn(url) // 明确视频插入逻辑
        imageVisible.value = true
      }
    }
  }
}

// 移除图片上传配置

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 处理媒体选择
const handleMediaSelected = ({ url, type }) => {
  if (insertMediaFn.value) {
    insertMediaFn.value(url)
    insertMediaFn.value = null
  }
  imageVisible.value = false
}

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const handleChange = (editor) => {
  emit('update:modelValue', editor.getHtml())
  emit('change', editor.getHtml())
}

// 监听外部传入的 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== valueHtml.value) {
      valueHtml.value = newVal
    }
  }
)

// 提供方法供父组件调用
defineExpose({
  getEditor: () => editorRef.value
})
</script>

<style lang="scss" scoped>
.wang-editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  /* height: v-bind('props.height + "px"'); */

  .editor-toolbar {
    border-bottom: 1px solid #dcdfe6;
  }

  .editor-content {
    overflow-y: auto;
    line-height: 1.5;
  }
}

:deep(.w-e-text-container) {
  --w-e-textarea-bg-color: #fff;
  --w-e-textarea-color: #606266;
  --w-e-textarea-border-color: #dcdfe6;
  --w-e-textarea-slight-border-color: #e4e7ed;
  --w-e-textarea-slight-color: #909399;
  --w-e-textarea-slight-bg-color: #f5f7fa;
  --w-e-textarea-selected-border-color: #409eff;
  --w-e-textarea-handler-bg-color: #409eff;
}
</style>
