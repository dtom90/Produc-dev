<template>
  <div
    :id="id"
    class="activity-view border-top"
  >
    <h3>
      Activity for <strong>{{ element }}</strong>
    </h3>
    
    <!-- ActivityChart -->
    <ActivityChart
      id="activity-chart"
      :chart-data="dailyActivity.chartData"
    />
    
    <br>
    
    <!-- View Switch -->
    <ul
      id="viewType"
      class="nav nav-pills d-flex justify-content-center"
    >
      <li
        id="allView"
        class="nav-item"
      >
        <a
          class="nav-link active"
          data-toggle="tab"
          href="#"
          @click="view = 'all'"
        >All Activity</a>
      </li>
      <li
        id="dailyView"
        class="nav-item"
      >
        <a
          class="nav-link"
          data-toggle="tab"
          href="#"
          @click="view = 'daily'"
        >Daily Activity</a>
      </li>
    </ul>

    <!-- Activity Data -->
    <Log
      v-if="view === 'all'"
      :log="log"
      :time-spent="calculateTimeSpent(log)"
    />
    <div v-if="view === 'daily'">
      <Log
        v-for="(dayActivity, day) in dailyActivity.dailyActivity"
        :key="day"
        :day="day"
        :log="dayActivity.log"
        :time-spent="dayActivity.timeSpent"
      />
    </div>
  </div>
</template>

<script>
import Log from './Log'
import ActivityChart from './ActivityChart'
import { eventTypes } from '@/store/constants'
import moment from 'moment'

export default {
  name: 'ActivityView',
  
  components: {
    Log,
    ActivityChart
  },
  
  props: {
    id: {
      type: String,
      default: 'taskActivity'
    },
    element: {
      type: String,
      default: ''
    },
    log: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  
  data: function () {
    return {
      view: 'all'
    }
  },
  
  computed: {
    
    dailyActivity: function () {
      const dailyActivity = {}
      let day
      
      // Create dailyActivity Object from this.log
      for (const event of this.log) {
        day = moment(event.time).format('YYYY-MM-DD')
        if (day in dailyActivity) {
          dailyActivity[day].log.push(event)
        } else {
          dailyActivity[day] = { log: [event] }
        }
      }
      
      // Initialize chartData
      const chartData = {
        labels: [],
        datasets: [{
          label: 'Activity for ' + this.element,
          backgroundColor: '#2020FF',
          data: []
        }]
      }
      
      // Add time spent per day and add to chartData
      Object.keys(dailyActivity).forEach(day => {
        dailyActivity[day].timeSpent = this.calculateTimeSpent(dailyActivity[day].log)
        chartData.labels.push(moment(day, 'YYYY-MM-DD').format('ddd MMM DD'))
        chartData.datasets[0].data.push(dailyActivity[day].timeSpent.asMinutes())
      })
      
      return { dailyActivity, chartData }
    }
    
  },
  
  methods: {
    calculateTimeSpent (log) {
      const intervals = []
      let currentInterval = { Started: null, Stopped: null }
      for (const event of log) {
        if (event.type === eventTypes.Started) {
          currentInterval.Started = event
        } else if (event.type === eventTypes.Stopped) {
          currentInterval.Stopped = event
          if (currentInterval.Started) {
            intervals.push(currentInterval)
          }
          currentInterval = { Started: null, Stopped: null }
        }
      }
      
      return moment.duration(
        intervals.reduce((total, interval) => total + interval.Stopped.time - interval.Started.time, 0)
      )
    }
  }
}
</script>

<style scoped>

  .activity-view {
    padding: 20px;
  }
  
</style>
