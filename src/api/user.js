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

export function getUsersAdmin () {
  return request({
    url: '/api/admin/users/',
    method: 'get'
  })
}

export function updateUserAdmin (data) {
  return request({
    url: '/api/admin/users/' + data.id + '/',
    method: 'put',
    data
  })
}

export function getUserPricesAdmin () {
  return request({
    url: '/api/admin/users/prices/',
    method: 'get'
  })
}

export function updateUserPricesAdmin (user_id, price_type, data) {
  return request({
    url: '/api/admin/users/' + user_id + '/price/' + price_type,
    method: 'post',
    data
  })
}
