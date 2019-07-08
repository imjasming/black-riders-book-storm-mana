import request from '@/utils/request'
import {getStore, setStore} from "@/utils/localStorage";

const shop = {
  state: {
    storeInfo: getStore('storeInfo'),
  },
  mutations: {
    SET_STORE_INFO: (state, info) => {
      state.storeInfo = info
      setStore('store', info)
    },

  },
  actions: {
    loadStoreInfo({commit}, username) {
      return new Promise((resolve, reject) => {
        request.get(`/store/info?username=${username}`).then(response => {
          commit('SET_STORE_INFO', response.data)
          resolve()
        }).catch(error => {
          reject(error.error)
        })
      })
    },

  }
}
export default shop
