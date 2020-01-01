const state = {
  scan_type: 'manual',
  scan_main_plate_code: '',
  scan_successed: 0,
  scan_failed: 0
}

const mutations = {
  SET_SCANTYPE: (state, scantype) => {
    state.scan_type = scantype
  },
  SET_SCANMAINPLATE_CODE: (state, scan_main_plate_code) => {
    state.scan_main_plate_code = scan_main_plate_code
  },
  SET_SCANSUCCESSED: (state, scan_successed) => {
    state.scan_successed = scan_successed
  },
  SET_SCANFAILED: (state, scan_failed) => {
    state.scan_failed = scan_failed
  }
}

const actions = {
  setScantype ({ commit }, scantype) {
    commit('SET_SCANTYPE', scantype)
  },
  setScanSuccessed ({ commit }, scan_successed) {
    commit('SET_SCANSUCCESSED', scan_successed)
  },
  setScanFailed ({ commit }, scan_failed) {
    commit('SET_SCANFAILED', scan_failed)
  },
  setScanMainPlateCode ({ commit }, scan_main_plate_code) {
    commit('SET_SCANMAINPLATE_CODE', scan_main_plate_code)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
