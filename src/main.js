import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 导入Element Plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'normalize.css'
// import 'element-plus/dist/index.css'
import './assets/main.css'
import App from './App.vue'
import router from './router'
// import '@wangeditor/editor/dist/css/style.css'
import './mock'
import permission from './directives/permission'
// 导入基础样式
import './styles/element/index.scss'
const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(permission)
app.mount('#app')
