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

export function listCurrentUserMenu() {
  return request({
    url: '/permission/listCurrentUserMenu',
    method: 'get'
  })
}

export function listUserByPage(params) {
  return request({
    url: '/user/listByPage',
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
