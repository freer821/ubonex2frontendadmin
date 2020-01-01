import request from './request'

export function get_pici_info () {
  return request({
    url: '/api/admin/packages/list_pici_codes/',
    method: 'get'
  })
}

export function get_main_plate_info () {
  return request({
    url: '/api/admin/packages/list_main_plate_codes/',
    method: 'get'
  })
}

export function packhouse_action (data) {
  return request({
    url: '/api/admin/packhouse_action',
    method: 'post',
    data
  })
}
