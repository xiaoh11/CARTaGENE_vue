<template>
  <NavBar style="margin-left: 5px;">
    <SearchBox :autofocus="false"/>
  </NavBar>

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
          <!-- HX  -->
          <div class="col-12 col-md-6 mt-3">
            <VariantPopFrequency :allelePopFreq="this.variant.allele_pop_freq" />
          </div>
          
          <div v-for="ds in this.variant.pub_freq" class="col-12 col-md-6 mt-3">
            <VariantFrequency :ds="ds"/>
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-6 mt-3">
            <div class="card shadow-sm" style="min-width: 300px">
              <div class="card-body">
                <div class="container-fluid">
                  <div class="row">
                    <div class="col-12" style="margin-bottom:8px;">
                      <h5>Allele frequency in TOPMed</h5>
                      <p>View <strong>{{ this.variant.variant_id }}</strong> in <a :href="getLinkUrl()">BRAVO for TOPMed Freeze 5</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- HX -->

        <div class="row">
          <div class="col-12 mt-3">
            <VariantConsequences :variant="this.variant"/>
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 mt-3">
            <VariantDepth :variant="this.variant"/>
          </div>
        </div>

        <div class="row">
          <div class="col-12 mt-3 mb-5">
            <VariantPheno :variant="this.variant"/>
          </div>
        </div>


        <!-- HX -->
        <!-- <div class="row">
          <div class="col-12 mt-3">
            <VariantMetrics :variant="this.variant"/>
          </div>
        </div> -->

        <!-- <div class="row">
          <div class="col-12 mt-3">
            <Reads :variant="this.variant"/>
          </div>
        </div> -->
        <!-- HX -->

      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import SearchBox from '@/components/SearchBox.vue'
import VariantBasicInfo from '@/components/VariantBasicInfo'
import VariantCounts from '@/components/VariantCounts'
import VariantFrequency from '@/components/VariantFrequency'
// HX 
import VariantPopFrequency from '@/components/VariantPopFrequency'
import VariantConsequences from '@/components/VariantConsequences'
import VariantDepth from '@/components/VariantDepth'
import VariantMetrics from '@/components/VariantMetrics'
import VariantPheno from '@/components/VariantPheno.vue'
import Reads from '@/components/Reads'
import axios from "axios"
axios.defaults.withCredentials=true

export default {
  name: 'App',
  components: {
    NavBar,
    SearchBox,
    VariantBasicInfo,
    VariantCounts,
    VariantPopFrequency,
    VariantFrequency,
    VariantConsequences,
    VariantDepth,
    VariantMetrics,
    Reads,
    VariantPheno,
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
    // HX
    getLinkUrl() {
      return `https://bravo.sph.umich.edu/freeze5/hg38/variant/${this.variant.variant_id}`;
    },
    getPheWeb(){
      return `https://pheweb.org/UKB-TOPMed/variant/${this.variant.variant_id}`;
    },
    // HX
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

          // HX: provide default gnomADe data set 
          if( !this.variant.pub_freq.some((x) => x.ds == 'gnomADe')){
            this.variant.pub_freq.push({ds: 'gnomADe'})
          }

          // HX: provide default gnomADg data set
          if( !this.variant.pub_freq.some((x) => x.ds == 'gnomADg')){
            this.variant.pub_freq.push({ds: 'gnomADg'})
          };
        })
        .catch( error => {
          this.variant = {}
          console.log('variant data loading failed.');
        });
    },
  },
  created: function() {
    let urlParams = new URLSearchParams(window.location.search)
    let id = urlParams.get('id')
    if(id){
      this.variantId = urlParams.get('id')
    }else{
      let parts = [
        urlParams.get('chrom'), urlParams.get('pos'),
        urlParams.get('ref'), urlParams.get('alt')
      ]
      this.variantId = parts.join('-')
    }
  },
  mounted: function() {
    this.load();
  }
}
</script>

<style>
</style>
