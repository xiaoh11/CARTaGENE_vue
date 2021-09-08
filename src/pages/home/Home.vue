<template>
  <NavBar style="margin-left: 5px;"/>
  <MainSearch/>
</template>

<script>
import NavBar from '../../components/NavBar.vue'
import MainSearch from '../../components/MainSearch.vue'

export default {
  name: 'App',
  components: {
    MainSearch,
    NavBar
  },
  provide:{
    subtitle: process.env.VUE_APP_SUBTITLE,
    subtitle2: process.env.VUE_APP_SUBTITLE2,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
