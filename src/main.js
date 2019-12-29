import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import '@/assets/styles/element-variables.scss'

import store from './store'
import router from './router'

import '@/assets/styles/index.scss' // global css
import '@/assets/icons' // icon

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
