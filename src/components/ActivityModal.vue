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
              data-toggle="dropdown"
            >
              {{ tag }}
            </button>
            <div
              id="tag-menu"
              class="dropdown-menu"
            >
              <sketch-picker
                :value="color"
                @input="updateValue"
              />
            </div>
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
import { mapState, mapGetters, mapMutations } from 'vuex'
import { Sketch } from 'vue-color'
import $ from 'jquery'

$(document).on('click', '#tag-menu', function (e) {
  e.stopPropagation()
})

export default {
  name: 'ActivityModal',
  
  components: {
    ActivityView,
    'sketch-picker': Sketch
  },
  
  props: {
    tag: {
      type: String,
      default: null
    }
  },
  
  data: () => ({
    color: '#FFFFFF'
  }),
  
  computed: {

    ...mapState({
      tagColor: 'tags'
    }),
    
    ...mapGetters([
      'tagActivity'
    ])
  },
  
  watch: {
    tag: function (newVal) {
      this.color = this.tagColor[newVal]
    }
  },
  
  methods: {
    
    ...mapMutations([
      'setTagColor'
    ]),
    
    updateValue (value) {
      this.setTagColor({
        tag: this.tag,
        color: value.hex
      })
      this.color = this.tagColor[this.tag]
    }
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
