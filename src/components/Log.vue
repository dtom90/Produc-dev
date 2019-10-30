<template>
  <div id="activityData">
    <!-- Display Day -->
    <h4
      v-if="day"
      style="text-decoration: underline;"
    >
      {{ displayDateHuman(day) }}
    </h4>
    
    <!-- Time Spent on Task -->
    <h5>Time Spent: {{ displayDuration(timeSpent) }}</h5>
    
    <!-- Task Activity Log -->
    <table
      id="activityLog"
      class="table"
    >
      <tr
        v-for="(event, index) in log"
        :key="index"
      >
        <td v-if="event.task">
          <span>{{ event.task }}</span>
        </td>
        
        <td v-if="event.started">
          <span>Started {{ day ? displayTimeHuman(event.started) : displayDateTimeHuman(event.started) }}</span>
        </td>
        <td v-if="event.stopped">
          <font-awesome-icon icon="arrow-right" />
        </td>
        <td v-if="event.stopped">
          <span>Stopped {{ displayTimeHuman(event.stopped) }}</span>
        </td>
        <td v-if="event.timeSpent">
          <span>Time Spent: {{ displayDuration(event.timeSpent) }}</span>
        </td>
        
        <td v-if="event.completed" />
        <td v-if="event.completed" />
        <td v-if="event.completed">
          <span>Completed {{ displayTimeHuman(event.completed) }}</span>
        </td>
        <td v-if="event.completed" />
      </tr>
    </table>
  </div>
</template>

<script>
import time from '../lib/time'

export default {
  name: 'Log',
  
  mixins: [time],
  
  props: {
    day: {
      type: String,
      default: null
    },
    log: {
      type: Array,
      default: () => []
    },
    timeSpent: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>

  h4 {
    margin-top: 20px;
  }
  
  #activityLog {
    margin-top: 20px;
    font-size: 16px;
    text-align: center;
  }
</style>
