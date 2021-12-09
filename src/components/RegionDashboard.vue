<template>
  <div id="bravo-plot"> 
    <p>RegionDashboard</p>
    <RegionInfo/>
    <div id="bravoviz">
      <div class="parent-menu">
        <ToggleList list-title="Panels" list-group="showPanels" :list-vars="showPanels"
          @varToggled="handleInfoViewToggle" :icon="panelsIcon"/>
        <ToggleList list-title="Columns" list-group="showCols" :list-vars="showCols"
          @varToggled="handleInfoViewToggle" :icon="columnsIcon"/>

        <!-- don't show download button on mobile devices i.e. devices with very small screens -->
        <div class="d-none d-sm-inline" style="display: inline-block;"> 
          <button type="button" class="parent-menu-button" v-on:click="download++">CSV
            <font-awesome-icon style="background-color: transparent; display: inline-block; vertical-align: middle" :icon="downloadIcon"></font-awesome-icon>
          </button>
        </div>
      </div>
      <div style="position: relative; min-height: 20px">
        <RegionSummaries v-if="showPanels.summaries.val" :filterArray='filterArray'
          @close="showPanels.summaries.val = false"/>
        <SeqDepth v-if="showPanels.seqDepth.val" @close="showPanels.seqDepth.val = false" 
          :hoveredVariant="hoveredVariant" :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"/>
        <GeneBars v-if="showPanels.genes.val" @close="showPanels.genes.val = false" 
          :hoveredVariant="hoveredVariant" :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"/>
        <SnvCount v-if="showPanels.snvCount.val" @close="showPanels.snvCount.val = false" 
          :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"
          :filters="filterArray" :visibleVariants="visibleVariants"/>
        <BpCoordBar :segmentBounds="segmentBounds" :segmentRegions="segmentRegions" 
          :givenWidth="childWidth" :givenMargins="childMargins" />
        <FilterBar @filterChange='handleFilterChange'/>
        <RegionSNVTable :filters="filterArray"/>
        <!--
        <summaries v-if="showSummaries" v-on:close="showSummaries = false"
          v-bind:api="api" v-bind:region="region" v-bind:filters="activeFilters"/>
        <depth v-if="showDepth" v-on:close="showDepth = false" v-bind:api="api"
          v-bind:region="region" v-bind:dimensions="dimensions"
          v-bind:hoveredVariant="hoveredVariant"/>
        <genes v-if="showGenes && !gene_view" v-on:close="showGenes = false"
          v-bind:region="region" v-bind:dimensions="dimensions"
          v-bind:hoveredVariant="hoveredVariant"
          v-on:click="genesClick" v-bind:api="api"/>
        <gene v-if="showGene && gene_view" v-on:close="showGene = false"
          v-bind:region="region" v-bind:dimensions="dimensions" 
          v-bind:hoveredVariant="hoveredVariant"/>
        <snv v-if="showSNV" v-on:close="showSNV = false" v-bind:api="api"
          v-bind:region="region" v-bind:dimensions="dimensions" 
          v-bind:filters="activeFilters" v-bind:visibleVariants="visibleVariants" 
          v-bind:hoveredVariant="hoveredVariant"/>
        <coordinates v-bind:region="region" v-bind:dimensions="dimensions"/>

        <snvfilter ref="filter"
          v-bind:suggestions="filterSuggestions"
          v-bind:filters="activeFilters"
          v-on:filter="onFilterChange"/>

        <snvtable ref="snvtable"
          v-on:suggestions="onFilterSuggestionsChange"
          v-on:scroll="variantsScroll"
          v-on:hover="variantHover"
          v-bind:region="region"
          v-bind:api="api"
          v-bind:filters="activeFilters"
          v-bind:paginationSize="paginationSize"
          v-bind:download="download"
          v-bind:showColumnVariantID="showColumnVariantID"
          v-bind:showColumnRsID="showColumnRsID"
          v-bind:showColumnConsequence="showColumnConsequence"
          v-bind:showColumnAnnotation="showColumnAnnotation"
          v-bind:showColumnLOFTEE="showColumnLOFTEE"
          v-bind:showColumnQuality="showColumnQuality"
          v-bind:showColumnCADD="showColumnCADD"
          v-bind:showColumnNAlleles="showColumnNAlleles"
          v-bind:showColumnHet="showColumnHet"
          v-bind:showColumHomAlt="showColumHomAlt"
          v-bind:showColumnFrequency="showColumnFrequency"/>
        -->
      </div>
      <pre>
        DEBUG
        chrom: {{chrom}}
        start: {{start}}
        stop: {{stop}}
        filterArray: {{filterArray}}
      </pre>
    </div>
  </div>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faWindowRestore, faDownload, faColumns } 
  from '@fortawesome/free-solid-svg-icons';
import RegionInfo      from '@/components/RegionInfo.vue'
import RegionSummaries from '@/components/RegionSummaries.vue'
import FilterBar       from '@/components/FilterBar.vue'
import ToggleList      from '@/components/ToggleList.vue'
import SeqDepth        from '@/components/SeqDepth.vue'
import GeneBars        from '@/components/GeneBars.vue'
import SnvCount        from '@/components/SnvCount.vue'
import BpCoordBar      from '@/components/BpCoordBar.vue'
import RegionSNVTable  from '@/components/tables/RegionSNVTable.vue'

export default {
  name: 'RegionDashboard',
  components: {
    FontAwesomeIcon,
    RegionInfo,
    RegionSummaries,
    FilterBar,
    ToggleList,
    SeqDepth,
    GeneBars,
    SnvCount,
    BpCoordBar,
    RegionSNVTable
  },
  inject: {
    chrom: {default: null},
    start: {default: null},
    stop: {default: null}
  },
  data: function(){
    return {
      panelsIcon: faWindowRestore,
      columnsIcon: faColumns,
      downloadIcon: faDownload,

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
      showColumnVariantID: true,
      showColumnRsID: true,
      showColumnConsequence: true,
      showColumnAnnotation: true,
      showColumnLOFTEE: true,
      showColumnQuality: true,
      showColumnCADD: true,
      showColumnNAlleles: false,
      showColumnHet: true,
      showColumHomAlt: true,
      showColumnFrequency: true,

      // keys are category of filter,
      // values are array of mongo-like filters.
      filter: {},
      

      //formerly dimensions.width
      //  width provided to child components.
      childWidth: 300,

      //formerly dimensions.margin
      // standard margins for child component calculations
      childMargins: {
        left:   40,
        right:  15,
        top:    12,
        bottom: 5
      },
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
      // bounds for child element displays in pixels
      //formerly region.segments.plot
      segmentBounds: [0, 300],
      // genomic bounds for child elements in base pairs
      //formergly region.segments.region
      segmentRegions: [this.start, this.stop],
    }
  },
  computed: {
    filterArray: function() {
      return(Object.values(this.filter).flat(1))
    },
  },
  methods: {
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
      this.filter[filterCategory] = filtArr
    },
    handleResize: function() {
      this.segmentBounds = [0, this.$el.clientWidth - this.childMargins.left - this.childMargins.right]
      this.childWidth = this.$el.clientWidth
    },
    handleInfoViewToggle: function(listGroup, varKey){
      this[listGroup][varKey].val = !this[listGroup][varKey].val
    },
  },
  mounted: function() {
    this.segmentBounds = [0, this.$el.clientWidth - this.childMargins.left - this.childMargins.right]
    this.childWidth = this.$el.clientWidth
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount: function() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
  .parent-menu {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    display: inline-block;
    font-size: 14px;
  }
  .parent-menu-button {
    outline: none;
    padding: 0px 7px 0px 7px;
    margin: 1px 1px 1px 1px;
    color: white;
    background-color: #007bff;
    border: 1px solid #007bff;
    border-radius: 2px;
    box-shadow: none;
  }
  .parent-menu-button:hover {
    background-color: #0062cc;
    border-color: #0062cc;
  }
  .parent-menu-dropdown {
    display: block;
    position: absolute;
    background-color: #eeeeee;
    min-width: 140px;
    overflow: auto;
    box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.2);
    border: 1px solid #cbcacb;
    z-index: 999;
  }
  .parent-menu-dropdown a {
    display: block;
    padding: 4px 2px;
    color: black;
    text-align: left;
    text-decoration: none;
  }
  .parent-menu-dropdown a:hover {
    background-color: #cccccc;
  }
</style>
