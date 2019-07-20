<template>
  <div
    id="panel"
    class="border-top"
  >
    <h3 v-if="tag">
      Activity for: {{ tag }}
    </h3>
    
    <!-- ActivityChart -->
    <ActivityChart :chart-data="chartData" />
    
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
    <Activity
      v-if="view === 'all'"
      :log="log"
      :time-spent="calculateTimeSpent(log)"
    />
    <div v-if="view === 'daily'">
      <Activity
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
import Activity from './Activity'
import ActivityChart from './ActivityChart'
import { eventTypes } from '@/store/constants'
import moment from 'moment'

export default {
  name: 'ActivityView',
  
  components: {
    Activity,
    ActivityChart
  },
  
  props: {
    log: {
      type: Array,
      default: function () {
        return []
      }
    },
    tag: {
      type: String,
      default: function () {
        return null
      }
    }
  },
  
  data: function () {
    return {
      view: 'all',
      chartData: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Dataset 1',
          backgroundColor: 'red',
          borderColor: 'red',
          borderWidth: 1,
          data: [
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt()
          ]
        }, {
          label: 'Dataset 2',
          backgroundColor: 'blue',
          borderColor: 'blue',
          borderWidth: 1,
          data: [
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt()
          ]
        }]
      }
    }
  },
  
  computed: {
    
    dailyActivity: function () {
      const chartData = {
        labels: [],
        datasets: {
          label: 'Activity For This',
          backgroundColor: 'blue',
          data: []
        }
      }
      const dailyActivity = {}
      
      let day
      for (let event of this.log) {
        day = moment(event.time).format('YYYY-MM-DD')
        if (day in dailyActivity) {
          dailyActivity[day].log.push(event)
        } else {
          dailyActivity[day] = { log: [event] }
          chartData.labels.push(day)
        }
      }
      
      Object.keys(dailyActivity).forEach(day => {
        dailyActivity[day].timeSpent = this.calculateTimeSpent(dailyActivity[day].log)
      })

      return { dailyActivity, chartData }
    }
    
  },
  
  methods: {

    calculateTimeSpent (log) {
      return moment.duration(
        log.filter((event, i) =>
          (event.type === eventTypes.Started && i !== log.length - 1) ||
                      event.type === eventTypes.Stopped)
          .reduce((total, event) => event.type === eventTypes.Started
            ? total - event.time
            : total + event.time, 0)
      )
    },
    
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>

<style scoped>

  #panel {
    padding: 20px;
  }
  
</style>
