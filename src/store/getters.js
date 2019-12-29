const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  profile: state => state.user.profile,
  roles: state => state.user.roles,
  name: state => state.user.username,
  errorLog: state => state.errorLog.logs,
  permission_routes: state => state.permission.permission_routes
}
export default getters
