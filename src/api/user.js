import request from './request'

export function login (data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

export function logout () {
  return request({
    url: '/api/logout',
    method: 'get'
  })
}

export function getUserInfo () {
  return request({
    url: '/api/user/profile',
    method: 'get'
  })
}

export function getUserCount () {
  return request({
    url: '/api/admin/users/count/?is_active=True',
    method: 'get'
  })
}
