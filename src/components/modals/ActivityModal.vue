<template>
  <div
    v-if="modalTag"
    id="activityModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="activityModal"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-lg"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <h3>Activity for&nbsp;</h3>
            <TagSettingsButton :tag="modalTag" />
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
            v-if="modalTag"
            id="tagActivity"
            :element="modalTag"
            :log="tagActivity(modalTag)"
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
import ActivityView from '../ActivityView'
import { mapState, mapGetters } from 'vuex'
import TagSettingsButton from '../TagSettingsButton'

export default {
  name: 'ActivityModal',
  
  components: {
    TagSettingsButton,
    ActivityView
  },
  
  computed: {
    ...mapState([
      'modalTag'
    ]),
    
    ...mapGetters([
      'tagActivity'
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
