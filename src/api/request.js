import axios from 'axios'
// import { Loading } from 'element-ui'
// import { ElLoading } from 'element-plus'
let url = 'http://localhost:5173'
// if (process.env.VUE_APP_URL == 'production') {
//   url = process.env.VITE_API_URL
// } else {
//   url = process.env.VITE_API_URL
// }

// 创建一个取消令牌管理器
let cancelTokenSource = axios.CancelToken.source()

const service = axios.create({
  baseURL: url,
  timeout: 10000
})
// let loading
//请求拦截器，前端给后端发起请求，一般携带token
service.interceptors.request.use(
  (config) => {

     // 每次请求前都会重新创建一个取消令牌
    cancelTokenSource = axios.CancelToken.source()

    // 为请求配置添加取消令牌
    config.cancelToken = cancelTokenSource.token
    //添加请求头
    config.headers = {
      'Content-Type': 'application/json'
    }

    // if (config.showLoading) {
    //   //   loading = Loading.service({
    //   //     lock: true,
    //   //     text: config.loadingText || '加载中',
    //   //     spinner: 'el-icon-loading',
    //   //     background: 'rgba(0, 0, 0, 0.7)'
    //   //   })
    //   loading = ElLoading.service({
    //     lock: true,
    //     text: 'Loading',
    //     background: 'rgba(0, 0, 0, 0.7)'
    //   })
    // }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)
//响应拦截器，后端返回给前端数据
service.interceptors.response.use(
  (response) => {
    return response
    // if (response.status === 200 || response.status === 201) {
    //   loading.close()
    //   return response
    // } else {
    //   return Promise.reject(new Error(response.msg))
    // }
  },
  (error) => {
    return Promise.reject(new Error(error.response))
  }
)

// 取消请求函数
export const cancelRequest = () => {
  cancelTokenSource.cancel('请求取消')
}

export default service
