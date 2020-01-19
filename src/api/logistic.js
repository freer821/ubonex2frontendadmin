import request from './request'

export function getLogistics () {
  return request({
    url: '/api/admin/logistic/',
    method: 'get'
  })
}

export function delLogistic (id) {
  return request({
    url: '/api/admin/logistic/' + id + '/',
    method: 'DELETE'
  })
}
