<template>
  <p>RegionDashboard</p>
  <RegionInfo/>

  <!--
  <info v-bind:region="region" v-on:goto_region="redirectToRegion"/>
  -->
  <div id="bravoviz">
    <div class="parent-menu">
      <div style="display: inline-block;">
        <button class="parent-menu-button" v-on:click="showMenuDropDown = !showMenuDropDown">
          Panels <font-awesome-icon style="background-color: transparent; display: inline-block; vertical-align: middle" :icon="panelsIcon"></font-awesome-icon>
        </button>
        <div v-if="showMenuDropDown" class="parent-menu-dropdown">
          <div>
            <a href="#" v-on:click.prevent="togglePanelAttr('showSummaries')">
              <div v-bind:style="onOffStyle(showSummaries)">&#10004;</div>
              Summary
            </a>
          </div>
          <div>
            <a href="#" v-on:click.prevent="togglePanelAttr('showDepth')">
              <div v-bind:style="onOffStyle(showDepth)">&#10004;</div>
              Avg. Depth
            </a>
          </div>
            <a href="#" v-on:click.prevent="togglePanelAttr('showGenes')">
              <div v-bind:style="onOffStyle(showGenes)">&#10004;</div>
              Genes
            </a>
          <div>
            <a href="#" v-on:click.prevent="togglePanelAttr('showSNV')">
              <div v-bind:style="onOffStyle(showSNV)">&#10004;</div>
              Variants Count
            </a>
          </div>
        </div>
      </div>
      <div style="display: inline-block;">
        <button class="parent-menu-button" v-on:click="showTableMenuDropDown = !showTableMenuDropDown">
          Columns <font-awesome-icon style="background-color: transparent; display: inline-block; vertical-align: middle" :icon="columnsIcon"></font-awesome-icon>
        </button>
        <div v-if="showTableMenuDropDown" class="parent-menu-dropdown">
          <div>
            <a href="#" v-on:click.prevent="toggleColAttr('showColumnVariantID')">
              <div v-bind:style="onOffStyle(showColumnVariantID)">&#10004;</div>
              Variant ID
            </a>
          </div>
          <div>
            <a href="#" v-on:click.prevent="toggleColAttr('showColumnRsID')">
              <div v-bind:style="onOffStyle(showColumnRsID)">&#10004;</div>
              rsID
            </a>
          </div>
          <div>
            <a href="#" v-on:click.prevent="toggleColAttr('showColumnConsequence')">
              <div v-bind:style="onOffStyle(showColumnConsequence)">&#10004;</div>
              Consequence
            </a>
          </div>
          <div>
            <a href="#" v-on:click.prevent="toggleColAttr('showColumnAnnotation')">
              <div v-bind:style="onOffStyle(showColumnAnnotation)">&#10004;</div>
              Annotation
            </a>
          </div>
          <div>
            <a href="#" v-on:click.prevent="toggleColAttr('showColumnLOFTEE')">
              <div v-bind:style="onOffStyle(showColumnLOFTEE)">&#10004;</div>
              LOFTEE
            </a>
          </div>
          <div>
            <a href="#" v-on:click.prevent="toggleColAttr('showColumnQuality')">
              <div v-bind:style="onOffStyle(showColumnQuality)">&#10004;</div>
              Quality
            </a>
          </div>
          <div>
            <a href="#" v-on:click.prevent="toggleColAttr('showColumnCADD')">
              <div v-bind:style="onOffStyle(showColumnCADD)">&#10004;</div>
              CADD
            </a>
          </div>
          <div>
            <a href="#" v-on:click.prevent="toggleColAttr('showColumnNAlleles')">
              <div v-bind:style="onOffStyle(showColumnNAlleles)">&#10004;</div>
              N Alleles
            </a>
          </div>
          <div>
            <a href="#" v-on:click.prevent="toggleColAttr('showColumnHet')">
              <div v-bind:style="onOffStyle(showColumnHet)">&#10004;</div>
              Het
            </a>
          </div>
          <div>
            <a href="#" v-on:click.prevent="toggleColAttr('showColumHomAlt')">
              <div v-bind:style="onOffStyle(showColumHomAlt)">&#10004;</div>
              HomAlt
            </a>
          </div>
          <div>
            <a href="#" v-on:click.prevent="toggleColAttr('showColumnFrequency')">
              <div v-bind:style="onOffStyle(showColumnFrequency)">&#10004;</div>
              Frequency (%)
            </a>
          </div>
        </div>
      </div>
      <!-- don't show download button on mobile devices i.e. devices with very small screens -->
      <div class="d-none d-sm-inline" style="display: inline-block;"> 
        <button type="button" class="parent-menu-button" v-on:click="download++">CSV
          <font-awesome-icon style="background-color: transparent; display: inline-block; vertical-align: middle" :icon="downloadIcon"></font-awesome-icon>
        </button>
      </div>
    </div>
    <div style="position: relative; min-height: 20px">
      <FilterBar/>
      <!--
      <summaries v-if="showSummaries" v-on:close="showSummaries = false"
        v-bind:api="api" v-bind:region="region" v-bind:filters="activeFilters"/>
      <depth v-if="showDepth" v-on:close="showDepth = false" v-bind:api="api"
        v-bind:region="region" v-bind:dimensions="dimensions"
        v-bind:hoveredVariant="hoveredVariant"/>
      <genes v-if="showGenes && !gene_view" v-on:close="showGenes = false"
        v-on:click="genesClick" v-bind:api="api" v-bind:region="region"
        v-bind:dimensions="dimensions" v-bind:hoveredVariant="hoveredVariant"/>
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
    </pre>
  </div>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faWindowRestore, faEyeSlash, faEye, faDownload, faColumns } 
  from '@fortawesome/free-solid-svg-icons';
import RegionInfo from '@/components/RegionInfo.vue'
import FilterBar from '@/components/FilterBar.vue'

export default {
  name: 'RegionDashboard',
  components: {
    FontAwesomeIcon,
    RegionInfo,
    FilterBar
  },
  props: {
  },
  inject: {
    chrom: {default: null},
    start: {default: null},
    stop: {default: null}
  },
  data: function(){
    return {
      showSummaries: true,
      showDepth: true,
      showGenes: true,
      showSNV: true,
      showMenuDropDown: false,
      showIntrons: true,

      panelsIcon: faWindowRestore,
      columnsIcon: faColumns,
      hideIntronsIcon: faEyeSlash,
      showIntronsIcon: faEye,
      downloadIcon: faDownload,

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
    }
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
