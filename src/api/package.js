import request from './request'

export function getPackageStatus (data) {
  return request({
    url: '/api/packagestatus',
    method: 'get'
  })
}
