import Vue from 'vue'
import App from './components/App.vue'

// Vuex store
import store from './store'

// Bootstrap
import './styles/main.scss'

import 'bootstrap/js/src/collapse'
import 'bootstrap/js/src/dropdown'
import 'bootstrap/js/src/modal'

import { ButtonPlugin, InputGroupPlugin, FormInputPlugin, DropdownPlugin } from 'bootstrap-vue'

// Font Awesome Icons
import { FontAwesomeIcon } from './lib/font-awesome-icons'

// Install Components
Vue.use(ButtonPlugin)
Vue.use(InputGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(DropdownPlugin)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  store,
  mounted () {
    this.$store.commit('upgradeTagColor')
  },
  render: h => h(App)
}).$mount('#app')
