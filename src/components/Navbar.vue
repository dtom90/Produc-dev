<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-light">
    <span class="navbar-brand mb-0 h1">DevTrack</span>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarMenuOptions"
      aria-controls="navbarMenuOptions"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <div
      id="navbarMenuOptions"
      class="collapse navbar-collapse"
    >
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
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>

</style>
