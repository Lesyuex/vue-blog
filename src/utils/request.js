import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API === 'production' ? '/blog' : '/api', // api base_url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      //判断是否需要刷新Token
      config.headers['BLOG-TOKEN'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(response => {
    // 判断Token是否已经刷新
    const headers = response.headers
    if (headers && headers['refresh-blog-token'] && headers['refresh-blog-token'] !== '') {
      store.dispatch('user/refreshToken', headers['refresh-blog-token']).then(() => {
        console.log('Token已经刷新')
      })
    }
    const res = response.data
    // if the custom code is not 200, it is judged as an error.
    if (res.code === 504) {
      MessageBox.confirm('你的登录已失效，请重新登录', '重新登录', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      res.type = res.code === 200 ? 'success' : 'error'
      return res
    }
  }, error => {
    console.log('err' + error) // for debug
    Message({
      message: '请求服务器出错啦...',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
