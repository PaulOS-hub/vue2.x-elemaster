<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  watch: {
    $route: {
      handler(newVal) {
        console.log(newVal);
      },
      immediate: true,
    },
  },
};
</script>

<style>
</style>
