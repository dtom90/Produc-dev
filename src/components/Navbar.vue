<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <span class="navbar-brand mb-0 h1">DevTrack</span>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a
          class="nav-link"
          data-toggle="modal"
          data-target="#tagModal"
          href="javascript:void(0);"
        >Tags</a>
      </li>
      <li class="nav-item">
        <a
          class="nav-link"
          data-toggle="modal"
          data-target="#dataModal"
          href="javascript:void(0);"
        >Data</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>

</style>
