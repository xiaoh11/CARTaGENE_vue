<template>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-10 col-sm-8 col-md-6">
        <div class="m-3 m-md-5 text-center">
          <img class="bo-big-logo" v-bind:src="logo" width="200"/>
          <template v-if="subtitle">
            <h5>{{ subtitle }}</h5>
            <template v-if="subtitle2">
              <small class="text-muted">{{ subtitle2 }}</small>
            </template>
          </template>
          <hr class="margin-centered" width="25%">
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-10 col-sm-8 col-md-6">
        <div id="search-box">
          <BravoSearch :autofocus="true"></BravoSearch>
        </div>
      </div>
    </div>
    <div class="row justify-content-center mt-3">
      <div class="col-10 col-sm-8 col-md-6">
        <p class="text-center text-muted">
          <template  v-for="(value, name) in exampleLinks" v-bind:key="name">
            <a v-bind:href="publicPath + value">{{ name }}</a>{{', '}}
          </template>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import logo from "../assets/bravo_logo_beta.png"
import BravoSearch from '@/components/SearchBox.vue'

export default {
  name: 'MainSearch',
  components: { BravoSearch },
  props: { },
  inject: {
    'subtitle': {default: ''},
    'subtitle2': {default: ''}
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      logo: logo,
      exampleLinks: {
        'HBB': 'gene.html?id=HBB',
        '11:5225000-5229000': 'region.html?variant_type=snv&chrom=11&start=5225000&stop=5229000',
        '22-16389447-A-G': 'variant.html?variant_type=snv&variant_id=22-16389447-A-G',
        'rs34747326': 'variant.html?variant_type=snv&variant_id=rs34747326'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .bo-big-logo {
    margin-bottom: 10px;
  }

  /* override with no left or right margin to allow centering */
  .margin-centered {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: auto;
    margin-right: auto;
  }
</style>
