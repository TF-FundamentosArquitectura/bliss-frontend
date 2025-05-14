<script>
  import HeaderToolbar from "./shared/components/header-toolbar.component.vue";

  export default {
    name: 'app',
    components: {HeaderToolbar}
  }
</script>

<template>
  <header-toolbar/>
  <div class="main-content">
    <router-view/>
  </div>
</template>

<style>
  .main-content {
    padding-top: 60px;
  }
</style>
