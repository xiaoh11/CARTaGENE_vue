<template>
  <div id="bravo-plot"> 
    <!-- HX: <p>RegionDashboard</p> -->
    <RegionInfo/>
    <div id="bravoviz">
      <div class="parentMenu">
        <ToggleList list-title="Panels" list-group="showPanels" :list-vars="showPanels"
          @varToggled="handleInfoViewToggle" :icon="panelsIcon"/>
        <ToggleList list-title="Columns" list-group="showCols" :list-vars="showCols"
          @varToggled="handleInfoViewToggle" :icon="columnsIcon"/>

        <!-- don't show download button on mobile devices i.e. devices with very small screens -->
        <div class="d-none d-sm-inline" style="display: inline-block;"> 
          <button type="button" class="parentMenu__button" v-on:click="doDownload++">CSV
            <font-awesome-icon style="background-color: transparent; display: inline-block; vertical-align: middle" :icon="downloadIcon"></font-awesome-icon>
          </button>
        </div>
      </div>
      <div style="position: relative; min-height: 20px">
        <RegionSummaries v-if="showPanels.summaries.val" :filterArray='filterArray'
          @close="showPanels.summaries.val = false"/>
        <SeqDepth v-if="showPanels.seqDepth.val" @close="showPanels.seqDepth.val = false" 
          :hoveredVarPosition="hoveredVarPosition" :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"/>
        <br>
        <GeneBars v-if="showPanels.genes.val" @close="showPanels.genes.val = false" 
          :hoveredVarPosition="hoveredVarPosition" :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"/>
        <br>
        <RegionSnvCount v-if="showPanels.snvCount.val" @close="showPanels.snvCount.val = false" 
          :segmentBounds="segmentBounds" 
          :hoveredVarPosition="hoveredVarPosition"
          :segmentRegions="segmentRegions" :givenWidth="childWidth" :givenMargins="childMargins"
          :filters="filterArray" :visibleVariants="visibleVariants"/>
        <br>
        <ClinVarSig
          v-if="showPanels.clinvar.val"
          @close="showPanels.clinvar.val = false"
          :hoveredVarPosition="hoveredVarPosition" 
          :segmentBounds="segmentBounds" 
          :segmentRegions="segmentRegions" 
          :givenWidth="childWidth" 
          :givenMargins="childMargins"
        />
        <BpCoordBar :segmentBounds="segmentBounds" :segmentRegions="segmentRegions" 
          :givenWidth="childWidth" :givenMargins="childMargins" />
        <br>
        <FilterBar @filterChange='handleFilterChange'/>
        <RegionSNVTable
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
import { faWindowRestore, faDownload, faColumns } 
  from '@fortawesome/free-solid-svg-icons'
import clone from 'just-clone'
import RegionInfo      from '@/components/infoblock/RegionInfo.vue'
import RegionSummaries from '@/components/summary/RegionSummaries.vue'
import FilterBar       from '@/components/FilterBar.vue'
import ToggleList      from '@/components/ToggleList.vue'
import SeqDepth        from '@/components/SeqDepth.vue'
import GeneBars        from '@/components/GeneBars.vue'
import RegionSnvCount  from '@/components/histogram/RegionSnvCount.vue'
import BpCoordBar      from '@/components/BpCoordBar.vue'
import RegionSNVTable  from '@/components/table/RegionSNVTable.vue'
import SNVTableAnnotationModal   from '@/components/table/SNVTableAnnotationModal.vue'
import ClinVarSig       from '@/components/ClinVarSigPlotRegion.vue'

export default {
  name: 'RegionDashboard',
  components: {
    FontAwesomeIcon,
    RegionInfo,
    RegionSummaries,
    FilterBar,
    ToggleList,
    SeqDepth,
    ClinVarSig,
    GeneBars,
    RegionSnvCount,
    BpCoordBar,
    RegionSNVTable,
    SNVTableAnnotationModal
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
      doDownload: 0,

      showPanels: {
        summaries: {title: "Summary", val: true},
        seqDepth:  {title: "Avg. Depth", val: true},
        genes:     {title: "Genes", val: true},
        snvCount:  {title: "Variants Count", val: true},
        clinvar:   {title: "ClinVar ", val: true},
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

      },
      // showCols: {
      //   variantID:      { title: "Variant ID", val: true},
      //   rsID:           { title: "rsID", val: true},
      //   consequence:    { title: "Consequence", val: true},
      //   annotation:     { title: "Annotation", val: true},
      //   LOFTEE:         { title: "LOFTEE", val: true},
      //   quality:        { title: "Quality", val: true},
      //   CADD:           { title: "CADD", val: true},
      //   nAlleles:       { title: "N Alleles", val: false},
      //   het:            { title: "Het", val: true},
      //   homAlt:         { title: "Hom Alt", val: true},
      //   frequency:      { title: "Frequency (%)", val: true},
      //   freq_pop:       { title: "Frequency per population %", field: "allele_pop_freq", val: true}, //HX
      // },
      showTableMenuDropDown: false,
      showModal: false,
      modalData: {},

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
      // genomic position of variant under the mouse in the table.
      hoveredVarPosition: null,

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
    handleOpenModal: function(rowData){ 
      this.modalData = rowData
      this.showModal = true
    },
    handleCloseModal: function(){ 
      this.showModal = false }
    ,
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
      // Handle API's region specific names for annotation and loftee
      if(filterCategory === 'annotation'){
        filtArr.forEach( e => e.field = 'annotation.region.consequence')
      }
      if(filterCategory === 'loftee'){
        filtArr.forEach( e => e.field = 'annotation.region.lof')
      }

      this.filter[filterCategory] = filtArr
    },
    handleResize: function() {
      this.segmentBounds = [0, this.$el.clientWidth - this.childMargins.left - this.childMargins.right]
      this.childWidth = this.$el.clientWidth
    },
    handleInfoViewToggle: function(listGroup, varKey){
      this[listGroup][varKey].val = !this[listGroup][varKey].val
      if (listGroup === 'showCols') {
        for (let key in this.showCols) {
          console.log(`Column: ${key}, Value: ${this.showCols[key].val}`);
        }
      }
    },
    handleTableScroll: function(start_idx, end_idx, rows_data){
      this.visibleVariants = { 
        start_index: start_idx,
        stop_index: end_idx,
        data: rows_data}
    },
    handleTableHover: function(idx, data, hovered){
      this.hoveredVarPosition = data.pos
    },
  },
  mounted: function() {
    this.segmentBounds = [0, this.$el.clientWidth - this.childMargins.left - this.childMargins.right]
    this.childWidth = this.$el.clientWidth
    console.log(this.start, this.stop)
    // this.segmentRegions = [this.start, this.stop]
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount: function() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>
