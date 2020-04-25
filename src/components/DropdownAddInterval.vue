<template>
  <div
    style="display: flex; justify-content: flex-end;"
  >
    <b-dropdown
      ref="dropdown"
      variant="light"
      toggle-class="text-decoration-none"
      no-caret
      @shown="dropdownShown = true"
      @hide="dowpdownWillHide"
      @hidden="dropdownShown = false"
    >
      <template v-slot:button-content>
        <font-awesome-icon :icon="dropdownShown ? 'times' : 'plus'" />
      </template>
      <b-dropdown-form>
        <b-input-group
          append="minutes"
        >
          <b-form-input
            ref="appendMinutesInput"
            v-model="appendMinutes"
            type="number"
            @blur="handleBlur"
          />
        </b-input-group>

        <b-btn
          variant="primary"
          style="width: 158px"
          @click="addIntervalButtonClicked"
        >
          Add Interval
        </b-btn>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import time from '../lib/time'

export default {
  name: 'DropdownAddInterval',
  
  mixins: [time],
  
  props: {
    taskId: {
      type: Number,
      default: null
    }
  },
  
  data: function () {
    return {
      dropdownShown: false,
      dropdownHide: null,
      appendMinutes: 25
    }
  },
  
  methods: {
    ...mapMutations(['addInterval']),
    
    dowpdownWillHide (event) {
      this.dropdownHide = event
      setTimeout(this.clearDropdownHide, 1000)
    },
    
    clearDropdownHide () {
      this.dropdownHide = null
    },
    
    handleBlur (event) {
      if (event.sourceCapabilities === null && this.dropdownHide !== null) {
        this.$refs.dropdown.show()
        setTimeout(() => {
          event.target.focus()
        }, 50)
      }
    },
    
    addIntervalButtonClicked () {
      this.addInterval({
        id: this.taskId,
        timeSpent: this.minutesToMs(this.appendMinutes)
      })
      this.$refs.dropdown.hide()
    }
  }
}
</script>

<style scoped>

</style>
