import {getInfo, login, logout} from '@/api/login'
import {getToken, removeToken, setToken} from '@/utils/auth'
import {clearStore, getStore, setStore} from "@/utils/localStorage";
import request from '@/utils/request'

const user = {
  state: {
    token: getToken(),
    name: getStore('username'),
    userInfo: getStore('userInfo'),
    avatar: '',
    roles: getStore('roles'),
  },

  mutations: {
    SET_INFO: (state, info) => {
      state.userInfo = info
      setStore('userInfo', info)
      state.username = state.userInfo.username
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
      setStore('username', name)
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      setStore('roles', roles)
    }
  },

  actions: {
    getUserRoles({commit}, username) {
      return new Promise((resolve, reject) => {
        request.get(`/user/role?username=${username}`).then(response => {
          commit('SET_ROLES', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    setUserInfo({commit}, info) {
      commit('SET_INFO', info)
    },
    initUserData({commit, state}) {
      return new Promise((resolve, reject) => {
        const username = state.username
        request.get(`/user/info?username=${username}`).then(data => {
          commit('SET_INFO', data.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登录
    Login({commit}, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          const tokenStr = data.tokenHead + data.token
          setToken(tokenStr)
          commit('SET_TOKEN', tokenStr)
          commit('SET_NAME', username)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({commit, state}) {
      return new Promise((resolve, reject) => {
        getInfo(state.name).then(response => {
          const data = response.data
          if (data.roleList && data.roleList.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roleList)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.username)
          commit('SET_INFO', data)
          //commit('SET_AVATAR', data.icon)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        clearStore()
        resolve()
      })
    }
  }
}

export default user
