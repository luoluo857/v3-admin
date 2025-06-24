import { Avatar } from '@element-plus/icons-vue'
import Mock from 'mockjs'
const users = [
  {
    id: '1',
    username: '大神',
    mobile: '12345678901',
    email: '12345678901@qq.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: ['admin'],
    status: 1,
    createTime: '2025-03-01 09:00:27'
  },
  {
    id: '2',
    username: '大师',
    mobile: '12345678901',
    email: '12345678901@qq.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: ['editor'],
    status: 1,
    createTime: '2025-03-05 14:30:38'
  },
  {
    id: '3',
    username: '游客',
    mobile: '12345678901',
    email: '12345678901@qq.com',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: ['user'],
    status: 1,
    createTime: '2025-03-07 16:15:23'
  }
]
//分页查询
Mock.mock(/\/api\/users/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page')) || 1
  const limit = parseInt(params.get('limit')) || 10
  const username = params.get('searchName') || ''
  // 根据用户名筛选数据
  let filteredUsers = users
  if (username) {
    filteredUsers = users.filter((user) => user.username.includes(username))
  }
  const start = (page - 1) * limit
  const end = page * limit
  return {
    code: 200,
    data: filteredUsers.slice(start, end),
    total: filteredUsers.length
  }
})

// 添加用户
Mock.mock(/\/api\/users/, 'post', (options) => {
  const { username, mobile, email, avatar, role = [], status } = JSON.parse(options.body)
  users.push({
    id: String(users.length + 1), // 自动生成ID
    username,
    mobile,
    email,
    avatar,
    role,
    status,
    createTime: new Date().toLocaleString()
  })
  return {
    code: 200,
    data: users,
    message: '用户添加成功'
  }
})

// 修改用户
Mock.mock(/\/api\/users\/(\d+)/, 'put', (options) => {
  const id = options.url.match(/\/api\/users\/(\d+)/)[1]
  const { username, mobile, email, avatar, role, status } = JSON.parse(options.body)
  const index = users.findIndex((user) => user.id === id)
  if (index !== -1) {
    users[index] = { ...users[index], username, mobile, email, avatar, role, status }
    return {
      code: 200,
      message: '用户信息更新成功'
    }
  }
  return {
    code: 404,
    message: '用户未找到'
  }
})

// 删除用户
Mock.mock(/\/api\/users\/(\d+)/, 'delete', (options) => {
  const id = options.url.match(/\/api\/users\/(\d+)/)[1]
  const index = users.findIndex((user) => user.id === id)
  if (index !== -1) {
    users.splice(index, 1) // 删除对应的用户
    return {
      code: 200,
      message: '用户删除成功'
    }
  }
  return {
    code: 404,
    message: '用户未找到'
  }
})
