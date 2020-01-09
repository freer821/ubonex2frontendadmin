import request from './request'

export function getPackageStatus () {
  return request({
    url: '/api/packagestatus',
    method: 'get'
  })
}

export function getPackagesInMainPlateCode (mainplatecode) {
  return request({
    url: '/api/admin/packages/mainplatecode/' + mainplatecode + '/',
    method: 'get'
  })
}

export function getPackagesInPiciCode (picicode) {
  return request({
    url: '/api/admin/packages/picicode/' + picicode + '/',
    method: 'get'
  })
}

export function getPackageCount (condition) {
  return request({
    url: '/api/admin/packages/statistics/' + condition + '/',
    method: 'get'
  })
}
