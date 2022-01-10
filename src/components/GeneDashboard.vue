<template>
  <div id="bravo-plot"> 
    <GeneInfo v-if="positionResolved" :geneData="geneData"/>
    <div id="bravoviz">
      <div class="parentMenu">
        <ToggleList list-title="Panels" list-group="showPanels" :list-vars="showPanels"
          @varToggled="handleInfoViewToggle" :icon="panelsIcon"/>
        <ToggleList list-title="Columns" list-group="showCols" :list-vars="showCols"
          @varToggled="handleInfoViewToggle" :icon="columnsIcon"/>

        <div class="d-none d-sm-inline" style="display: inline-block;"> 
          <button type="button" class="parentMenu__button" v-on:click="doDownload++">
            CSV
            <font-awesome-icon style="background-color: transparent; display: inline-block; vertical-align: middle" :icon="downloadIcon"></font-awesome-icon>
          </button>
        </div>
      </div>
      <div v-if="positionResolved" style="position: relative; min-height: 20px">
        <GeneSummary v-if="showPanels.summaries.val" :filterArray='filterArray'
          @close="showPanels.summaries.val = false"/>
        <SeqDepth v-if="showPanels.seqDepth.val" @close="showPanels.seqDepth.val = false" 
          :hoveredVariant="hoveredVariant" :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"/>

        <TranscriptBars v-if="showPanels.genes.val" @close="showPanels.genes.val = false" 
          :hoveredVariant="hoveredVariant" :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"
          :geneData="geneData"/>
        <!--
        <GeneBars v-if="showPanels.genes.val" @close="showPanels.genes.val = false" 
          :hoveredVariant="hoveredVariant" :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"/>
        -->

        <GeneSnvCount v-if="showPanels.snvCount.val" @close="showPanels.snvCount.val = false" 
          :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"
          :filters="filterArray" :visibleVariants="visibleVariants"/>
        <BpCoordBar :segmentBounds="segmentBounds" :segmentRegions="segmentRegions" 
          :givenWidth="childWidth" :givenMargins="childMargins" />
        <FilterBar @filterChange='handleFilterChange'/>
        <GeneSNVTable :filters="filterArray" :doDownload="doDownload"/>
      </div>
    </div>
  </div>
</template>

<script>

import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWindowRestore, faDownload, faColumns } 
  from '@fortawesome/free-solid-svg-icons'
import clone from 'just-clone'
import axios from 'axios'

import GeneInfo from '@/components/infoblock/GeneInfo.vue'
import GeneSummary    from '@/components/summary/GeneSummary.vue'
import FilterBar      from '@/components/FilterBar.vue'
import ToggleList     from '@/components/ToggleList.vue'
import SeqDepth       from '@/components/SeqDepth.vue'
import TranscriptBars from '@/components/TranscriptBars.vue'
import GeneSnvCount   from '@/components/histogram/GeneSnvCount.vue'
import BpCoordBar     from '@/components/BpCoordBar.vue'
import GeneSNVTable   from '@/components/table/GeneSNVTable.vue'

export default {
  name: 'GeneDashboard',
  components: {
    FontAwesomeIcon,
    GeneInfo,
    GeneSummary,
    FilterBar,
    ToggleList,
    SeqDepth,
    TranscriptBars,
    GeneSnvCount,
    BpCoordBar,
    GeneSNVTable
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
      },
      showCols: {
        variantID:      { title: "Variant ID", val: true},
        rsID:           { title: "rsID", val: true},
        consequence:    { title: "Consequence", val: true},
        annotation:     { title: "Annotation", val: true},
        LOFTEE:         { title: "LOFTEE", val: true},
        quality:        { title: "Quality", val: true},
        CADD:           { title: "CADD", val: true},
        nAlleles:       { title: "N Alleles", val: false},
        het:            { title: "Het", val: true},
        homAlt:         { title: "Hom Alt", val: true},
        frequency:      { title: "Frequency (%)", val: true}
      },
      showTableMenuDropDown: false,
      // keys are category of filter,
      // values are array of mongo-like filters.
      filter: {},
      // Payload data from loadGenes
      geneData: {},
      // Source of provides to child components.
      start: null,
      stop: null,
      chrom: null,
      ensemblId: "",

      // introns may not be needed as it's assumed for genes
      introns: false,
      segments: {},

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
      segmentBounds: [0, 300],

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
    segmentRegions: function() {
      // genomic bounds for child elements in base pairs
      return [this.start, this.stop]
    }
  },
  methods:{
    handleInfoViewToggle: function(listGroup, varKey){
      this[listGroup][varKey].val = !this[listGroup][varKey].val
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
    handleResize: function() {
      this.segmentBounds = [0, this.$el.clientWidth - this.childMargins.left - this.childMargins.right]
      this.childWidth = this.$el.clientWidth
    },
    unwindGeneExons: function (gene) {
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
    loadGene: function() {
      axios
        .get(`${this.api}/genes/api/${this.geneId}`)
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
                this.introns = true
              }
            })
          }
        })
    },
  },
  mounted: function() {
    this.loadGene()

    this.segmentBounds = [0, this.$el.clientWidth - this.childMargins.left - this.childMargins.right]
    this.childWidth = this.$el.clientWidth
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount: function() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
