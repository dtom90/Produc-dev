<template>
  <div class="d-flex justify-content-center">
    <div id="countdown-container">
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
          id="edit-container"
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
</template>

<script>

const TIMER = 25

export default {
  
  name: 'Countdown',
  
  data: () => ({
    timeRemaining: TIMER,
    countingDown: false,
    editing: false
  }),
  
  computed: {
    
    btnIcon: function() {
      return this.countingDown ? 'pause' : 'play'
    }
    
  },
  
  methods: {
  
    toggleTimer () {
      if(this.countingDown) {
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
      this.timeRemaining = TIMER
      clearInterval(this.timer)
    }
  }
}

</script>

<style scoped>

#countdown-container {
    width: 200px;
    height: 200px;
    padding-top: 35px;
    border-radius: 100px;
    border: red 2px solid;
}

#timer-display {
    font-size: xx-large;
}

#edit-container {
  max-width: 110px;
}

</style>
