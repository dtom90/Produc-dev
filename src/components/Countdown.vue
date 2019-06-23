<template>
  <div :style="cssProps">
    <div class="d-flex justify-content-center">
      <div id="countdown-container">
        <div id="countdown-button-rotator">
          <div id="countdown-button" />
        </div>
        
        <div id="countdown-trail">
          <p
            v-if="!editing"
            id="timer-display"
            @click="editing = true"
          >
            {{ timeRemaining }}
          </p>

          <div class="d-flex justify-content-center">
            <div
              v-if="editing"
              id="edit-wrapper"
              class="input-group"
            >
              <input
                v-model="timeRemaining"
                type="number"
                class="form-control"
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
            type="button"
            @click="toggleTimer"
          >
            <font-awesome-icon :icon="btnIcon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  
  name: 'Countdown',
  
  data: () => ({
    totalTime: 25,
    timeRemaining: 0,
    countingDown: false,
    editing: false
  }),
  
  computed: {
    
    btnIcon () {
      return this.countingDown ? 'pause' : 'play'
    },

    cssProps () {
      return {
        '--rotation-factor': (-this.timeRemaining / this.totalTime).toString() + 'turn'
      }
    }
    
  },
  
  mounted: function () {
    this.timeRemaining = this.totalTime
  },
  
  methods: {
  
    toggleTimer () {
      if (this.countingDown) {
        clearInterval(this.timer)
        this.countingDown = false
      } else {
        this.startTimer()
      }
    },
    
    startTimer () {
      this.timer = setInterval(this.decrementTimer, 1000)
      this.countingDown = true
    },
    
    decrementTimer () {
      if (this.timeRemaining > 1) {
        this.timeRemaining -= 1
      } else {
        this.finishTimer()
      }
    },
    
    finishTimer () {
      this.timeRemaining = this.totalTime
      clearInterval(this.timer)
    }
  }
}

</script>

<style scoped>

#countdown-container {
  position: relative;
  width: 200px;
  height: 200px;
}

#countdown-button-rotator {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(var(--rotation-factor));
}

#countdown-button {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: red 2px solid;
  transform: translate(90px, -10px);
}

#countdown-trail {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 35px;
  border-radius: 100px;
  border: red 2px solid;
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

</style>
