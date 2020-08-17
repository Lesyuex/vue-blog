import request from '@/utils/request'

export function list (parameter) {
  return request({
    url: '/permission/list',
    method: 'get',
    params: parameter,
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
