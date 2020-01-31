<template>
  <div
    id="tagModal"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="tagModalLabel"
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
            Tags
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
        <div
          class="modal-body"
        >
          <div
            v-for="(tagData, tagName) in tags"
            :key="tagName"
            class="tag btn-toolbar"
          >
            <div
              class="btn-group"
              role="group"
            >
              <button
                class="tag-name btn"
                :style="`backgroundColor: ${tagData.color}`"
                data-toggle="modal"
                data-target="#activityModal"
                title="View tag activity"
                @click="viewActivityModal(tagName)"
              >
                {{ tagName }}
              </button>
              <button
                class="tag-close btn"
                :style="`backgroundColor: ${tagData.color}`"
                title="Delete tag"
                aria-label="Close"
                @click.stop="deleteTag(tagName)"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DataModal',
  data: () => ({
  }),
  computed: {
    ...mapState([
      'tags'
    ])
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.modal-body {
  height: 70vh;
  overflow-y: auto;
}
.tag {
  margin-bottom: 20px;
  
  button {
    color: white;
    text-shadow:
            0 0 3px rgba(0,0,0,0.4),
            0 0 13px rgba(0,0,0,0.1),
            0 0 23px rgba(0,0,0,0.1);
  }
}
</style>
