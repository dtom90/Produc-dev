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
          :title="(countingDown ? 'Pause' : 'Start') + ' timer'"
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
import CountdownTimer from './CountdownTimer'
import notifications from './notifications'

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
    activeMinutes: 25,
    restMinutes: 5,
    secondsRemaining: 0
  }),
  
  computed: {
    
    ...mapState([
      'activeTaskID'
    ]),
    
    totalSeconds () {
      return (this.active ? this.activeMinutes : this.restMinutes) * 60
    },
    
    playPauseIcon () {
      return this.countingDown ? 'pause' : 'play'
    },
    
    cssProps () {
      return {
        '--rotation-factor': (this.secondsRemaining / this.totalSeconds).toString() + 'turn',
        '--countdown-color': this.active ? 'red' : 'darkseagreen',
        '--button-color': this.active ? 'darkred' : 'green'
      }
    },
    
    displayTime () {
      const totalSecs = this.secondsRemaining
      const mins = Math.floor(totalSecs / 60)
      const secs = totalSecs % 60
      const secString = secs.toString().padStart(2, '0')
      return `${mins}:${secString}`
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
      'endTask'
    ]),
    
    updateMinutes () {
      this.timer.setSeconds(this.totalSeconds)
      this.editing = false
    },
    
    toggleTimer () {
      if (this.countingDown) {
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
      this.timer.clear()
      let notify = true
      if (typeof secondsRemaining === 'number') {
        this.secondsRemaining = secondsRemaining
      } else {
        if (secondsRemaining instanceof MouseEvent) {
          notify = false
        }
      }
      this.endInterval()
      this.endTask()
      if (this.active) {
        this.activeIntervalStarted = false
        if (notify) {
          notifications.notify('Finished Working, Take a Break!')
        }
      } else if (notify) {
        notifications.notify('Finished Break, Time to Work!')
      }
      this.active = !this.active
      this.timer = new CountdownTimer(this.totalSeconds, this.decrementTimer, this.finishTimer)
      this.secondsRemaining = this.totalSeconds
    }
  }
}

</script>

<style scoped>

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
