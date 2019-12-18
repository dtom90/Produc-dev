<template>
  <div
    id="app"
  >
    <Navbar />
    
    <div
      id="main-section"
      class="d-flex"
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
    </div>
    
    <!-- Activity Modal -->
    <ActivityModal :tag="modalTag" />
    
    <!-- Data Modal -->
    <DataModal />
  </div>
</template>

<script>
import Navbar from './Navbar'
import TaskList from './TaskList'
import SelectedTask from './SelectedTask'
import ActivityModal from './ActivityModal'
import DataModal from './DataModal'
import { mapGetters } from 'vuex'
import $ from 'jquery'

$(document).on('click', '.dropdown-menu', function (e) {
  e.stopPropagation()
})

export default {
  
  name: 'App',
  
  components: {
    DataModal,
    Navbar,
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

<style lang="scss">
  @import "../styles/_variables.scss";

  $horiz-spacing: 8px;
  
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  
  #main-section {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 20px;
    margin-top: $main-section-margin-top;
    padding-left: $horiz-spacing;
    padding-right: $horiz-spacing;
  }
  
  h3, h4, h5, h6 {
    text-align: center;
  }
  
  .section {
    margin-left: $horiz-spacing;
    margin-right: $horiz-spacing;
  }
  
  .task-list {
    flex: 1;
  }
  
  #selected-task-section {
    flex: 2;
    min-width: 0;
  }
</style>
