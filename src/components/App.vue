<template>
  <div
    id="app"
    class="container-fluid d-flex"
  >
    <div class="section task-list">
      <TaskList
        title="To Do"
      />
    </div>

    <div
      id="selected-task-section"
      class="section"
    >
      <SelectedTask :task="selectedTask" />
    </div>
    
    <div class="section task-list">
      <TaskList
        title="Done"
      />
    </div>
    
    <!-- Activity Modal -->
    <ActivityModal :tag="modalTag" />
  </div>
</template>

<script>
import TaskList from './TaskList'
import SelectedTask from './SelectedTask'
import ActivityModal from './ActivityModal'
import { mapGetters } from 'vuex'
import $ from 'jquery'

$(document).on('click', '.dropdown-menu', function (e) {
  e.stopPropagation()
})

export default {
  
  name: 'App',
  
  components: {
    TaskList,
    SelectedTask,
    ActivityModal
  },

  data: () => ({
    modalTag: null
  }),
  
  computed: {
    
    ...mapGetters([
      'selectedTask',
      'incompleteTasks',
      'completedTasks'
    ])
  }
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 20px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }
  
  h3, h4, h5 {
    text-align: center;
  }

  .section {
    margin-left: 20px;
    margin-right: 20px;
  }
  
  .task-list {
    flex: 1;
  }
  
  #selected-task-section {
    flex: 2;
    min-width: 0;
  }
  
</style>
