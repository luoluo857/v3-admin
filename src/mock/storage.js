import Mock from 'mockjs'

// 默认配置
const defaultConfig = {
  region: 'oss-cn-hangzhou',
  accessKeyId: 'LTAI5tBNc5XXXXXX',
  accessKeySecret: 'qTv4XXXXXX',
  bucket: 'my-bucket'
}

// 当前配置
let currentConfig = { ...defaultConfig }

// 获取存储配置
Mock.mock(/\/api\/storage\/config/, 'get', () => {
  return {
    code: 200,
    data: currentConfig
  }
})

// 保存存储配置
Mock.mock(/\/api\/storage\/config/, 'post', (options) => {
  const config = JSON.parse(options.body)
  currentConfig = { ...config }
  return {
    code: 200,
    message: '存储配置保存成功'
  }
})

// 重置存储配置
Mock.mock(/\/api\/storage\/config\/reset/, 'post', () => {
  currentConfig = { ...defaultConfig }
  return {
    code: 200,
    message: '存储配置已重置'
  }
})
