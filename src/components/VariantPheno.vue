<!-- HX -->
<template>
    <div class="card shadow-sm">
      <div>
        <!-- <iframe :src="getPheWeb()" width="100%" height="600"></iframe> -->
      </div>
    </div>
  </template>

<script>
import axios from 'axios';
import * as d3 from "d3";
import LocusZoom from 'locuszoom';
import 'locuszoom/dist/locuszoom.css';

export default {
  name: 'VariantPheno',
  props: ['variant'],
  data() {
    return {
      api: process.env.VUE_APP_BRAVO_API_URL,
      variantData: null,
    };
  },
  methods: {
    getPheWeb(){
      return `${this.api}/tempdata/${this.variant.variant_id}`;
      // return `https://pheweb.org/UKB-TOPMed/variant/${this.variant.variant_id}`;
    },
    getVariantData() {
      axios.get(`${this.api}/tempdata/${this.variant.variant_id}`)
      .then(response => {
          // this.variantData = response.data;
          // console.log("here!");
          // console.log(response.data);
          const htmlContent = response.data;
          const varName = "window.variant";
          const matchedScripts = htmlContent.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);
          // console.log(matchedScripts);
          if (matchedScripts) {
            for (let script of matchedScripts) {
              if (script.includes(varName)) {
                // console.log("yes");
                // console.log(script);
                const match = script.match(new RegExp(`${varName} = (.*?\\});`));
                if (match && match[1]) {
                  // console.log(match[1]);
                  this.variantData = JSON.parse(match[1]);
                  // this.variantData = match[1];
                  // console.log("Yeah!");
                  // console.log(this.variantData);
                  // console.log(this.variantData.type);
                  break;
                }
              }
            }
          };
          this.generateLocusZoomPlot();
        })
      .catch(error => {
          console.log("no good");
          console.log(error);
        });
    },
    convertToLocusZoomFormat(data) {
        let result = {
            data: [],
            lastPage: null,
            meta: { build: ["GRCh38"] } 
        };
        let recordID = 1; 

        for (let pheno of data.phenos) {
          result.data.push({
              beta: pheno.beta,
              chromosome: data.chrom,
              position: data.pos,
              id: recordID,
              ref_allele: data.ref,
              variant: data.variant_name,
              log_pvalue: -Math.log10(pheno.pval), 
              trait_group: pheno.category, 
              trait: pheno.phenocode,
              trait_label: pheno.phenostring,
              // what is id?
              // ... 
          });
          recordID++;
        }

        return result;
    },
    generateLocusZoomPlot() {
      const data_sources = new LocusZoom.DataSources();
      const locusZoomData = this.convertToLocusZoomFormat(this.variantData);
      console.log(locusZoomData);
      console.log(JSON.stringify(locusZoomData));
      console.log(LocusZoom.Layouts.list());
      // // data_sources.add("phewas", ["StaticJSON", locusZoomData]);
      // data_sources.add("phewas", ["PheWASLZ", locusZoomData]);
      console.log(data_sources);
      

      // const layout = {
      //   width: 800,
      //   panels: [
      //     {
      //       id : "association",
      //       height: 300,
      //       data_layers: [
      //         {
      //           id: "association",
      //           type: "scatter",
      //           x_axis: { field: "assoc:position" },
      //           y_axis: { field: "assoc:log_pvalue" }
      //         }
      //       ]
      //     }
      //   ]
      // };
      var mods = {
          state: {
            variant: this.variantData.variant_name,
            start: this.variantData.pos - 250000,
            end: this.variantData.pos + 250000,
            chr: this.variantData.chrom
          }
        };
      var layout = LocusZoom.Layouts.get("plot", "standard_phewas", mods);
      const plot = LocusZoom.populate("plot", data_sources, layout);
    },
  },
  mounted() {
    this.getVariantData();
    // this.generateLocusZoomPlot();
    // this.convertToLocusZoomFormat();
  },
};
</script>