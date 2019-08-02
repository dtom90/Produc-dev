<template>
  <div
    id="countdown-container"
    class="d-flex justify-content-center"
    :style="cssProps"
  >
    <div id="dial-container">
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
              v-model="timerMinutes"
              type="number"
              class="form-control"
              @input="secondsRemaining = totalTime"
              @keyup.enter="updateMinutes"
            >
            <input
              v-if="!active"
              v-model="restMinutes"
              type="number"
              class="form-control"
              @input="secondsRemaining = totalTime"
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
          @click="toggleTimer"
        >
          <font-awesome-icon :icon="playPauseIcon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
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
    active: true,
    timerMinutes: 25,
    restMinutes: 5,
    secondsRemaining: 0,
    countingDown: false,
    editing: false
  }),
  
  computed: {
    
    totalTime () {
      return (this.active ? this.timerMinutes : this.restMinutes) * 60
    },
    
    playPauseIcon () {
      return this.countingDown ? 'pause' : 'play'
    },
    
    cssProps () {
      return {
        '--rotation-factor': (this.secondsRemaining / this.totalTime).toString() + 'turn',
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
  
  watch: {
    taskId: function (newId, oldId) {
      if (this.countingDown) {
        this.stopTask({ id: oldId })
        this.startTask({ id: newId })
      }
    }
  },
  
  mounted: function () {
    this.secondsRemaining = this.totalTime
    this.timer = new CountdownTimer(this.totalTime, this.decrementTimer, this.finishTimer)
    notifications.requestPermission()
  },
  
  methods: {
    
    ...mapMutations([
      'startTask',
      'stopTask'
    ]),
    
    updateMinutes () {
      this.timer.setSeconds(this.totalTime)
      this.editing = false
    },
    
    startTimer () {
      this.timer.start()
      if (this.active) {
        this.startTask({ id: this.taskId })
      }
      this.countingDown = true
    },
    
    stopTimer () {
      if (this.active) {
        this.stopTask({ id: this.taskId })
      }
      this.countingDown = false
    },
    
    toggleTimer () {
      if (this.countingDown) {
        this.timer.pause()
        this.stopTimer()
      } else {
        this.startTimer()
      }
    },
    
    decrementTimer (secondsRemaining) {
      this.secondsRemaining = secondsRemaining
    },
    
    finishTimer () {
      this.stopTimer()
      if (this.active) {
        notifications.notify('Finished Working, Take a Break!')
      } else {
        notifications.notify('Finished Break, Time to Work!')
      }
      this.active = !this.active
      this.timer = new CountdownTimer(this.totalTime, this.decrementTimer, this.finishTimer)
      this.secondsRemaining = this.totalTime
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
