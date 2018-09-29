<template>
  <ul class="task-list list-group">
    <Task v-for="task in tasks" :key="task.id" :task="task" :deleteTask="deleteTask" />
  </ul>
</template>

<script>
import Task from './Task.vue'

export default {
  name: 'TaskList',
  props: {
    tasks: Array,
    deleteTask: Function
  },
  components: {
    Task
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
