import { getUserInfo, login, logout } from '@/api/user'
import {
  getToken,
  removeToken,
  setToken
} from '@/utils/cookies'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  username: '',
  profile: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_NAME: (state, username) => {
    state.username = username
  },
  SET_PROFILE: (state, profile) => {
    state.profile = profile
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }

}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then(response => {
          let data = response.data
          if (data.user.is_superuser) {
            commit('SET_ROLES', ['admin'])
          } else {
            commit('SET_ROLES', ['admin'])
          }
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          commit('SET_USER_NAME', data.user.username)
          commit('SET_PROFILE', data.user.profile)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getUserInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo()
        .then(response => {
          let data = response.data
          console.log(data)

          if (!data) {
            reject('Error to get user info.')
          }

          commit('SET_USER_NAME', data.username)
          commit('SET_PROFILE', data.profile)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout ({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(response => {
        try {
          console.log('logout')
          commit('SET_TOKEN', '')
          commit('SET_USER_NAME', '')
          commit('SET_PROFILE', '')
          removeToken()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        } catch (e) {
          reject(e)
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
