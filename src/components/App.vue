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
        <ActiveTask
          v-if="showActive"
          :task="activeTask"
        />
        <SelectedTask
          :task="selectedTask"
          :height-class="heightClass"
        />
      </div>
      
      <div class="section task-list">
        <TaskList
          title="Done"
        />
      </div>
    </div>
    
    <!-- Activity Modal -->
    <ActivityModal />
  
    <!-- All Activity Modal -->
    <AllActivityModal />
    
    <!-- Tag Modal -->
    <TagModal />
    
    <!-- Data Modal -->
    <DataModal />
  </div>
</template>

<script>
import Navbar from './Navbar'
import TaskList from './TaskList'
import SelectedTask from './SelectedTask'
import ActivityModal from './ActivityModal'
import AllActivityModal from './AllActivityModal'
import TagModal from './TagModal'
import DataModal from './DataModal'
import { mapGetters, mapMutations } from 'vuex'
import $ from 'jquery'
import ActiveTask from './ActiveTask'

$(document).on('click', '.dropdown-menu', function (e) {
  e.stopPropagation()
})

export default {
  
  name: 'App',
  
  components: {
    ActiveTask,
    Navbar,
    TaskList,
    SelectedTask,
    ActivityModal,
    AllActivityModal,
    TagModal,
    DataModal
  },
  
  computed: {
    
    ...mapGetters([
      'selectedTask',
      'activeTask',
      'incompleteTasks',
      'completedTasks'
    ]),
    
    showActive () {
      return this.selectedTask && this.activeTask && this.selectedTask.id !== this.activeTask.id
    },
    
    heightClass () {
      return (this.showActive ? 'partial' : 'full') + '-height'
    }
  },
  mounted () {
    this.ensureTagOrder()
  },
  
  methods: {
    ...mapMutations([
      'ensureTagOrder'
    ])
  }
}
</script>

<style lang="scss">
@import "../styles/_variables.scss";

$horiz-spacing: 8px;

//noinspection CssInvalidPropertyValue
.draggable-cursor * {
  cursor: move !important;
  cursor: -webkit-grabbing !important;
  cursor: -moz-grabbing !important;
  cursor: grabbing !important;
}

body {
  overscroll-behavior-y: none;
}

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
