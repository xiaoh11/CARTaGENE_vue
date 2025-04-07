<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-10 col-sm-8 col-md-6">
        <div class="m-3 m-md-5 text-center align-center">
          <img class="bo-big-logo" v-bind:src="logo"/>
          <template v-if="subtitle">
            <h5>{{ subtitle }}</h5>
            <hr class="margin-centered" width="25%">
            <template v-if="subtitle2">
              <small class="text-muted">{{ subtitle2 }}</small>
            </template>
          </template>

        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-10 col-sm-8 col-md-6">
        <div id="search-box">
          <SearchBox :autofocus="true" v-on:noSearchResults="handleNoResults"></SearchBox>
        </div>
      </div>
    </div>
    <div class="row justify-content-center mt-3">
      <div class="col-10 col-sm-8 col-md-6">
        <p class="text-center text-muted">
          Examples:
          <template  v-for="(value, name) in exampleLinks" v-bind:key="name">
            <a v-bind:href="publicPath + value">{{ name }}</a>{{', '}}
          </template>
        </p>
      </div>
    </div>
    <div class="row justify-content-center mt-3">
        <p class="text-center text-muted">
          {{message}}
        </p>
    </div>
  </div>
</template>

<script>
import logo from "../assets/Cartagene_Logos_RVB_Principal_Bicolore_Foncé.png"
import SearchBox from '@/components/SearchBox.vue'

export default {
  name: 'MainSearch',
  components: { SearchBox },
  inject: {
    'subtitle': {default: ''},
    'subtitle2': {default: ''}
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      version: process.env.VUE_APP_VERSION,
      logo: logo,
      message: null,
      exampleLinks: {
        'PCSK9': 'gene.html?id=PCSK9', 
        '1:55,030,000-55,075,000': 'region.html?chrom=1&start=55030000&stop=55075000',
        '22-16389447-A-G': 'variant.html?chrom=22&pos=16389447&ref=A&alt=G',
        'rs34747326': 'variant.html?chrom=22&pos=16389447&ref=A&alt=G'
      }
    }
  },
  methods: {
    handleNoResults(queryVal){
      this.message = "No search results for " + queryVal
    }
  }
}
</script>
