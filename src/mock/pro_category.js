import Mock from 'mockjs'

let categories = [
  {
    id: '1',
    name: '用户协议',
    description: '定义用户使用服务的条款和条件',
    status: 1,
    createTime: '2024-01-01 12:00:00'
  },
  {
    id: '2',
    name: '服务协议',
    description: '详细说明服务的内容、范围和限制',
    status: 1,
    createTime: '2024-01-01 12:00:00'
  },
  {
    id: '3',
    name: '隐私政策',
    description: '描述如何收集、使用和保护用户个人信息',
    status: 1,
    createTime: '2024-01-01 12:00:00'
  },
  {
    id: '4',
    name: '使用条款',
    description: '规定用户使用服务的具体规则',
    status: 1,
    createTime: '2024-01-01 12:00:00'
  },
  {
    id: '5',
    name: '免责声明',
    description: '明确服务提供者的责任限制',
    status: 1,
    createTime: '2024-01-01 12:00:00'
  },
  {
    id: '6',
    name: '知识产权声明',
    description: '保护服务中的知识产权',
    status: 1,
    createTime: '2024-01-01 12:00:00'
  },
  {
    id: '7',
    name: '饼干政策',
    description: '解释如何使用Cookies和其他跟踪技术',
    status: 1,
    createTime: '2024-01-01 12:00:00'
  },
  {
    id: '8',
    name: '儿童隐私保护政策',
    description: '专门针对儿童用户的隐私保护',
    status: 1,
    createTime: '2024-01-01 12:00:00'
  },
  {
    id: '9',
    name: '社区指南',
    description: '规范用户在社区中的行为',
    status: 1,
    createTime: '2024-01-01 12:00:00'
  }
]

// 获取协议分类列表
Mock.mock(/\/api\/pro-categories/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page')) || 1
  const limit = parseInt(params.get('limit')) || 10
  const name = params.get('searchName') || ''

  let filteredCategories = categories
  if (name) {
    filteredCategories = categories.filter(category =>
      category.name.toLowerCase().includes(name.toLowerCase())
    )
  }

  const start = (page - 1) * limit
  const end = page * limit

  return {
    code: 200,
    data: filteredCategories.slice(start, end),
    total: filteredCategories.length
  }
})

// 新增协议分类
Mock.mock(/\/api\/pro-categories/, 'post', (options) => {
  const newCategory = JSON.parse(options.body)
  const id = String(categories.length + 1)

   // 生成格式为 "YYYY-MM-DD HH:mm:ss" 的时间字符串
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const createTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

  const category = {
    ...newCategory,
    id,
    createTime
  }
  categories.push(category)
  return {
    code: 200,
    data: category,
    message: '新增协议分类成功'
  }
})

// 更新协议分类
Mock.mock(/\/api\/pro-categories\/\d+/, 'put', (options) => {
  const updateData = JSON.parse(options.body)
  const index = categories.findIndex(item => item.id === updateData.id)
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updateData }
    return {
      code: 200,
      data: categories[index],
      message: '更新协议分类成功'
    }
  }
  return {
    code: 404,
    message: '协议分类不存在'
  }
})

// 删除协议分类
Mock.mock(/\/api\/pro-categories\/\d+/, 'delete', (options) => {
  const id = options.url.match(/\/api\/pro-categories\/(\d+)/)[1]
  const index = categories.findIndex(item => item.id === id)
  if (index !== -1) {
    categories.splice(index, 1)
    return {
      code: 200,
      message: '删除协议分类成功'
    }
  }
  return {
    code: 404,
    message: '协议分类不存在'
  }
})
