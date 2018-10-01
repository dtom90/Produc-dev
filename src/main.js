import Vue from 'vue'
import App from './App.vue'

// Boostrap style
import 'bootstrap/dist/css/bootstrap.css'

// Font Awesome icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faTrashAlt)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

const store = {
  tasks: [],
  addTask (newTaskName) {
    const newTask = {
      id: this.tasks.length,
      name: newTaskName,
      completed: false
    }
    this.tasks.push(newTask)
  },
  deleteTask (id) {
    const index = this.tasks.findIndex(t => t.id === id)
    const task = this.tasks[index];
    const result = confirm(`Are you sure you want to delete task ${task.name}? the task is not yet complete!`);
    if (result) {
      this.tasks.splice(index, 1);
    }
  }
}

new Vue({
  render: h => h(App),
  data: store
}).$mount('#app')
