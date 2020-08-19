import request from '@/utils/request'

export function login(parameter) {
  return request({
    url: '/sys/login',
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function listCurrentUserRoutes() {
  return request({
    url: '/permission/listCurrentUserRoutes',
    method: 'get'
  })
}

export function list(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}


export function deleteUserByUserId(params) {
  return request({
    url: '/user/delete/' + params['id'],
    method: 'delete'
  })
}

export function updateUserByUser(params) {
  return request({
    url: '/user/update',
    method: 'put',
    data: params
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {

}
