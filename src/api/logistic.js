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

export function createLogistic (data) {
  return request({
    url: '/api/admin/logistic/',
    method: 'POST',
    data
  })
}

export function updateLogistic (data) {
  return request({
    url: '/api/admin/logistic/' + data.id + '/',
    method: 'PUT',
    data
  })
}

export function getLogisticApis () {
  return request({
    url: '/api/admin/logisticapis/',
    method: 'get'
  })
}

export function updateLogisticApis (data) {
  return request({
    url: '/api/admin/logisticapis/' + data.id + '/',
    method: 'PUT',
    data
  })
}
