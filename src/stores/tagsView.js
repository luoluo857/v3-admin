// src/stores/tagsView.js
import { defineStore } from 'pinia'
import router from '@/router'

export const useTagsViewStore = defineStore('tagsView', {
  state: () => ({
    tagsList: JSON.parse(localStorage.getItem('tagsList')) || [
      {
        path: '/home',
        title: '首页',
        name: 'Home', // 添加 name 属性
        closable: false // 标记不可关闭
      }
    ], // 标签页列表
    activeTag: localStorage.getItem('activeTag') || 'Home' // 当前激活的标签页
  }),
  actions: {
    addTag(tag) {
      if (tag.name === 'Home') return
      // 使用路由的 name 属性作为标识
      // 检查标签是否已存在
      if (!this.tagsList.some((t) => t.name === tag.name)) {
        this.tagsList.push({ ...tag, closable: true })
      }
      this.setActiveTag(tag.name) // 使用 name 设置活动标签
      this.saveState()
    },
    removeTag(name) {
      // 禁止删除首页
      if (name === 'Home') return
      // 移除指定名称的标签页
      this.tagsList = this.tagsList.filter((t) => t.name !== name)
      if (name === this.activeTag) {
        const newActiveTag =
          this.tagsList[this.tagsList.length - 1]?.name || 'Home'
        this.setActiveTag(newActiveTag) // 关闭当前标签时跳转
        this.saveState()
      }
    },
    setActiveTag(name) {
      // 确保名称存在于 tagsList 中
      const exists = this.tagsList.find((tag) => tag.name === name)
      if (exists) {
        this.activeTag = name
        // 使用完整的路由路径进行跳转，保留参数
        router.push(exists.path)
      } else {
        // 如果名称不存在，跳转到首页
        this.activeTag = 'Home'
        router.push({ name: 'Home' })
      }
      this.saveState()
    },
    clearTags() {
      // 清空所有标签页，仅保留首页
      this.tagsList = [
        { path: '/home', title: '首页', name: 'Home', closable: false }
      ]
      this.activeTag = 'Home'
      this.saveState()
    },
    saveState() {
      // 将状态保存到 localStorage
      localStorage.setItem('tagsList', JSON.stringify(this.tagsList))
      localStorage.setItem('activeTag', this.activeTag)
    }
  }
})
