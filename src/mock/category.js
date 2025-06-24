import Mock from 'mockjs'

const categories = [
  {
    "id": "1",
    "name": "前端开发",
    "description": "前端相关技术文章",
    "createTime": "2025-03-01 09:00:27"
  },
  {
    "id": "2",
    "name": "后端开发",
    "description": "后端相关技术文章",
    "createTime": "2025-03-05 14:30:38"
  },
  {
    "id": "3",
    "name": "运维部署",
    "description": "运维和部署相关文章",
    "createTime": "2025-03-07 16:15:23"
  }
]

// 分页查询
Mock.mock(/\/api\/categories/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page')) || 1
  const limit = parseInt(params.get('limit')) || 10
  const name = params.get('searchName') || ''

  let filteredCategories = categories
  if (name) {
    filteredCategories = categories.filter(category => category.name.includes(name))
  }

  const start = (page - 1) * limit
  const end = page * limit

  return {
    code: 200,
    data: filteredCategories.slice(start, end),
    total: filteredCategories.length
  }
})

// 添加分类
Mock.mock(/\/api\/categories/, 'post', (options) => {
  const { name, description } = JSON.parse(options.body)

   // 生成格式为 "YYYY-MM-DD HH:mm:ss" 的时间字符串
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const createTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

  const newCategory = {
    id: String(categories.length + 1),
    name,
    description,
    createTime
  }
  categories.push(newCategory)
  return {
    code: 200,
    data: newCategory,
    message: '分类添加成功'
  }
})

// 修改分类
Mock.mock(/\/api\/categories\/(\d+)/, 'put', (options) => {
  const id = options.url.match(/\/api\/categories\/(\d+)/)[1]
  const { name, description } = JSON.parse(options.body)
  const index = categories.findIndex(category => category.id === id)

  if (index !== -1) {
    categories[index] = { ...categories[index], name, description }
    return {
      code: 200,
      data: categories[index],
      message: '分类更新成功'
    }
  }
  return {
    code: 404,
    message: '分类未找到'
  }
})

// 删除分类
Mock.mock(/\/api\/categories\/(\d+)/, 'delete', (options) => {
  const id = options.url.match(/\/api\/categories\/(\d+)/)[1]
  const index = categories.findIndex(category => category.id === id)

  if (index !== -1) {
    categories.splice(index, 1)
    return {
      code: 200,
      message: '分类删除成功'
    }
  }
  return {
    code: 404,
    message: '分类未找到'
  }
})
