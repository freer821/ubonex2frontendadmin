import request from './request'

export function getLogistics () {
  return request({
    url: '/api/admin/logistic/',
    method: 'get'
  })
}
