<template>
  <ul class="task-list list-group">
    <Task v-for="task in tasks" :key="task.id" :task="task"/>
  </ul>
</template>

<script>
  import Task from './Task.vue'

  export default {
    name: 'TaskList',
    props: {
      tasks: Array
    },
    components: {
      Task
    }
  }
</script>
