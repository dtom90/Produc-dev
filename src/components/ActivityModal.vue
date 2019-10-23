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
      class="modal-dialog modal-lg"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">
            <h3
              id="exampleModalLabel"
            >
              Activity for&nbsp;
            </h3>
            <button
              class="btn tag-badge"
              :style="`backgroundColor: ${tagColor[tag]}`"
            >
              {{ tag }}
            </button>
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
import { mapState, mapGetters } from 'vuex'

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

    ...mapState({
      tagColor: 'tags'
    }),
    
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

.tag-badge {
  color: white;
  text-shadow:
          0 0 3px rgba(0,0,0,0.4),
          0 0 13px rgba(0,0,0,0.1),
          0 0 23px rgba(0,0,0,0.1);
}

.tag-badge:hover {
  color: lightgrey;
}

</style>
