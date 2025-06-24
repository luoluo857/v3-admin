import Mock from 'mockjs'

let serviceConfigs = [
  {
    id: '1',
    serviceType: '支付服务',
    selectedProviders: ['微信支付', '支付宝支付'],
    merchantId: ['wxid_1234567890', 'zyfid_0987654321'],
    secretKey: ['wxkey_0987654321', 'zyfkey_1234567890'],
    createTime: '2024-01-01 09:00:00'
  },
  {
    id: '2',
    serviceType: '短信服务',
    selectedProvider: '阿里云短信',
    apiKey: 'aliyun_sdk_key_12345',
    apiSignature: 'aliyun_sdk_sign_67890',
    createTime: '2024-01-01 09:00:00'
  },
  {
    id: '3',
    serviceType: '地图服务',
    selectedProvider: '高德地图',
    apiKey: 'amap_api_key_13579',
    createTime: '2024-01-01 09:00:00'
  },
  {
    id: '4',
    serviceType: '第三方登录',
    selectedProviders: ['QQ登录', '微信登录'],
    appId: ['qq_appid_123456', 'wx_appid_654321'],
    appSecret: ['qq_secret_abcdef', 'wx_secret_fedcba'],
    createTime: '2024-01-01 09:00:00'
  }
]

// 获取配置列表
Mock.mock(/\/api\/service-config\/list/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const page = parseInt(params.get('page')) || 1
  const limit = parseInt(params.get('limit')) || 10
  // const serviceType = params.get('serviceType') || ''

  let filteredData = serviceConfigs
  // if (serviceType) {
  //   filteredData = serviceConfigs.filter(config =>
  //     config.serviceType.includes(serviceType)
  //   )
  // }

  const start = (page - 1) * limit
  const end = page * limit

  return {
    code: 200,
    data: filteredData.slice(start, end),
    total: filteredData.length
  }
})

// 获取配置详情
// Mock.mock(/\/api\/service-config\/\d+$/, 'get', (options) => {
//   const id = options.url.match(/\/api\/service-config\/(\d+)/)[1]
//   const config = serviceConfigs.find(item => item.id === id)

//   return config ?
//     { code: 200, data: config } :
//     { code: 404, message: '配置不存在' }
// })

// 新增配置
Mock.mock(/\/api\/service-config/, 'post', (options) => {
  const newConfig = JSON.parse(options.body)
  const id = String(serviceConfigs.length + 1)

  const config = {
    ...newConfig,
    id,
    createTime: Mock.Random.datetime()
  }

  serviceConfigs.push(config)
  return {
    code: 200,
    data: config,
    message: '新增配置成功'
  }
})

// 更新配置
Mock.mock(/\/api\/service-config\/\d+/, 'put', (options) => {
  const updateData = JSON.parse(options.body)
  const id = options.url.match(/\/api\/service-config\/(\d+)/)[1]
  const index = serviceConfigs.findIndex(item => item.id === id)

  if (index !== -1) {
    serviceConfigs[index] = {
      ...serviceConfigs[index],
      ...updateData
    }
    return {
      code: 200,
      data: serviceConfigs[index],
      message: '更新配置成功'
    }
  }
  return { code: 404, message: '配置不存在' }
})

// 删除配置
Mock.mock(/\/api\/service-config\/\d+/, 'delete', (options) => {
  const id = options.url.match(/\/api\/service-config\/(\d+)/)[1]
  serviceConfigs = serviceConfigs.filter(item => item.id !== id)
  return { code: 200, message: '删除配置成功' }
})

// 获取服务类型枚举
Mock.mock(/\/api\/service-config\/service-types/, 'get', () => {
  const types = ['支付服务', '短信服务', '地图服务', '第三方登录']
  return { code: 200, data: types }
})
