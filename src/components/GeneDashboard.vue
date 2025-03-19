<template>
  <div id="bravo-plot"> 
    <GeneInfo v-if="positionResolved" :geneData="geneData"/>
    <div id="bravoviz">
      <div class="parentMenu">
        <ToggleList list-title="Panels" list-group="showPanels" :list-vars="showPanels"
          @varToggled="handleInfoViewToggle" :icon="panelsIcon"/>
        <ToggleList list-title="Columns" list-group="showCols" :list-vars="showCols"
          @varToggled="handleInfoViewToggle" :icon="columnsIcon"/>

        <div style="display: inline-block;">
          <button v-if="gene_view" type="button" class="parentMenu__button" v-on:click="toggleIntrons()">
            <div v-if="showIntrons">
              Introns 
              <font-awesome-icon style="background-color: transparent; display: inline-block; vertical-align: middle" :icon="showIntronsIcon">
              </font-awesome-icon>
            </div>
            <div v-else>
              Introns 
              <font-awesome-icon style="background-color: transparent; display: inline-block; vertical-align: middle" :icon="hideIntronsIcon">
              </font-awesome-icon>
            </div>
          </button>
        </div>

        <div class="d-none d-sm-inline" style="display: inline-block;"> 
          <button type="button" class="parentMenu__button" v-on:click="doDownload++">
            CSV
            <font-awesome-icon style="background-color: transparent; display: inline-block; vertical-align: middle" :icon="downloadIcon"></font-awesome-icon>
          </button>
        </div>
      </div>
      <div v-if="positionResolved" style="position: relative; min-height: 20px">
        <GeneSummary v-if="showPanels.summaries.val" :filterArray='filterArray'
          :introns="introns"
          @close="showPanels.summaries.val = false"/>
        <SeqDepth v-if="showPanels.seqDepth.val" @close="showPanels.seqDepth.val = false" 
          :hoveredVarPosition="hoveredVarPosition" :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"/>
        <br>
        
        <TranscriptBars v-if="showPanels.genes.val" @close="showPanels.genes.val = false" 
          :hoveredVarPosition="hoveredVarPosition" :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"
          :geneData="geneData"/>
        <br>
        <GeneSnvCount v-if="showPanels.snvCount.val" @close="showPanels.snvCount.val = false" 
          :hoveredVarPosition="hoveredVarPosition"
          :segmentBounds="segmentBounds" 
          :includeIntrons="introns"
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"
          :filters="filterArray" :visibleVariants="visibleVariants"/>
        <br>
        <ClinVarSigPlot 
          v-if="showPanels.clinvar.val"
          @close="showPanels.clinvar.val = false"
          :hoveredVarPosition="hoveredVarPosition" 
          :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" 
          :givenWidth="childWidth" 
          :givenMargins="childMargins"/>
        <BpCoordBar :segmentBounds="segmentBounds" :segmentRegions="segmentRegions" 
          :givenWidth="childWidth" :givenMargins="childMargins" />
        <br>

        <FilterBar @filterChange='handleFilterChange'/>
        <!-- HX -->
        <GeneSNVTable 
          :geneData="geneData"
          :introns="introns"
          :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions"
          :show-cols="showCols" 
          :filters="filterArray" :doDownload="doDownload"
          @scroll='handleTableScroll' @hover='handleTableHover' 
          @openModal="handleOpenModal"/>
      </div>
    </div>
    <SNVTableAnnotationModal :showModal="showModal" :rowData="modalData" @closeModal="handleCloseModal"/>
  </div>
</template>

<script>

import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWindowRestore, faDownload, faColumns, faEyeSlash, faEye } 
  from '@fortawesome/free-solid-svg-icons'
import clone from 'just-clone'
import axios from 'axios'
axios.defaults.withCredentials=true

import GeneInfo from '@/components/infoblock/GeneInfo.vue'
import GeneSummary    from '@/components/summary/GeneSummary.vue'
import FilterBar      from '@/components/FilterBar.vue'
import ToggleList     from '@/components/ToggleList.vue'
import SeqDepth       from '@/components/SeqDepth.vue'
import ClinVarSigPlot from '@/components/ClinVarSigPlot.vue'
import TranscriptBars from '@/components/TranscriptBars.vue'
import GeneSnvCount   from '@/components/histogram/GeneSnvCount.vue'
import BpCoordBar     from '@/components/BpCoordBar.vue'
import GeneSNVTable   from '@/components/table/GeneSNVTable.vue'
import SNVTableAnnotationModal   from '@/components/table/SNVTableAnnotationModal.vue'

export default {
  name: 'GeneDashboard',
  components: {
    FontAwesomeIcon,
    GeneInfo,
    GeneSummary,
    FilterBar,
    ToggleList,
    SeqDepth,
    ClinVarSigPlot,
    TranscriptBars,
    GeneSnvCount,
    BpCoordBar,
    GeneSNVTable,
    SNVTableAnnotationModal
  },
  inject: {
    geneId: {default: null}
  },
  provide: function() {
    return {
      // Wrap provided vals to make them reactive.
      chrom: computed( () => this.chrom),
      start: computed( () => this.start),
      stop: computed( () => this.stop),
      ensemblId: computed( () => this.ensemblId),
    }
  },
  data: function(){
    return {
      api: process.env.VUE_APP_BRAVO_API_URL,
      panelsIcon: faWindowRestore,
      columnsIcon: faColumns,
      downloadIcon: faDownload,
      doDownload: 0,
      showPanels: {
        summaries: {title: "Summary", val: true},
        seqDepth:  {title: "Avg. Depth", val: true},
        genes:     {title: "Genes", val: true},
        snvCount:  {title: "Variants Count", val: true},
        clinvar:   {title: "ClinVar Significance", val: true},
      },
      showCols: {
        variantID:      { title: "Variant ID", field: "variant_id", val: true},
        rsID:           { title: "rsID", field: "rsids", val: true},
        consequence:    { title: "Consequence", field: "annotation.gene.hgvs", val: true},
        annotation:     { title: "Annotation",field: "annotation.gene.consequence", val: true},
        LOFTEE:         { title: "LOFTEE", field: "annotation.gene.lof", val: true},
        quality:        { title: "Quality", field: "filter", val: true},
        freq_missing:   { title: "Missing Frequency", field: "freq_missing", val: true},
        CADD:           { title: "CADD", field: "cadd_phred", val: true},
        nAlleles:       { title: "N Alleles", field: "allele_num", val: false},
        het:            { title: "Het", field: "het_count", val: true},
        homAlt:         { title: "Hom Alt", field: "hom_count", val: true},
        frequency:      { title: "Frequency (%)", field: "allele_freq", val: true},
        freq_pop:       { title: "Frequency per population %", field: "allele_pop_freq", val: true}, //HX
        clinvar:        {title: "ClinVar", field: "ClinVar", val: true}
      },
      
      showTableMenuDropDown: false,
      showModal: false,
      modalData: {},
      // keys are category of filter,
      // values are array of mongo-like filters.
      filter: {},
      // Payload data from loadGenes
      geneData: {}, //HX: region.gene
      // Source of provides to child components.
      start: null, //HX: region.regionStart
      stop: null, //HX: region.regionStop
      chrom: null, //HX: region.regionChrom
      ensemblId: "",

      // introns may not be needed as it's assumed for genes
      introns: true, //HX: region.intron
      showIntrons: true,
      hideIntronsIcon: faEyeSlash,
      showIntronsIcon: faEye,

      //formerly dimensions.width
      //  width passed to child components.
      childWidth: 300,
      //formerly dimensions.margin
      // standard margins for child component calculations
      childMargins: {
        left:   40,
        right:  15,
        top:    12,
        bottom: 5
      },
      // bounds for child element displays in pixels
      //formerly region.segments.plot

      segmentRegions: [this.start, this.stop], //HX region.segments.region
      segmentBounds: [0, 300], //HX region.segments.plot
      

      // genomic position of variant under the mouse in the table.
      hoveredVarPosition: null,

      // which variant is selected by the user.
      hoveredVariant: {
        index: null,
        data: null,
        hovered: null
      },
      // which variants are appearing in the variants table.
      visibleVariants: {
        start_index: null,
        stop_index: null,
        data: null
      },
    }
  },
  computed: {
    filterArray: function() {
      return(Object.values(this.filter).flat(1))
    },
    positionResolved: function() {
      return( this.chrom && this.start && this.stop )
    },
    gene_view() {
      return (this.geneId != null);
    }
  },
  methods:{
    handleOpenModal: function(rowData){ 
      this.modalData = rowData
      this.showModal = true
    },
    handleCloseModal: function(){ 
      this.showModal = false }
    ,
    //HX
    handleInfoViewToggle: function(listGroup, varKey){
      this[listGroup][varKey].val = !this[listGroup][varKey].val
      if (listGroup === 'showCols') {
        for (let key in this.showCols) {
        }
      }
    },
    togglePanelAttr: function(attrName) {
      this[attrName] = !this[attrName]
      this.showMenuDropDown = !this.showMenuDropDown
    },
    toggleColAttr: function(attrName) {
      this[attrName] = !this[attrName]
      this.showTableMenuDropDown = !this.showTableMenuDropDown
    },
    onOffStyle: function(boolVar){
      return boolVar ? 'display: inline;' : 'display: inline; visibility: hidden;'
    },
    handleFilterChange: function(filterCategory, filtArr){
      // Handle API's gene specific names for annotation and loftee
      if(filterCategory === 'annotation'){
        filtArr.forEach( e => e.field = 'annotation.gene.consequence')
      }
      if(filterCategory === 'loftee'){
        filtArr.forEach( e => e.field = 'annotation.gene.lof')
      }

      this.filter[filterCategory] = filtArr
    },

    //HX
    handleResize: function() {
      this.childWidth = this.$el.clientWidth;
      this.domain2range(this.showIntrons);
      this.segmentBounds = [0, this.childWidth-this.childMargins.left-this.childMargins.right];
      // this.segmentBounds = [0, this.$el.clientWidth - this.childMargins.left - this.childMargins.right]
      // this.childWidth = this.$el.clientWidth
    },
    handleTableScroll: function(start_idx, end_idx, rows_data){
      this.visibleVariants = { 
        start_index: start_idx,
        stop_index: end_idx,
        data: rows_data}
    },
    handleTableHover: function(idx, data, hovered){
      this.hoveredVarPosition = data.pos
      // console.log(this.hoveredVarPosition)
    },
    unwindGeneExons: function (gene) {
      // console.log("unwindGeneExons is called");
      gene.exons = [];
      gene.cds = [];
      gene.coding_regions = [];
      gene.features.sort((a, b) => a.start - b.start);
      gene.features.forEach(d => {
        if (d.feature_type == 'exon') {
          d.transcript_type = gene.transcripts.find(t => t.transcript_id == d.transcript_id).transcript_type;
          gene.exons.push(d);
        } else if (d.feature_type == 'CDS'){
          d.transcript_type = gene.transcripts.find(t => t.transcript_id == d.transcript_id).transcript_type;
          gene.cds.push(d);
        }
      });
      gene.exons.forEach(d => {
        if (gene.coding_regions.length == 0) {
          gene.coding_regions.push([d.start, d.stop]);
        } else {
          let last = gene.coding_regions[gene.coding_regions.length - 1];
          if (last[1] >= d.start) {
            if (last[1] < d.stop) {
              last[1] = d.stop;
            }
          } else {
            gene.coding_regions.push([d.start, d.stop]);
          }
        }
      });
    },
    //HX
    domain2range: function(show_introns) {
      if (!show_introns) {
        const gap_width = 5; // 5 pixels for a gap between axis breaks
        const range_width = this.childWidth - this.childMargins.left - this.childMargins.right - (this.geneData.coding_regions.length - 1) * gap_width;
        const domain_width = this.geneData.coding_regions.reduce((length, region) => length + region[1] - region[0] + 1, 0);
        var domain = [];
        var range = [];
        this.geneData.coding_regions.forEach((region, i) => {
          domain.push(region[0]);
          domain.push(region[1]);
          if (i == 0) {
            range.push(0);
            range.push(Math.floor(range_width * (region[1] - region[0]) / domain_width));
          } else if (i == this.geneData.coding_regions.length - 1) {
            range.push(range[range.length - 1] + gap_width);
            range.push(this.childWidth - this.childMargins.left - this.childMargins.right);
          } else {
            range.push(range[range.length - 1] + gap_width);
            range.push(range[range.length - 1] + Math.floor(range_width * (region[1] - region[0]) / domain_width));
          }
        });
        this.introns = false;
        this.segmentRegions = domain;
        this.segmentBounds = range;
      } else {
        this.introns = true;
        this.segmentRegions = [this.start, this.stop];
        this.segmentBounds = [0, this.childWidth - this.childMargins.left - this.childMargins.right];
      }
    },
    loadGene: function() {
      axios
        .get(`${this.api}/genes/api/${this.geneId}`, {withCredentials: true})
        .then( response => {
          let payload = response.data
          if (payload.data.length > 0) {
            payload.data.forEach(d => {
              if ((d.gene_name === this.geneId) || (d.gene_id === this.geneId)) {

                // modify data in place
                this.unwindGeneExons(d);

                // set component data
                this.ensemblId = d.gene_id
                this.chrom = d.chrom
                this.start = d.start
                this.stop = d.stop
                this.geneData = d
                // console.log(this.geneData)
                this.introns = true
                // HX
                this.segmentRegions = [d.start, d.stop]
                this.segmentBounds = [0, this.childWidth-this.childMargins.left-this.childMargins.right]
              }
            })
          }
        })
    },
    toggleIntrons() {
      this.domain2range(!this.showIntrons);
      this.showIntrons = !this.showIntrons;
    },
  },
  mounted: function() {
    this.childWidth = this.$el.clientWidth
    if (this.gene_view) {
      this.loadGene();
    } else {
      this.segmentBounds = [0, this.childWidth-this.childMargins.left-this.childMargins.right]
    }
    // this.loadGene()
    // this.segmentBounds = [0, this.$el.clientWidth - this.childMargins.left - this.childMargins.right]
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount: function() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
