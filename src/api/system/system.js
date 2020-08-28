import request from '@/utils/request'

export function listPermissionByPage (parameter) {
  return request({
    url: '/permission/list',
    method: 'get',
    params: parameter,
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function listRoleByPage (parameter) {
  return request({
    url: '/role/listByPage',
    method: 'get',
    params: parameter
  })
}
