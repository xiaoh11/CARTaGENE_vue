<template>
  <div id="bravo-plot"> 
    <p>GeneDashboard</p>
    <!--
    <GeneInfo/>
    -->
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
      <div style="position: relative; min-height: 20px">
        <!--
        <geneSummaries v-if="showPanels.summaries.val" :filterArray='filterArray'
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
        <GeneSNVTable :filters="filterArray" :doDownload="doDownload"/>
        -->
      </div>
      <pre>
        DEBUG
        gene: {{gene}}
        chrom: tbd
        start: tbd
        stop: tbd
        filterArray: {{filterArray}}
      </pre>
    </div>
  </div>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faWindowRestore, faDownload, faColumns } 
  from '@fortawesome/free-solid-svg-icons'
import clone from 'just-clone'
//import RegionInfo      from '@/components/RegionInfo.vue'
//import RegionSummaries from '@/components/RegionSummaries.vue'
import FilterBar       from '@/components/FilterBar.vue'
import ToggleList      from '@/components/ToggleList.vue'
import SeqDepth        from '@/components/SeqDepth.vue'
import GeneBars        from '@/components/GeneBars.vue'
import SnvCount        from '@/components/SnvCount.vue'
import BpCoordBar      from '@/components/BpCoordBar.vue'
//import RegionSNVTable  from '@/components/tables/RegionSNVTable.vue'

export default {
  name: 'GeneDashboard',
  components: {
    FontAwesomeIcon,
    //RegionInfo,
    //RegionSummaries,
    FilterBar,
    ToggleList,
    SeqDepth,
    GeneBars,
    SnvCount,
    BpCoordBar,
    //RegionSNVTable
  },
  inject: {
    gene: {default: null}
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
    }
  },
  computed: {
    filterArray: function() {
      return(Object.values(this.filter).flat(1))
    },
  },
  methods:{
    handleInfoViewToggle: function(listGroup, varKey){
      this[listGroup][varKey].val = !this[listGroup][varKey].val
    },
  }
}
</script>
