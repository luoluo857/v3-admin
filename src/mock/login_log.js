import Mock from 'mockjs'

const loginLogs = [
  {
    id: 1,
    username: 'admin',
    loginTime: '2024-01-10 10:30:25',
    ip: '192.168.1.100',
    status: 1,
    browser: 'Chrome 120.0.0',
    os: 'Windows 10'
  },
  {
    id: 2,
    username: 'test01',
    loginTime: '2024-01-10 09:15:18',
    ip: '192.168.1.101',
    status: 1,
    browser: 'Firefox 121.0',
    os: 'macOS 14.0'
  },
  {
    id: 3,
    username: 'editor',
    loginTime: '2024-01-09 16:45:30',
    ip: '192.168.1.102',
    status: 0,
    browser: 'Safari 17.0',
    os: 'iOS 17'
  },
  {
    id: 4,
    username: 'guest',
    loginTime: '2024-01-09 14:20:12',
    ip: '192.168.1.103',
    status: 1,
    browser: 'Edge 120.0.0',
    os: 'Windows 11'
  },
  {
    id: 5,
    username: 'test02',
    loginTime: '2024-01-09 11:05:45',
    ip: '192.168.1.104',
    status: 0,
    browser: 'Chrome 120.0.0',
    os: 'Ubuntu 22.04'
  }
]

Mock.mock(/\/api\/log\/login/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page')) || 1
  const limit = parseInt(params.get('limit')) || 10
  const username = params.get('searchName') || ''
  // 根据用户名筛选数据
  let filteredloginLogs = loginLogs
  if (username) {
    filteredloginLogs = loginLogs.filter(log => log.username.includes(username));
  }
  const start = (page - 1) * limit
  const end = page * limit

  return {
    code: 200,
    msg: 'success',
    total: filteredloginLogs.length,
    data: filteredloginLogs.slice(start, end)
  }
})
