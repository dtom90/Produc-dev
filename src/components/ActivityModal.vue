<template>
  <div
    id="activityModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div
      class="modal-dialog"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5
            id="exampleModalLabel"
            class="modal-title"
          >
            Activity for {{ tag }}
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <ActivityView
            v-if="tag"
            id="tagActivity"
            :element="tag"
            :log="tagActivity(tag)"
          />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ActivityView from './ActivityView'
import { mapGetters } from 'vuex'

export default {
  name: 'ActivityModal',
  components: {
    ActivityView
  },
  props: {
    tag: {
      type: String,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'tagActivity'
    ])
  }
}
</script>

<style scoped>

</style>
