import Mock from 'mockjs'
const roles = [
  {
    id: '1',
    name: 'admin',
    label: '超级管理员',
    description: '拥有系统全部权限',
    menuId: ['*'],
    permission: ['*']
  },
  {
    id: '2',
    name: 'editor',
    label: '部门管理员',
    description: '用户与角色管理权限',
    menuId: ['100', '1', '14', '23', '32'], // 调整为具体的菜单ID
    permission: [
      'user:add',
      'user:edit',
      'user:remove',
      'role:add',
      'role:edit',
      'menu:add',
      'menu:edit',
      'article:add',
      'article:edit',
      'article:remove',
      'category:add',
      'category:edit',
      'category:remove',
      'usera:add',
      'usera:edit',
      'usera:remove',
      'privacy:add',
      'privacy:edit',
      'privacy:remove'
    ]
  },
  {
    id: '3',
    name: 'user',
    label: '普通员工',
    description: '基础操作权限',
    menuId: ['100', '14'], // 调整为具体的菜单ID
    permission: [
      'article:add',
      'article:edit',
      'article:remove',
      'category:add',
      'category:edit',
      'category:remove'
    ]
  }
]

// 登录接口（POST /api/login）
Mock.mock(/api\/login/,  'post', (options) => {
  const { username } = JSON.parse(options.body)
  const userRole = roles.find(role => role.name === username) || roles[2]
  return {
    code: 200,
    token: Mock.Random.guid(),
    userInfo: userRole,
    message: '登录成功'
  }
})

// 分页查询
Mock.mock(/\/api\/roles/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page')) || 1
  const limit = parseInt(params.get('limit')) || 10

  const label = params.get('searchName') || '';
  // 根据用户名筛选数据
  let filteredRoles = roles;
  if (label) {
    filteredRoles = roles.filter(role => role.label.includes(label));
  }
  const start = (page - 1) * limit
  const end = page * limit
  return {
    code: 200,
    data: filteredRoles.slice(start, end),
    total: filteredRoles.length
  }
})

// 添加角色
Mock.mock(/\/api\/roles\/add/, 'post', (options) => {
  const { label, name, description, menuId, permission } = JSON.parse(
    options.body
  )
  roles.push({
    id: String(roles.length + 1), // 自动生成ID
    label,
    name,
    description,
    menuId,
    permission
  })
  return {
    code: 200,
    message: '角色添加成功'
  }
})

// 修改角色接口（修正数据更新逻辑）
Mock.mock(/\/api\/roles\/edit/, 'put', (options) => {
  const newData = JSON.parse(options.body)
  const index = roles.findIndex((role) => role.id === newData.id)
  if (index !== -1) {
    roles[index] = {
      ...roles[index],
      label: newData.label,
      description: newData.description,
      menuId: Array.isArray(newData.menuId) ? newData.menuId : [newData.menuId],
      permission: newData.permission
    }
    return {
      code: 200,
      message: '角色信息更新成功'
    }
  }
  return { code: 404, message: '角色未找到' }
})

// 删除角色
Mock.mock(/\/api\/roles\/(\d+)/, 'delete', (options) => {
  // const { roleId } = JSON.parse(options.body)
  const id = options.url.match(/\/api\/roles\/(\d+)/)[1]
  const index = roles.findIndex((role) => role.id === id)
  if (index !== -1) {
    roles.splice(index, 1) // 删除对应的角色
    return {
      code: 200,
      message: '角色删除成功'
    }
  }
  return {
    code: 404,
    message: '角色未找到'
  }
})
