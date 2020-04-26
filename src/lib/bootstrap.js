import '../styles/main.scss'

import 'bootstrap/js/src/collapse'
import 'bootstrap/js/src/dropdown'
import 'bootstrap/js/src/modal'

import {
  ButtonPlugin,
  InputGroupPlugin,
  FormInputPlugin,
  FormCheckboxPlugin,
  DropdownPlugin,
  ModalPlugin
} from 'bootstrap-vue'
import Vue from 'vue'

Vue.use(ButtonPlugin)
Vue.use(InputGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(FormCheckboxPlugin)
Vue.use(DropdownPlugin)
Vue.use(ModalPlugin)
