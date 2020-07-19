import '../styles/main.scss'

import 'bootstrap/js/src/collapse'
import 'bootstrap/js/src/dropdown'
import 'bootstrap/js/src/modal'

import {
  NavbarPlugin,
  LinkPlugin,
  ButtonPlugin,
  InputGroupPlugin,
  FormGroupPlugin,
  FormInputPlugin,
  FormCheckboxPlugin,
  DropdownPlugin,
  ModalPlugin
} from 'bootstrap-vue'
import Vue from 'vue'

Vue.use(NavbarPlugin)
Vue.use(LinkPlugin)
Vue.use(ButtonPlugin)
Vue.use(InputGroupPlugin)
Vue.use(FormGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(FormCheckboxPlugin)
Vue.use(DropdownPlugin)
Vue.use(ModalPlugin)
