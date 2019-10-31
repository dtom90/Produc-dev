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
              v-model="activeMinutes"
              type="number"
              class="form-control"
              @input="secondsRemaining = totalSeconds"
              @keyup.enter="updateMinutes"
            >
            <input
              v-if="!active"
              v-model="restMinutes"
              type="number"
              class="form-control"
              @input="secondsRemaining = totalSeconds"
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
          :disabled="editing === true"
          :title="(countingUp ? 'Stop' : (countingDown ? 'Pause' : 'Start')) + ' timer'"
          @click="toggleTimer"
        >
          <font-awesome-icon :icon="playPauseIcon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
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
    countingUp: false,
    activeMinutes: 25,
    restMinutes: 5,
    secondsRemaining: 0
  }),
  
  computed: {
    
    ...mapState([
      'running'
    ]),
    
    totalSeconds () {
      return (this.active ? this.activeMinutes : this.restMinutes) * 60
    },
    
    playPauseIcon () {
      return this.countingUp ? 'stop' : this.countingDown ? 'pause' : 'play'
    },
    
    cssProps () {
      return {
        '--rotation-factor': (this.secondsRemaining / this.totalSeconds).toString() + 'turn',
        '--countdown-color': this.active ? 'red' : 'darkseagreen',
        '--button-color': this.active ? 'darkred' : 'green'
      }
    },
    
    displayTime () {
      const totalSecs = this.countingUp ? -this.secondsRemaining : this.secondsRemaining
      const mins = Math.floor(totalSecs / 60)
      const secs = totalSecs % 60
      const secString = secs.toString().padStart(2, '0')
      return `${this.countingUp ? '+' : ''}${mins}:${secString}`
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
        this.timer.pause()
        this.endInterval()
        this.setTaskInactive()
      }
    }
  },
  
  mounted: function () {
    this.secondsRemaining = this.totalSeconds
    this.timer = new CountdownTimer(this.totalSeconds, this.decrementTimer, this.finishTimer)
    notifications.requestPermission()
  },
  
  methods: {
    
    ...mapMutations([
      'startTask',
      'stopTask',
      'unpauseTask',
      'updateContinueOnComplete',
      'setTaskInactive'
    ]),
    
    updateMinutes () {
      this.timer.setSeconds(this.totalSeconds)
      this.editing = false
    },
    
    toggleTimer () {
      if (this.countingUp) {
        this.countingUp = false
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
    },
    
    endInterval () {
      this.countingDown = false
      if (this.active) {
        this.stopTask({ id: this.taskId })
      }
    },
    
    finishTimer (secondsRemaining = null) {
      let notify = false
      if (typeof secondsRemaining === 'number') {
        this.secondsRemaining = secondsRemaining
        if (!this.countingUp) {
          notify = true
        }
      }
      
      if (this.continueOnComplete) {
        if (!this.countingUp) {
          this.countingUp = true
        }
      } else {
        this.resetTimer()
      }
      
      if (this.active && notify) {
        notifications.notify('Finished Working, Take a Break!')
      } else if (notify) {
        notifications.notify('Finished Break, Time to Work!')
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
