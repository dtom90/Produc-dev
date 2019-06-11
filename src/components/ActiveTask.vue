<template>
    <div class="section">
        <h2>Active Task</h2>
        
        <div v-if="$root.selectedTask">
            <h4>{{ $root.selectedTask.name }}</h4>
        </div>
    </div>
</template>

<script>
  export default {
    name: "ActiveTask"
  }
</script>

<style scoped>

</style>