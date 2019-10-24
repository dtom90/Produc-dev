<template>
  <div
    :id="taskTags ? 'taskTags' : 'filterTags'"
    class="form-inline"
  >
    <h6
      v-if="taskId === null"
      style="width: 100%"
    >
      {{ label }}:
    </h6>
    <label v-if="taskId !==null">{{ label }}:</label>
    
    <div
      v-for="tag in tags"
      :key="tag"
      class="tag btn-group"
    >
      <button
        class="tag-name btn"
        :style="`backgroundColor: ${tagColor[tag]}`"
        :data-toggle="modal? 'modal' : null"
        :data-target="modal? '#activityModal' : null"
        :title="selectText"
        @click="selectTag(tag, $event)"
      >
        {{ tag }}
      </button>
      <button
        v-if="removeTag"
        class="tag-close btn"
        :style="`backgroundColor: ${tagColor[tag]}`"
        :title="removeText"
        @click.stop="removeTag(tag)"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    
    <!-- Tag Input -->
    <div
      v-if="taskTags"
      id="newTag"
      class="d-flex"
    >
      <button
        id="addTagButton"
        class="btn btn-light"
        :title="showTagInput ? 'Cancel' : 'Add new tag'"
        @click="addTagButton"
      >
        <font-awesome-icon
          v-if="!showTagInput"
          icon="plus"
        />
        <font-awesome-icon
          v-if="showTagInput"
          icon="times"
        />
      </button>
      <div
        id="tagDropdown"
      >
        <div
          id="tagDropdownMenu"
          class="btn-group-vertical"
        >
          <button
            v-for="tag in tagOptions"
            :key="tag"
            class="tag-option btn btn-light"
            :style="`backgroundColor: ${tagColor[tag]}`"
            @click="addTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>
      <input
        v-if="showTagInput"
        id="addTagInput"
        ref="addTagInput"
        v-model="newTag"
        type="text"
        class="form-control"
        placeholder="add new tag"
        @input="tagInputChange"
        @focus="tagInputChange"
        @blur="clickOutside"
        @keyup.enter="addTag(newTag)"
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'TagList',
  props: {
    tags: {
      type: Array,
      default: () => []
    },
    taskId: {
      type: Number,
      default: null
    },
    label: {
      type: String,
      default: 'Tags'
    },
    selectText: {
      type: String,
      default: 'View tag activity'
    },
    selectTag: {
      type: Function,
      default: () => null
    },
    modal: {
      type: Boolean,
      default: false
    },
    removeText: {
      type: String,
      default: 'Remove tag from task'
    },
    removeTag: {
      type: Function,
      default: null
    }
  },

  data: () => ({
    editing: false,
    newTag: '',
    tagOptions: [],
    showTagInput: false
  }),
  
  computed: {
    
    ...mapState({
      tagColor: 'tags'
    }),
    
    ...mapGetters([
      'availableTags'
    ]),
    
    taskTags: function () {
      return this.taskId !== null
    },
    
    filtered: function () {
      return this.removeText === 'Clear Filter'
    }
  },

  methods: {

    ...mapMutations([
      'addTaskTag',
      'removeTaskTag'
    ]),

    addTagButton: function () {
      this.showTagInput = !this.showTagInput
      if (this.showTagInput) {
        this.$nextTick(() => {
          this.$refs.addTagInput.focus()
        })
      }
    },

    tagInputChange: function () {
      this.tagOptions = this.availableTags(this.taskId, this.newTag)
    },

    addTag: function (newTag) {
      this.addTaskTag({ id: this.taskId, tag: newTag })
      this.newTag = ''
      this.tagInputChange()
      this.tagOptions = []
      this.$refs.addTagInput.focus()
    },

    clickOutside: function (event) {
      if (!(event.relatedTarget && event.relatedTarget.classList &&
              event.relatedTarget.classList.contains('tag-option'))) {
        this.tagOptions = []
        if (!(event.relatedTarget && event.relatedTarget.id === 'addTagButton')) {
          this.showTagInput = false
        }
      }
    }
    
  }
}
</script>

<style scoped>

    /*noinspection CssUnusedSymbol*/
    #taskTags {
      padding-left: 20px;
    }
    
    #taskTags > * {
      margin-top: 20px;
      margin-right: 20px;
    }

    #filterTags > *:not(label) {
      margin-top: 5px;
      margin-bottom: 5px;
      margin-right: 10px;
    }

    #filterTags > label {
      width: 100%;
      justify-content: start;
    }

    #addTagInput {
      max-width: 160px;
    }
    
    #tagDropdown {
      position: relative;
    }
    
    #tagDropdownMenu {
      position: absolute;
      top: 42px;
      z-index: 4;
      width: 160px;
    }
    
    .tag > button {
      color: white;
      text-shadow:
              0 0 3px rgba(0,0,0,0.4),
              0 0 13px rgba(0,0,0,0.1),
              0 0 23px rgba(0,0,0,0.1);
    }
    
    .tag > button:hover {
      color: lightgrey;
    }
    
    .tag-name {
      word-break: break-word;
    }
    
    .tag-close {
      font-weight: 700;
    }
    
    .tag-option {
      color: white;
      text-shadow:
              0 0 3px rgba(0,0,0,0.4),
              0 0 13px rgba(0,0,0,0.1),
              0 0 23px rgba(0,0,0,0.1);
      word-break: break-word;
    }
    
    .tag-option:hover {
      color: lightgrey;
    }
    
</style>
