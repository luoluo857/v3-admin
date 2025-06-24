# Vue3 项目模板

## 项目介绍

这是一个基于 Vue3 + Vite + Element Plus 的前端项目模板，集成了常用的开发工具和最佳实践，可以帮助您快速开始新项目的开发。

## 技术栈

- **核心框架：** Vue 3.5.13
- **构建工具：** Vite 5.x
- **UI 框架：** Element Plus 2.9.10
- **状态管理：** Pinia 3.0.1
- **路由管理：** Vue Router 4.5.0
- **HTTP 请求：** Axios 1.9.0
- **富文本编辑器：** WangEditor 5.1.23
- **数据可视化：** ECharts 5.6.0
- **CSS 预处理器：** Sass
- **CSS 框架：** Tailwind CSS
- **代码规范：**
  - ESLint
  - Prettier
  - Stylelint
  - Husky (Git Hooks)
  - Commitizen (规范化提交)

## 目录结构

```
├── .husky/               # Git hooks配置
├── public/               # 静态资源目录
├── src/                  # 源代码目录
│   ├── api/             # API接口管理
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── layout/          # 布局组件
│   ├── router/          # 路由配置
│   ├── stores/          # Pinia状态管理
│   ├── styles/          # 全局样式
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── .env                 # 环境变量
├── .eslintrc.js         # ESLint配置
├── .prettierrc          # Prettier配置
├── .stylelintrc.js      # Stylelint配置
├── vite.config.js       # Vite配置
└── package.json         # 项目依赖
```

## 特性

- 🚀 基于 Vue3 + Vite，享受极速开发体验
- 📦 自动导入 Element Plus 组件，无需手动引入
- 🎨 集成 Tailwind CSS，快速构建美观界面
- 🔍 ESLint + Prettier + Stylelint，代码规范自动化
- 📝 Git 提交信息规范化，支持 conventional commits
- 🛠️ 封装 Axios 请求，统一错误处理
- 🔐 路由权限控制
- 📊 集成 ECharts，快速开发数据可视化
- 📝 集成 WangEditor 富文本编辑器

## 项目特色

### 动态路由系统
- 基于菜单配置的动态路由生成
- 支持路由权限控制

### 完整的业务模块
- **系统管理**：用户、角色、菜单管理
- **内容管理**：文章、分类管理
- **设置中心**：第三方服务、存储配置
- **协议管理**：协议分类、详情管理
- **日志中心**：登录、操作日志

### Mock数据系统
- 完整的Mock API
- 支持增删改查操作
- 便于前端独立开发

## 开发指南

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 代码格式化

```bash
pnpm format
```

### 代码检查

```bash
pnpm lint
```

### 提交代码

```bash
pnpm commit
```

## 开发规范

### Git 提交规范

- feat: 新功能
- fix: 修复问题
- docs: 文档修改
- style: 代码格式修改
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- chore: 其他修改

### 组件开发规范

- 组件名使用大驼峰命名
- 组件文件使用单词大写开头
- 公共组件放在 components 目录下
- 页面组件放在 views 目录下

### 样式开发规范

- 优先使用 Tailwind CSS 类名
- 需要自定义样式时使用 SCSS
- 遵循 BEM 命名规范

## 环境变量配置

- `.env`: 所有环境都会加载
- `.env.development`: 开发环境加载
- `.env.production`: 生产环境加载

## 部署

1. 执行构建命令
```bash
pnpm build
```

2. 将 dist 目录下的文件部署到服务器

## 注意事项

- 开发时注意查看 ESLint 和 Stylelint 的错误提示
- 提交代码前确保通过所有代码检查
- 使用 `pnpm commit` 来规范化提交信息
- 根据需要修改 `.env` 文件中的环境变量