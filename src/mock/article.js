import Mock from 'mockjs'

const articles = [
  {
    "id": "1",
    "title": "Vue3 组合式API最佳实践",
    "content": "Vue3的组合式API（Composition API）是一个革命性的特性...",
    "categoryId": "1",
    "author": "大神",
    "status": 1,
    "createTime": "2025-03-01 09:00:27"
  },
  {
    "id": "2",
    "title": "Node.js性能优化指南",
    "content": "本文将介绍Node.js应用性能优化的关键策略...",
    "categoryId": "2",
    "author": "大师",
    "status": 1,
    "createTime": "2025-03-05 14:30:38"
  },
  {
    "id": "3",
    "title": "Docker容器化部署实践",
    "content": "Docker作为主流的容器化技术，本文将分享实际部署经验...",
    "categoryId": "3",
    "author": "大神",
    "status": 1,
    "createTime": "2025-03-07 16:15:23"
  }
]

// 分页查询
Mock.mock(/\/api\/articles/, 'get', (options) => {
  console.log('拦截到文章列表请求:', options.url) // 添加这行
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page')) || 1
  const limit = parseInt(params.get('limit')) || 10
  const title = params.get('searchName') || ''
  const categoryId = params.get('categoryId') || ''

  let filteredArticles = articles
  if (title) {
    filteredArticles = filteredArticles.filter(article => article.title.includes(title))
  }
  if (categoryId) {
    filteredArticles = filteredArticles.filter(article => article.categoryId === categoryId)
  }

  const start = (page - 1) * limit
  const end = page * limit

  return {
    code: 200,
    data: filteredArticles.slice(start, end),
    total: filteredArticles.length
  }
})

// 添加文章
Mock.mock(/\/api\/articles/, 'post', (options) => {
  const { title, content, categoryId, author, status } = JSON.parse(options.body)
  const newArticle = {
    id: String(articles.length + 1),
    title,
    content,
    categoryId,
    author,
    status,
    createTime: new Date().toLocaleString()
  }
  articles.push(newArticle)
  return {
    code: 200,
    data: newArticle,
    message: '文章添加成功'
  }
})

// 修改文章
Mock.mock(/\/api\/articles\/(\d+)/, 'put', (options) => {
  const id = options.url.match(/\/api\/articles\/(\d+)/)[1]
  const { title, content, categoryId, status } = JSON.parse(options.body)
  const index = articles.findIndex(article => article.id === id)

  if (index !== -1) {
    articles[index] = { ...articles[index], title, content, categoryId, status }
    return {
      code: 200,
      data: articles[index],
      message: '文章更新成功'
    }
  }
  return {
    code: 404,
    message: '文章未找到'
  }
})

// 删除文章
Mock.mock(/\/api\/articles\/(\d+)/, 'delete', (options) => {
  const id = options.url.match(/\/api\/articles\/(\d+)/)[1]
  const index = articles.findIndex(article => article.id === id)

  if (index !== -1) {
    articles.splice(index, 1)
    return {
      code: 200,
      message: '文章删除成功'
    }
  }
  return {
    code: 404,
    message: '文章未找到'
  }
})
