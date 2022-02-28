<template>
  <NavBar style="margin-left: 5px;">
    <SearchBox :autofocus="false"/>
  </NavBar>

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
        <GeneDashboard/>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import SearchBox from '@/components/SearchBox.vue'
import GeneDashboard from '@/components/GeneDashboard.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    SearchBox,
    GeneDashboard
  },
  provide: function() {
    let urlParams = new URLSearchParams(window.location.search)
    return {
      geneId: urlParams.get('id')
    }
  },
}
</script>

