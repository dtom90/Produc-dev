import Vue from 'vue'
import App from './components/App.vue'

// Vuex store
import store from './store'

// Bootstrap
import './lib/bootstrap'

// Font Awesome Icons
import { FontAwesomeIcon } from './lib/font-awesome-icons'
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  store,
  mounted () {
    this.$store.commit('upgradeTagColor')
  },
  render: h => h(App)
}).$mount('#app')
