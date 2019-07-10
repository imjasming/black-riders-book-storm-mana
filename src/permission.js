import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import store from './store'
import {getToken} from "@/utils/auth";
import {Message} from "element-ui";

import {adminMap, storeMap} from "@/config/routerMap";

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({path: '/'})
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      const _store = store
      if (!_store.getters.roles || _store.getters.roles.length === 0 || ~_store.getters.userInfo || _store.getters.userInfo.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          if (!_store.getters.router) {
            if (_store.getters.roles[0].code === 'admin') {
              store.dispatch('setRouter', adminMap)
            }
            if (_store.getters.roles[0].code === 'store') {
              store.dispatch('setRouter', storeMap)
            }
          }
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({path: '/'})
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
  next()
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
