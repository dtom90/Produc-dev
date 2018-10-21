import Vue from 'vue'
import App from './App.vue'

// Boostrap style
import 'bootstrap/dist/css/bootstrap.css'
// Bootstrap function
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Font Awesome icons
import {library} from '@fortawesome/fontawesome-svg-core'
import {faTrashAlt, faSave, faCog} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

library.add(faTrashAlt, faSave, faCog)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

const store = {
  tasks: [],
  order: 'Queue',
  incompleteTasks() {
    const completedTasks = this.tasks.filter(t => !t.completed)
    return this.order === 'Stack' ? completedTasks.reverse() : completedTasks
  },
  completedTasks() {
    return this.tasks.filter(t => t.completed)
  },
  addTask(newTaskName) {
    const newTask = {
      id: this.tasks.length,
      name: newTaskName,
      completed: false
    }
    this.tasks.push(newTask)
  },
  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id)
    const task = this.tasks[index];
    if (task.completed || confirm(`Are you sure you want to delete task ${task.name}? the task is not yet complete!`)) {
      this.tasks.splice(index, 1);
    }
  },
  clearTasks() {
    const completedTasks = this.tasks.filter(t => t.completed)
    if (confirm(`Are you sure that you want to delete all ${completedTasks.length} completed tasks?`)) {
      this.tasks = this.tasks.filter(t => !t.completed)
    }
  }
}

new Vue({
  render: h => h(App),
  data: store
}).$mount('#app')
