import Vue from 'vue'
import App from './App.vue'

// Boostrap style
import 'bootstrap/dist/css/bootstrap.css'
// Bootstrap function
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Font Awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faPlay, faSave, faCog, faEllipsisH, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import store from './store'

library.add(faTrashAlt, faPlay, faSave, faCog, faEllipsisH, faPencilAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  data: store,
  render: h => h(App)
}).$mount('#app')
