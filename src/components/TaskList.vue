<template>
  <div id="task-list">
    <ul>
      <li>{{ name }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TaskList',
  props: {
    name: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
</style>
