<template>
  <div>
    <!-- Time Spent on Task -->
    <h4 v-if="day">
      {{ displayDay }}
    </h4>
    
    <!-- Time Spent on Task -->
    <h4>Time Spent: {{ timeSpent }}</h4>

    <!-- Task Activity Log -->
    <br>
    <table
      id="activity-log"
      class="table day-log"
    >
      <tr
        v-for="(event, index) in descActivity"
        :key="index"
      >
        <th>{{ eventNames[event.type] }}: </th>
        <td>{{ displayDateTime(event.time) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { eventTypes, eventNames } from '@/constants'
import moment from 'moment'

export default {
  name: 'ActivityLog',
  
  props: {
    day: {
      type: String,
      default: null
    },
    activity: {
      type: Array,
      default: () => []
    }
  },
  
  computed: {
    
    displayDay: function () {
      return moment(this.day, 'YYYY-MM-DD').format('ddd MMM DD')
    },
    
    timeSpent: function () {
      return moment.duration(
        this.activity
          .filter((event, i) =>
            (event.type === eventTypes.Started && i !== this.activity.length - 1) ||
            event.type === eventTypes.Stopped)
          .reduce((total, event) => event.type === eventTypes.Started
            ? total - event.time
            : total + event.time, 0)
      ).humanize()
    },
    
    descActivity: function () { return this.activity.slice().reverse() },
  
    eventNames: () => eventNames
    
  },
  
  methods: {
  
    displayDateTime: date => moment(date).format('ddd MMM DD, h:mm a')
    
  }
}
</script>

<style scoped>
    #activity-log {
        font-size: 16px;
    }
</style>
