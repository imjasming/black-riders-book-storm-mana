import request from '@/utils/request'
import {getStore, setStore} from "@/utils/localStorage";

const shop = {
  state: {
    storeInfo: getStore('store'),
    orderList: getStore('orderList'),
    deliveryOrder: getStore('deliveryOrder')
  },
  mutations: {
    SET_STORE_INFO: (state, info) => {
      state.storeInfo = info
      setStore('store', info)
    },
    SET_ORDER_LIST: (state, list) => {
      state.orderList = list
      setStore('orderList', list)
    },
    SET_DELIVERY_ORDER: (state, order) => {
      state.deliveryOrder = order
      setStore('deliveryOrder', order)
    },
  },
  actions: {
    setdeliveryOrder({commit}, list) {
      return new Promise((resolve, reject) => {
        commit('SET_DELIVERY_ORDER', list)
        resolve()
      })
    },
    setOrders({commit}, list) {
      return new Promise((resolve, reject) => {
        commit('SET_ORDER_LIST', list)
        resolve()
      })
    },
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
