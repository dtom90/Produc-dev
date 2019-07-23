<template>
  <div
    id="activityData"
    class="border"
  >
    <!-- Display Day -->
    <h4
      v-if="day"
      style="text-decoration: underline;"
    >
      {{ displayDay }}
    </h4>
    
    <!-- Time Spent on Task -->
    <h4>Time Spent: {{ timeSpent.humanize() }}</h4>
    
    <!-- Task Activity Log -->
    <table
      id="activityLog"
      class="table"
    >
      <tr
        v-for="(event, index) in descLog"
        :key="index"
      >
        <th>{{ eventNames[event.type] + (event.task ? ' ' + event.task : '') }}: </th>
        <td>{{ displayDateTime(event.time) }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { eventNames } from '@/store/constants'
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
    },
    
    descLog: function () { return this.log.slice().reverse() },
  
    eventNames: () => eventNames
    
  },
  
  methods: {
  
    displayDateTime: date => moment(date).format('ddd MMM DD, h:mm a')
    
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
