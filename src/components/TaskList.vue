<template>
  <div class="task-list">
    <div v-for="task in tasks" :key="task.id" :id="'task-'+task.id" class="task">
      <input type="checkbox" v-model="task.completed"/>{{ task.name }}
    </div>
  </div>
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
  margin: 10px 0;
}
</style>
