<template>
  <NavBar style="margin-left: 5px;"/>

  <div class="container-fluid">
    <div class="row justify-content-center" style="border-bottom: 1px solid #cccccc;margin-bottom: 5px;">
      <div class="col-12 col-sm-11 col-md-11">
        <div class="bravo-tab">
          <div class="bravo-tab-item bravo-tab-item-selected">
            <a href="#">SNVs and Indels</a>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-12 col-sm-11 col-md-11">
        <RegionDashboard/>
        <!--
          <bravoregion :pagination-size="100" :homepage="'{{ url_for('.home', _external = True) }}'" :api="'{{ url_for('.home', _external = True) }}'" :chrom="'{{ chrom }}'" :start="{{ start }}" :stop="{{ stop }}"></bravoregion>
        -->
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import RegionDashboard from '@/components/RegionDashboard.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    RegionDashboard
  },
  provide: function() {
    let urlParams = new URLSearchParams(window.location.search)
    return {
      chrom: urlParams.get('chrom'),
      start: parseInt(urlParams.get('start')),
      stop: parseInt(urlParams.get('stop')),
    }
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

.bravo-tab {
   display: flex;
   flex-direction: row;
}
.bravo-tab-item {
   padding-left: 15px;
   padding-right: 15px;
}
.bravo-tab-item a {
   color: black;
   text-decoration: none;
}
.bravo-tab-item-unselected a {
   color: #757575;
}
.bravo-tab-item-unselected a:hover {
   color: black;
}
.bravo-tab-item-selected a {
   color: #0b66fe;
}
.bravo-tab-item-selected {
   border-bottom: 3px solid #0b66fe;
}
</style>
