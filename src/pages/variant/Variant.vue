<template>
  <NavBar style="margin-left: 5px;"/>

  <div id="variantviz">
    <div v-if="this.ready">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h1>{{ this.variant.variant_id }}</h1>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6 mt-3">
            <VariantBasicInfo :variant="this.variant"/>
          </div>

          <div class="col-12 col-md-6 mt-3">
            <VariantCounts :variant="this.variant"/>
          </div>
        </div>

        <div class="row">
          <div v-for="ds in this.variant.pub_freq" class="col-12 col-md-6 mt-3">
            <VariantFrequency :ds="ds"/>
          </div>
        </div>

        <div class="row">
          <div class="col-12 mt-3">
            <pre>Consequences Placeholder</pre>
            <!--
            <consequences v-bind:homepage="this.homepage" v-bind:variant="this.variant"/>
            -->
          </div>
        </div>

        <!-- debug -->
<pre>
DEBUG DATA BLOCK
pub_freq: {{variant.pub_freq}}
</pre>

        <!--
        <div class="row">
          <div class="col-md-4 mt-3">
            <depth v-bind:variant="this.variant"/>
          </div>
        </div>

        <div class="row">
          <div class="col-12 mt-3">
            <metrics v-bind:variant="this.variant" v-bind:api="this.api"/>
          </div>
        </div>

        <div class="row">
          <div class="col-12 mt-3">
            <reads v-bind:variant="this.variant" v-bind:api="this.api"/>
          </div>
        </div>
        -->

      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios"
import NavBar from '@/components/NavBar.vue'
import VariantBasicInfo from '@/components/VariantBasicInfo'
import VariantCounts from '@/components/VariantCounts'
import VariantFrequency from '@/components/VariantFrequency'

export default {
  name: 'App',
  components: {
    NavBar,
    VariantBasicInfo,
    VariantCounts,
    VariantFrequency
  },
  data: function() {
    return {
      api: process.env.VUE_APP_BRAVO_API_URL,
      variantId: null,
      ready: false,
      variant: {},
    }
  },
  methods : {
    load: function() {
      axios
        .get(`${this.api}/variant/api/snv/${this.variantId}`)
        .then( response => {
          let payload = response.data;
          let datasets = [];

          this.variant = payload.data[0];
          this.ready = true;

          // provide default pub_freq
          ('pub_freq' in this.variant) || (this.variant['pub_freq'] = [])

          // provide default 1000G data set
          if( !this.variant.pub_freq.some((x) => x.ds == '1000G')){
            this.variant.pub_freq.push({ds: '1000G'})
          }

          // provide default gnomAD data set
          if( !this.variant.pub_freq.some((x) => x.ds == 'gnomAD r2.1')){
            this.variant.pub_freq.push({ds: 'gnomAD r2.1'})
          }
        })
        .catch( error => {
          this.variant = {}
          console.log('variant data loading failed.');
        });
    }
  },
  created: function() {
    let urlParams = new URLSearchParams(window.location.search)
    this.variantId = urlParams.get('id')
  },
  mounted: function() {
    this.load();
  }
}
</script>

<style>
</style>
