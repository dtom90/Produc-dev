<template>
  <ul class="task-list list-group">
    <Task v-for="task in tasks" :key="task.id" :task="task" v-on:delete="deleteTask" />
  </ul>
</template>

<script>
import Task from './Task.vue'

export default {
  name: 'TaskList',
  props: {
    tasks: Array,
    deleteTaskFromApp: Function
  },
  components: {
    Task
  },
  methods: {
    deleteTask: function (id) {
      this.deleteTaskFromApp(id)
    }
  }
}
</script>
