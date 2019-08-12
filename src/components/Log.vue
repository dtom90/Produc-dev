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
    <h5>Time Spent: {{ timeSpent.humanize() }}</h5>
    
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
          {{ event.task }}
        </td>
        <td>
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
      </tr>
    </table>
  </div>
</template>

<script>
import moment from 'moment'

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
    
    displayTimeSpent: timeSpent => moment.duration(timeSpent).humanize()
    
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
