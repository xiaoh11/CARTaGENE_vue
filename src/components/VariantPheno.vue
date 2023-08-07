<!-- HX -->
<template>
    <div class="card shadow-sm">
      <div class="card-body">
        <!-- <div class="container-fluid" v-if="display_ukb">
          <div class="row">
            <div class="col-6 col-sm-7 text-left text-truncate">Nearest gene: <i>{{nearst_gene()}}</i></div>
          </div>
          <div class="row">
            <div class="col-6 col-sm-7 text-left text-truncate">View in <a :href="getUKB()">UK Biobink</a>, <a :href="getf5()">Freeze 5</a></div>
          </div>
          <br>
        </div> -->

        <div v-if="display_ukb && data_ukb">
          <div class="container-fluid" >
            <div class="row">
              <div class="col-12">
                <h5>PheWAS plot from <strong>UKBiobank TOPMed-imputed PheWeb</strong> (<a :href="getUKB()">view original</a>)</h5>
              </div>
            </div>
          </div>
          <div id="lz-plot"></div>
        </div>
        <div class="container-fluid" v-else-if="display_ukb">
          <div class="row">
            <div class="col-6 col-sm-7 text-left text-truncate">Currently no PheWAS information in <a :href="getUKB()">UKBiobank TOPMed-imputed PheWeb</a></div>
          </div>
        </div>
        <div class="container-fluid" v-else>
          <div class="row">
            <div class="col-6 col-sm-7 text-left text-truncate">Failed to connect FinnGen PheWAS FREEZE 5 (<a :href="getUKB()">view original</a>)</div>
          </div>
        </div>

        <div v-if="data_f5 && display_f5">
          <div class="container-fluid" >
            <div class="row">
              <div class="col-12">
                <h5>PheWAS plot from <strong>FinnGen PheWAS FREEZE 5</strong> (<a :href="getf5()">view original</a>)</h5>
              </div>
            </div>
          </div>
          <div id="lz-plot2"></div>
        </div>
        <div class="container-fluid" v-else-if="display_f5">
          <div class="row">
            <div class="col-6 col-sm-7 text-left text-truncate">Currently no PheWAS information in <a :href="getf5()">FinnGen PheWAS FREEZE 5</a></div>
          </div>
        </div>
        <div class="container-fluid" v-else>
          <div class="row">
            <div class="col-6 col-sm-7 text-left text-truncate">Failed to connect FinnGen PheWAS FREEZE 5 (<a :href="getf5()">view original</a>)</div>
          </div>
        </div>

      </div>
    </div>

    
</template>

<script>
import { faLaptopHouse } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import * as d3 from "d3";
import { flatGroup } from 'd3';
import LocusZoom from 'locuszoom';
import 'locuszoom/dist/locuszoom.css';

export default {
  name: 'VariantPheno',
  props: ['variant'],
  data() {
    return {
      api: process.env.VUE_APP_BRAVO_API_URL,
      variantData: null,
      data_ukb: true,
      data_f5: true,
      display_ukb: true,
      display_f5: true,
    };
  },
  methods: {
    getUKB() {
      return `https://pheweb.org/UKB-TOPMed/variant/${this.variant.variant_id}`;
    },
    getf5() {
      return `http://r5.finngen.fi/variant/${this.variant.variant_id}`;
    },
    nearst_gene() {
      axios.get(`${this.api}/tempdata/${this.variant.variant_id}`)
      .then(response => {
          const htmlContent = response.data;
          const varName = "window.variant";
          const matchedScripts = htmlContent.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
          if (matchedScripts) {
            for (let script of matchedScripts) {
              if (script.includes(varName)) {
                const match = script.match(new RegExp(`${varName} = (.*?\\});`));
                if (match && match[1]) {
                  this.variantData = JSON.parse(match[1]);
                  break;
                }
              }
            }
          };
        });
      if (this.variantData && this.variantData.nearest_genes){
            return this.variantData.nearest_genes
          }
    },
    generateLocusZoomPlot() {
      const data_sources = new LocusZoom.DataSources();
      const apiBase = 'https://portaldev.sph.umich.edu/api/v1/';
      axios.get(`${this.api}/tempdata_mod/UKB-TOPMed/${this.variant.variant_id}`)
      .then(response => {
        const data = response.data;
        if (!data || Object.keys(data).length === 0) {
          // Handle the case when data is empty or undefined
          console.log("no ukb data");
          this.data_ukb = false;
        } 
      })
      .catch(error => {
        console.log("no connection to ukb");
        console.log(error);
        this.display_ukb = false;
      });
      data_sources.add("phewas", ["PheWASLZ", {url: this.api + "/tempdata_mod/UKB-TOPMed/" + String(this.variant.variant_id), build: ['GRCh37']}])
            .add("gene", ["GeneLZ", { url: apiBase + "annotation/genes/", build: 'GRCh37' }])
            .add("constraint", ["GeneConstraintLZ", { url: "https://gnomad.broadinstitute.org/api/", build: 'GRCh37' }]);
      var mods = {
          state: {
            variant: this.variant.variant_id,
            start: this.variant.pos - 200000,
            end: this.variant.pos + 200000,
            chr: this.variant.chrom
          },
          panels: [
            LocusZoom.Layouts.get('panel', 'phewas', { height: 350 }),
            // LocusZoom.Layouts.get('panel', 'genes', { height: 225 })
          ]
        };
      var layout = LocusZoom.Layouts.get("plot", "standard_phewas", mods);
      const plot = LocusZoom.populate("#lz-plot", data_sources, layout);
    },
    generateLocusZoomPlot2() {
      const data_sources = new LocusZoom.DataSources();
      const apiBase = 'https://portaldev.sph.umich.edu/api/v1/';
      axios.get(`${this.api}/tempdata_mod/freeze5/${this.variant.variant_id}`)
      .then(response => {
        const data = response.data;
        if (!data || Object.keys(data).length === 0) {
          // Handle the case when data is empty or undefined
          console.log("no f5 data");
          this.data_f5 = false;
        } 
      })
      .catch(error => {
        console.log("no connection to f5");
        console.log(error);
        this.display_f5 = false;
      });
      data_sources.add("phewas", ["PheWASLZ", {url: this.api + "/tempdata_mod/freeze5/" + String(this.variant.variant_id), build: ['GRCh37']}])
            .add("gene", ["GeneLZ", { url: apiBase + "annotation/genes/", build: 'GRCh37' }])
            .add("constraint", ["GeneConstraintLZ", { url: "https://gnomad.broadinstitute.org/api/", build: 'GRCh37' }]);
      var mods = {
          state: {
            variant: this.variant.variant_id,
            start: this.variant.pos - 200000,
            end: this.variant.pos + 200000,
            chr: this.variant.chrom
          },
          panels: [
            LocusZoom.Layouts.get('panel', 'phewas', { height: 350 }),
            // LocusZoom.Layouts.get('panel', 'genes', { height: 225 })
          ]
        };
      var layout = LocusZoom.Layouts.get("plot", "standard_phewas", mods);
      const plot = LocusZoom.populate("#lz-plot2", data_sources, layout);
    },
  },
  mounted() {
    this.generateLocusZoomPlot();
    this.generateLocusZoomPlot2();
  },
};
</script>