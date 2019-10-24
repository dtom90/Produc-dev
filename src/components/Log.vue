<template>
  <div id="activityData">
    <!-- Display Day -->
    <h4
      v-if="day"
      style="text-decoration: underline;"
    >
      {{ displayDay }}
    </h4>
    
    <!-- Time Spent on Task -->
    <h5>Time Spent: {{ displayTimeSpent(timeSpent) }}</h5>
    
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
          <span>Started {{ day ? displayTime(event.started) : displayDateTime(event.started) }}</span>
        </td>
        <td v-if="event.stopped">
          <font-awesome-icon icon="arrow-right" />
        </td>
        <td v-if="event.stopped">
          <span>Stopped {{ displayTime(event.stopped) }}</span>
        </td>
        <td v-if="event.timeSpent">
          <span>Time Spent: {{ displayTimeSpent(event.timeSpent) }}</span>
        </td>
        
        <td v-if="event.completed" />
        <td v-if="event.completed" />
        <td v-if="event.completed">
          <span>Completed {{ displayTime(event.completed) }}</span>
        </td>
        <td v-if="event.completed" />
      </tr>
    </table>
  </div>
</template>

<script>
import moment from 'moment'
import humanizeDuration from 'humanize-duration'

export default {
  name: 'Log',
  
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
      type: Object,
      default: () => moment.duration()
    }
  },
  
  computed: {
    
    displayDay: function () {
      return moment(this.day, 'YYYY-MM-DD').format('ddd MMM DD')
    }
    
  },
  
  methods: {
    
    displayTime: date => moment(date).format('h:mm a'),
    
    displayDateTime: date => moment(date).format('ddd MMM DD, h:mm a'),
    
    displayTimeSpent: timeSpent => humanizeDuration(timeSpent, {
      units: ['d', 'h', 'm'],
      round: true
    })
    
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
  }
</style>
