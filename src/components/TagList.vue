<template>
  <div>
    <div
      v-for="tag in tags"
      :key="tag"
      class="tag btn-group"
    >
      <button
        class="tag-name btn btn-primary"
        data-toggle="modal"
        data-target="#activityModal"
        title="View tag activity"
        @click="selectedTag = tag"
      >
        {{ tag }}
      </button>
      <button
        class="tag-close btn btn-primary"
        title="Remove tag from task"
        @click="removeTag(tag)"
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
