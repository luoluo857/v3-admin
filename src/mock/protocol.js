import Mock from 'mockjs'

let protocols = [
  {
    id: '1',
    categoryId: '1',
    content:
      '本协议是用户与平台之间的法律协议，规定了用户使用平台服务时的权利和义务。用户在使用平台服务前，应仔细阅读并同意本协议的全部内容。本协议包含但不限于用户注册、账号安全、隐私保护、内容规范等重要条款。',
    status: 1,
    createTime: '2024-01-01 12:00:00'
  },
  {
    id: '2',
    categoryId: '2',
    content:
      '本服务条款详细说明了平台提供的各项服务内容、使用规则和限制条件。包括但不限于服务范围、服务质量、服务时间、服务费用等方面的约定。用户在使用平台服务时应当遵守这些规定。',
    status: 1,
    createTime: '2024-01-02 14:30:00'
  },
  {
    id: '3',
    categoryId: '3',
    content:
      '本隐私政策说明了平台如何收集、使用、存储和保护用户的个人信息。我们承诺对用户的个人信息进行严格保密，并采取适当的技术措施确保信息安全。未经用户同意，我们不会向第三方披露用户的个人信息。',
    status: 1,
    createTime: '2024-01-03 16:45:00'
  },
  {
    id: '4',
    categoryId: '5',
    content:
      '本免责声明明确了平台在提供服务过程中的责任范围和限制。对于因不可抗力、第三方原因或用户自身原因导致的损失，平台不承担责任。用户应理解并接受使用服务可能带来的风险。',
    status: 1,
    createTime: '2024-01-04 09:15:00'
  },
  {
    id: '5',
    categoryId: '6',
    content:
      '本规定保护平台及其用户的知识产权权益。平台上的所有内容，包括但不限于文字、图片、音频、视频等，均受著作权法和其他知识产权法律法规的保护。未经权利人许可，任何人不得擅自使用。',
    status: 1,
    createTime: '2024-01-05 11:20:00'
  }
]

// 获取协议列表
Mock.mock(/\/api\/protocol\/list/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page')) || 1
  const limit = parseInt(params.get('limit')) || 10
  const content = params.get('searchName') || ''
  const categoryId = params.get('categoryId') || ''

  let filteredProtocols = protocols
  if (content) {
    filteredProtocols = filteredProtocols.filter((protocol) =>
      protocol.content.toLowerCase().includes(content.toLowerCase())
    )
  }
  if (categoryId) {
    filteredProtocols = filteredProtocols.filter((protocol) =>
      protocol.categoryId === categoryId
    )
  }

  const start = (page - 1) * limit
  const end = page * limit

  return {
    code: 200,
    data: filteredProtocols.slice(start, end),
    total: filteredProtocols.length
  }
})

// 获取协议详情
Mock.mock(/\/api\/protocol\/\d+$/, 'get', (options) => {
  const id = options.url.match(/\/api\/protocol\/(\d+)/)[1]
  const protocol = protocols.find((item) => item.id === id)

  if (protocol) {
    return {
      code: 200,
      data: protocol
    }
  }
  return {
    code: 404,
    message: '协议不存在'
  }
})

// 新增协议
Mock.mock(/\/api\/protocol/, 'post', (options) => {
  const newProtocol = JSON.parse(options.body)
  const id = String(protocols.length + 1)

   // 生成格式为 "YYYY-MM-DD HH:mm:ss" 的时间字符串
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const createTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

  const protocol = {
    ...newProtocol,
    id,
    createTime
  }
  protocols.push(protocol)
  return {
    code: 200,
    data: protocol,
    message: '新增协议成功'
  }
})

// 更新协议
Mock.mock(/\/api\/protocol\/\d+/, 'put', (options) => {
  const updateData = JSON.parse(options.body)
  const id = options.url.match(/\/api\/protocol\/(\d+)/)[1]
  const index = protocols.findIndex((item) => item.id === id)

  if (index !== -1) {
    protocols[index] = { ...protocols[index], ...updateData }
    return {
      code: 200,
      data: protocols[index],
      message: '更新协议成功'
    }
  }
  return {
    code: 404,
    message: '协议不存在'
  }
})

// 删除协议
Mock.mock(/\/api\/protocol\/\d+/, 'delete', (options) => {
  const id = options.url.match(/\/api\/protocol\/(\d+)/)[1]
  const index = protocols.findIndex((item) => item.id === id)

  if (index !== -1) {
    protocols.splice(index, 1)
    return {
      code: 200,
      message: '删除协议成功'
    }
  }
  return {
    code: 404,
    message: '协议不存在'
  }
})
