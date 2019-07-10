export const baseMap = [
  {path: '/login', hidden: true},
  {path: '/404', hidden: true},
  {path: '*', redirect: '/404', hidden: true}
]

export const storeMap = [
  {path: '/login', hidden: true},
  {path: '/404', hidden: true},
  {path: '*', redirect: '/404', hidden: true},
  {
    path: '',
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      meta: {title: '首页', icon: 'home'}
    }]
  },
  {
    path: '/oms',
    redirect: '/oms/order',
    name: 'oms',
    meta: {title: '订单', icon: 'order'},
    children: [
      {
        path: 'order',
        name: 'order',
        meta: {title: '订单列表', icon: 'product-list'}
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        meta: {title: '订单详情'},
        hidden: true
      },
    ]
  },
  {
    path: '/pms',
    redirect: '/pms/product',
    name: 'pms',
    meta: {title: '商品', icon: 'product'},
    children: [{
      path: 'product',
      name: 'product',
      meta: {title: '商品列表', icon: 'product-list'}
    },
      {
        path: 'addProduct',
        name: 'addProduct',
        meta: {title: '添加商品', icon: 'product-add'}
      },
    ]
  }
]

export const adminMap = [
  {path: '/login', hidden: true},
  {path: '/404', hidden: true},
  {path: '*', redirect: '/404', hidden: true},
  {
    path: '',
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      meta: {title: '首页', icon: 'home'}
    }]
  },
  {
    path: '/oms',
    redirect: '/oms/order',
    name: 'oms',
    meta: {title: '订单', icon: 'order'},
    children: [
      {
        path: 'order',
        name: 'order',
        meta: {title: '订单列表', icon: 'product-list'}
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        meta: {title: '订单详情'},
        hidden: true
      },
    ]
  },
  {
    path: '/pms',
    redirect: '/pms/product',
    name: 'pms',
    meta: {title: '商品', icon: 'product'},
    children: [{
      path: 'product',
      name: 'product',
      meta: {title: '商品列表', icon: 'product-list'}
    },
      {
        path: 'addProduct',
        name: 'addProduct',
        meta: {title: '添加商品', icon: 'product-add'}
      },
    ]
  }
]
