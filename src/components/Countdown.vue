<template>
  <div
    id="countdown-container"
    class="d-flex justify-content-center"
    :style="cssProps"
  >
    <div id="dial-container">
      <button
        id="skip-btn"
        class="btn btn-light"
        title="Skip current interval"
        :disabled="editing"
        @click="finishTimer"
      >
        <font-awesome-icon icon="times" />
      </button>
      
      <div
        id="countdown-settings-dropdown"
        class="dropright"
      >
        <button
          id="countdown-menu-button"
          class="btn btn-light"
          data-toggle="dropdown"
        >
          <font-awesome-icon icon="cog" />
        </button>
        <div
          id="countdown-menu"
          class="dropdown-menu"
        >
          <div
            class="form-check form-check-inline"
          >
            <input
              id="continueTimer"
              v-model="continueOnComplete"
              type="checkbox"
              class="form-check-input"
            >
            <label
              class="form-check-label"
              for="continueTimer"
              style="margin-left: 6px;"
              @click.stop=""
            >Continue Timer when Interval Complete</label>
          </div>
        </div>
      </div>
      
      <div id="countdown-button-rotator">
        <div id="countdown-button" />
      </div>
      
      <div id="countdown-trail">
        <p
          v-if="!editing"
          id="timer-display"
          @click="editing = !countingDown"
        >
          {{ displayTime }}
        </p>
        
        <div class="d-flex justify-content-center">
          <div
            v-if="editing"
            id="edit-wrapper"
            class="input-group"
          >
            <input
              v-if="active"
              :value="activeMinutes"
              type="number"
              class="form-control"
              @input="changeActiveMinutes"
              @keyup.enter="updateMinutes"
            >
            <input
              v-if="!active"
              :value="restMinutes"
              type="number"
              class="form-control"
              @input="changeRestMinutes"
              @keyup.enter="updateMinutes"
            >
            <div class="input-group-append">
              <button
                id="timer-save-button"
                type="button"
                class="btn btn-primary"
                @click="updateMinutes"
              >
                <font-awesome-icon icon="save" />
              </button>
            </div>
          </div>
        </div>
        
        <button
          id="play-pause-btn"
          type="button"
          class="btn btn-light btn-lg"
          :disabled="editing"
          :title="(overtime ? 'Stop' : (countingDown ? 'Pause' : 'Start')) + ' timer'"
          @click="toggleTimer"
        >
          <font-awesome-icon :icon="playPauseIcon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import CountdownTimer from '../lib/CountdownTimer'
import notifications from '../lib/notifications'

export default {
  
  name: 'Countdown',
  
  props: {
    taskId: {
      type: Number,
      default: 1
    }
  },
  
  data: () => ({
    editing: false,
    active: true,
    activeIntervalStarted: false,
    countingDown: false,
    overtime: false,
    secondsRemaining: 0,
    notificationList: []
  }),
  
  computed: {
    
    ...mapState([
      'activeMinutes',
      'restMinutes',
      'running'
    ]),
    
    totalSeconds () {
      return (this.active ? this.activeMinutes : this.restMinutes) * 60
    },
    
    playPauseIcon () {
      return this.overtime ? 'stop' : this.countingDown ? 'pause' : 'play'
    },
    
    cssProps () {
      return {
        '--rotation-factor': (this.secondsRemaining / this.totalSeconds).toString() + 'turn',
        '--countdown-color': this.active ? 'red' : 'darkseagreen',
        '--button-color': this.active ? 'darkred' : 'green'
      }
    },
    
    displayTime () {
      const totalSecs = this.overtime ? -this.secondsRemaining : this.secondsRemaining
      const mins = Math.floor(totalSecs / 60)
      const secs = totalSecs % 60
      const secString = secs.toString().padStart(2, '0')
      return `${this.overtime ? '+' : ''}${mins}:${secString}`
    },
    
    continueOnComplete: {
      get () {
        return this.$store.state.continueOnComplete
      },
      set (value) {
        this.updateContinueOnComplete(value)
      }
    }
    
  },
  
  watch: {
    running (newValue, oldValue) {
      if (this.countingDown && oldValue === true && newValue === false) {
        this.toggleTimer()
        this.setTaskInactive()
      }
    }
  },
  
  mounted: function () {
    this.secondsRemaining = this.totalSeconds
    this.timer = new CountdownTimer(this.totalSeconds, this.decrementTimer, this.finishTimer)
    this.resetRunning()
    notifications.requestPermission()
  },
  
  methods: {
    
    ...mapMutations([
      'startTask',
      'stopTask',
      'unpauseTask',
      'updateActiveMinutes',
      'updateRestMinutes',
      'updateContinueOnComplete',
      'resetRunning',
      'setTaskInactive'
    ]),
    
    changeActiveMinutes (e) {
      this.updateActiveMinutes({ activeMinutes: parseFloat(e.target.value) })
      this.secondsRemaining = this.totalSeconds
    },
    
    changeRestMinutes (e) {
      this.updateRestMinutes({ restMinutes: parseFloat(e.target.value) })
      this.secondsRemaining = this.totalSeconds
    },
    
    updateMinutes () {
      this.timer.setSeconds(this.totalSeconds)
      this.editing = false
    },
    
    toggleTimer () {
      // close any open notification
      while (this.notificationList.length > 0) {
        this.notificationList.pop().close()
      }
      
      if (this.overtime) {
        this.overtime = false
        this.resetTimer()
      } else if (this.countingDown) {
        this.timer.pause()
        this.endInterval()
      } else {
        if (!this.activeIntervalStarted && this.active) { // Mark when we started the timer if we're starting an active interval
          this.startTask({ id: this.taskId })
          this.activeIntervalStarted = true
        } else if (this.active) {
          this.startTask({ id: this.taskId })
        }
        this.timer.start()
        this.countingDown = true
      }
    },
    
    decrementTimer (secondsRemaining) {
      this.secondsRemaining = secondsRemaining
      if (this.active) {
        this.stopTask({ id: this.taskId, running: true })
      }
    },
    
    endInterval () {
      if (this.active && this.countingDown) {
        this.stopTask({ id: this.taskId })
      }
      this.countingDown = false
    },
    
    finishTimer (secondsRemaining = null) {
      const fromCountdownFinish = typeof secondsRemaining === 'number'
      let notify = false
      
      if (fromCountdownFinish) { // If this came from the countdown finishing
        this.secondsRemaining = secondsRemaining // reset secondsRemaining
        if (!this.overtime) { // If we're not in overtime
          notify = true // Set notify to true
          if (this.continueOnComplete && this.active) { // If continueOnComplete is set, go into overtime
            this.overtime = true
          }
        }
      } else if (this.overtime) {
        this.overtime = false
      }
      
      // Notify interval finish
      if (notify) {
        let notification
        if (this.active) {
          notification = notifications.notify('Finished Working, Take a Break!')
        } else {
          notification = notifications.notify('Finished Break, Time to Work!')
        }
        
        // add to notificationList for later closure
        if (notification && notification instanceof Notification) {
          this.notificationList.push(notification)
        }
      }
      
      // If this was a manual finishTimer, or we're not continuing into overtime, then reset the timer
      if (!fromCountdownFinish || !this.active || !this.overtime) {
        this.resetTimer()
      } else {
        this.decrementTimer(this.secondsRemaining)
      }
    },
    
    resetTimer () {
      this.timer.clear()
      this.endInterval()
      this.setTaskInactive()
      if (this.active) {
        this.activeIntervalStarted = false
      }
      this.active = !this.active
      this.timer = new CountdownTimer(this.totalSeconds, this.decrementTimer, this.finishTimer)
      this.secondsRemaining = this.totalSeconds
    }
  }
}

</script>

<style scoped>

#countdown-container {
  text-align: center;
}

#dial-container {
  position: relative;
  width: 200px;
  height: 200px;
}

#skip-btn {
  position: absolute;
  right: -38px;
  width: 38px;
  height: 38px;
  border: var(--countdown-color) 2px solid;
  border-radius: 19px;
  color: var(--button-color)
}

#countdown-settings-dropdown {
  position: absolute;
  right: -38px;
  bottom: 0;
}

#countdown-menu {
  width: 210px;
  padding: 8px;
}

#countdown-button-rotator {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(var(--rotation-factor));
  z-index: 1;
  pointer-events: none;
}

#countdown-button {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: var(--countdown-color) 2px solid;
  background-color: white;
  transform: translate(90px, -8px);
}

#countdown-trail {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 35px;
  border-radius: 100px;
  border: var(--countdown-color) 4px solid;
}

#timer-display {
  font-size: xx-large;
}

#edit-wrapper {
  height: 48px;
  max-width: 110px;
  margin-bottom: 16px;
}

#edit-wrapper > input {
  height: 100%;
  font-size: 1.2rem;
}

#play-pause-btn {
  color: var(--button-color);
}

</style>
