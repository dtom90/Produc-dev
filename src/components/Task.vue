<template>
  
  <!--  Task List Group Item Wrapper  -->
  <li :class="'task list-group-item list-group-item-action form-check'+active" v-on:click="$root.selectTask(task.id)">
    
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
    computed: {
      active: function() {
        return this.$root.selectedTask === this.task ? ' active' : ''
      }
    }
  }
</script>

<style scoped>
  
</style>
