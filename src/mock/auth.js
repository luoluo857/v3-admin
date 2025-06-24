// import Mock from 'mockjs'
// import roles from './role'

// // 登录接口（POST /api/login）
// Mock.mock(/api\/login/,  'post', (options) => {
//   const { username } = JSON.parse(options.body)
//   const userInfo = roles.find(role => role.name === username)
//   return {
//     code: 200,
//     token: Mock.Random.guid(),
//     userInfo: userInfo,
//     message: '登录成功'
//   }
// })
