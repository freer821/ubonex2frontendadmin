import request from './request'
import store from '@/store'

const login_info = store.getters.login_info

export function package_scan (input) {
  const data = Object.assign(input, login_info)
  data.action = 'parckage_scan'
  return request({
    url: '/packhouse_action',
    method: 'post',
    data
  })
}

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
