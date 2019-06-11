<template>
  
  <!--  Task List Group Item Wrapper  -->
  <li class="task list-group-item list-group-item-action form-check" v-on:click="$root.selectTask(task.id)">
    
    <div class="d-flex">

      <span>{{task.name}}</span>
      
    </div>
    
  </li>
</template>

<script>
  export default {
    name: "Task",
    props: {
      task: Object
    },
  }
</script>

<style scoped>
  
</style>
