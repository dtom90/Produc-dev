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
              v-model="timerMinutes"
              type="number"
              class="form-control"
              @input="secondsRemaining = totalTime"
              @keyup.enter="editing = false"
            >
            <div class="input-group-append">
              <button
                type="button"
                class="btn btn-primary"
                @click="editing = false"
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
import { eventTypes } from '@/store/constants'

export default {
  
  name: 'Countdown',
  
  props: {
    taskId: {
      type: Number,
      default: 1
    }
  },
  
  data: () => ({
    timerMinutes: 25,
    secondsRemaining: 0,
    countingDown: false,
    editing: false
  }),
  
  computed: {

    totalTime () {
      return this.timerMinutes * 60
    },
    
    playPauseIcon () {
      return this.countingDown ? 'pause' : 'play'
    },

    cssProps () {
      return {
        '--rotation-factor': (this.secondsRemaining / this.totalTime).toString() + 'turn'
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
    this.secondsRemaining = this.totalTime
    this.timer = new Timer(this.decrementTimer)
  },
  
  methods: {

    ...mapMutations([
      'addTaskEvent'
    ]),
    
    start () {
      this.timer.start()
      this.addTaskEvent({
        id: this.taskId,
        type: eventTypes.Started
      })
      this.countingDown = true
    },
    
    stop () {
      this.addTaskEvent({
        id: this.taskId,
        type: eventTypes.Stopped
      })
      this.countingDown = false
    },
  
    toggleTimer () {
      if (this.countingDown) {
        this.timer.pause()
        this.stop()
      } else {
        this.start()
      }
    },
    
    decrementTimer () {
      if (this.secondsRemaining > 1) {
        this.secondsRemaining -= 1
      } else {
        this.stop()
        this.timer.clear()
        this.secondsRemaining = this.totalTime
      }
    }
  }
}

function Timer (callback, interval = 1000) {
  let timerId; let startTime; let remaining = interval
  
  this.id = () => timerId
  
  this.start = function () {
    const t = this
    clearTimeout(timerId)
    startTime = Date.now()
    timerId = setTimeout(function () { t.start() }, remaining)
    if (remaining !== interval) {
      remaining = interval
    } else {
      callback()
    }
  }

  this.pause = function () {
    clearTimeout(timerId)
    remaining -= Date.now() - startTime
  }
  
  this.clear = function () {
    clearTimeout(timerId)
    remaining = interval
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
  border: red 2px solid;
  background-color: white;
  transform: translate(90px, -8px);
}

#countdown-trail {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 35px;
  border-radius: 100px;
  border: red 4px solid;
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
  color: darkred;
}

</style>
