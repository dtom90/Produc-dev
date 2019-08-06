<template>
  <div
    :id="id"
    class="activity-view"
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
    <div
      id="viewType"
      class="d-flex justify-content-center"
    >
      <button
        id="fullView"
        :class="'btn btn-light nav-link' + (view === 'full' ? ' active' : '')"
        @click="setView('full')"
      >
        Full Log
      </button>
      <button
        id="dailyView"
        :class="'btn btn-light nav-link' + (view === 'daily' ? ' active' : '')"
        @click="setView('daily')"
      >
        Daily Log
      </button>
    </div>

    <!-- Activity Data -->
    <div
      v-if="view"
      class="border"
    >
      <div style="position: relative">
        <div style="position: absolute; right: 0">
          <button
            class="btn btn-light"
            @click="showIntervalInput = !showIntervalInput"
          >
            <font-awesome-icon
              v-if="!showIntervalInput"
              icon="plus"
            />
            <font-awesome-icon
              v-if="showIntervalInput"
              icon="times"
            />
          </button>
        </div>
        <div
          v-if="showIntervalInput"
          style="position: absolute; left: 100%"
        >
          <div
            class="input-group"
            style="width: 140px"
          >
            <input
              ref="intervalMinutesInput"
              type="number"
              value="25"
              class="form-control"
            >
            <div class="input-group-append">
              <span
                class="input-group-text"
              >minutes</span>
            </div>
          </div>
          <button
            class="btn btn-primary"
            @click="addInterval"
          >
            Add Interval
          </button>
        </div>
      </div>
      <Log
        v-if="view === 'full'"
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
  </div>
</template>

<script>
import Log from './Log'
import ActivityChart from './ActivityChart'
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
      view: null,
      showIntervalInput: false
    }
  },
  
  computed: {
    
    dailyActivity: function () {
      const dailyActivity = {}
      let day
      
      // Create dailyActivity Object from this.log
      for (const event of this.log.slice().reverse()) {
        day = moment(event.started).format('YYYY-MM-DD')
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
      return moment.duration(
        log.filter(interval => interval.timeSpent)
          .reduce((total, interval) => total + interval.timeSpent, 0)
      )
    },
    
    setView (type) {
      if (this.view === type) {
        this.view = null
      } else {
        this.view = type
      }
    },
    
    addInterval () {
      console.log(this.$refs.intervalMinutesInput.value)
    }
  }
}
</script>

<style scoped>

  .activity-view {
    padding: 20px;
  }
  
</style>
