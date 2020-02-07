<template>
  <div
    id="allActivityModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="allActivityModal"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-lg modal-dialog-centered"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <h3>All Activity</h3>
          </div>
          
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
            id="allActivity"
            element="All Activity"
            :log="allActivity"
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
  
  computed: {
    ...mapGetters([
      'allActivity'
    ])
  }
}
</script>

<style scoped>
.modal-title {
  display: flex;
  flex: 1;
  justify-content: center;
}

.modal-title > h3 {
  margin-top: .2rem;
  margin-bottom: 0;
}

</style>
