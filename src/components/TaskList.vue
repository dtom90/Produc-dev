<template>
  <ul class="task-list list-group">
    <li v-for="task in tasks" :key="task.id" :id="'task-'+task.id" class="task list-group-item">
      <input type="checkbox" v-model="task.completed"/>{{ task.name }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'TaskList',
  props: {
    tasks: Array
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.task {
  text-align: left;
}
input {
  margin-right: 20px;
}
</style>
