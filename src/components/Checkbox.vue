<template>
  <div class="checkbox-container">
    <input
      :checked="checked"
      class="task-checkbox"
      type="checkbox"
      @change="completeTask({id: taskId})"
    >
    <span class="check-custom" />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'Checkbox',
  
  props: {
    checked: {
      type: Number,
      default: 0
    },
    taskId: {
      type: Number,
      default: null
    }
  },
  
  methods: {
    ...mapMutations([
      'completeTask'
    ])
  }
}
</script>

<style scoped lang="scss">
    /* Adapted from https://hackernoon.com/hacking-custom-checkboxes-and-radios-5d48230440d */

    $checkbox-size: 2.2rem;

    .checkbox-container {
        margin-right: 30px;
        position: relative;
        width: $checkbox-size;
        height: $checkbox-size;
    }

    .checkbox-container > * {
        position: absolute;
        width: $checkbox-size;
        height: $checkbox-size;
    }

    /* Styles for hiding the native checkbox */
    .task-checkbox {
        z-index: 2;
        opacity: 0;
        cursor: pointer;
    }

    /* Styles for the basic appearance of the custom checkbox */
    .check-custom {
        border: 2px solid #969696;
        border-radius: 50%;
    }

    /* Styles for the hover state of the custom checkbox */
    .task-checkbox:hover ~ .check-custom {
        border-color: #b0d5ff;
        box-shadow: 0 0 0 2px rgba(23, 133, 255, 0.25);
    }

    /* Styles for the checked state of the custom checkbox */
    .task-checkbox:checked ~ .check-custom {
        border-color: #1785ff;
        background: #1785ff url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSIyMCA2IDkgMTcgNCAxMiI+PC9wb2x5bGluZT48L3N2Zz4=) center no-repeat;
        background-size: 75%;
    }
</style>
