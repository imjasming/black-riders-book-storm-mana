const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  router: state => state.app.routers,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  storeInfo: state => state.shop.storeInfo,
  deliveryOrder: state => state.shop.deliveryOrder
}
export default getters
