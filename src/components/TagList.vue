<template>
  <div>
    <div
      v-for="tag in tags"
      :key="tag"
      class="tag btn-group"
    >
      <button
        class="tag-name btn btn-primary"
        :data-toggle="modal? 'modal' : null"
        :data-target="modal? '#activityModal' : null"
        :title="selectText"
        @click="selectTag(tag)"
      >
        {{ tag }}
      </button>
      <button
        v-if="removeTag"
        class="tag-close btn btn-primary"
        :title="removeText"
        @click.stop="removeTag(tag)"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagList',
  props: {
    tags: {
      type: Array,
      default: () => []
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
  }
}
</script>

<style scoped>

    .tag {
        margin-right: 20px;
    }

    .tag-close {
        font-weight: 700;
    }
    
</style>
