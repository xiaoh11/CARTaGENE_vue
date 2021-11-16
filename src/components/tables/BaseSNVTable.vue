<template>
<div class="child-component" v-on:click-annotations="showAnnotationsModal">
  <SNVTableModalAnnotation/>

  <div v-if="loading" class="d-flex align-items-center statusMessage statusMessage--zTop">
    <div class="spinner-border spinner-border-sm text-primary ml-auto" role="status" aria-hidden="true"></div>
    <strong>&nbsp;Loading...</strong>
  </div>
  <div v-if="loaded && empty" class="statusMessage statusMessage--zTop">
    No variants
  </div>
  <div v-if="failed" class="statusMessage statusMessage--zTop">
    Error while loading variants
  </div>

  <!-- table managed by Tabulator -->
  <div ref="snvtable" class="table-sm">
  </div>

</div>
</template>

<script>
import {TabulatorFull as Tabulator} from "tabulator-tables"

export default {
  name: "BaseSNVTable",
  inject: {
    chrom: {default: 0},
    start: {default: 0},
    stop: {default: 1},
  },
  props: {
    showCols: {
      type: Object,
      default: function(){
        return({
          colVariantID:   { title: "Variant ID", val: true},
          colRsID:        { title: "rsID", val: true},
          colConsequence: { title: "Consequence", val: true},
          colAnnotation:  { title: "Annotation", val: true},
          colLOFTEE:      { title: "LOFTEE", val: true},
          colQuality:     { title: "Quality", val: true},
          colCADD:        { title: "CADD", val: true},
          colNAlleles:    { title: "N Alleles", val: false},
          colHet:         { title: "Het", val: true},
          colHomAlt:      { title: "Hom Alt", val: true},
          colFrequency:   { title: "Frequency (%)", val: true}
        })
      }
    },
    filters: {
      type: Array,
      default: function() { return [] }
    }
  },
  data: function() {
    return {
      api: process.env.VUE_APP_BRAVO_API_URL,
      loading: false,
      loaded:  false,
      empty:   true,
      failed:  false,
      selectedVariantId: "",
      selectedVariantAnnotations: [],
      tabulator: null,
      hoveredRowPosition: null,
    }
  },
  computed: {
    // should be overridden by extending component
    ajaxUrl() { return(this.api) }
  },
  watch: {
    filters: function() {
      this.tabulator.setFilter(this.filters);
    }
  },
  methods:{
    getVisibleVariants: function() {
      let scrollDivHeight = this.tabulator.rowManager.height;
      let scrollDivPosition = this.tabulator.rowManager.scrollTop;
      let lastVisibleRowIndex = this.tabulator.rowManager.vDomBottom;
      let visibleRowsData = []
      while (lastVisibleRowIndex > 0) {
        const rowElement = this.tabulator.rowManager.displayRows[0][lastVisibleRowIndex].element;
        if (rowElement.offsetTop < scrollDivPosition + scrollDivHeight) {
          break;
        }
        lastVisibleRowIndex--;
      }
      let firstVisibleRowIndex = lastVisibleRowIndex;
      while (firstVisibleRowIndex > 0) {
        const rowElement = this.tabulator.rowManager.displayRows[0][firstVisibleRowIndex].element;
        if (rowElement.offsetTop < scrollDivPosition) {
          break;
        }
        firstVisibleRowIndex--;
      }
      if (this.tabulator.rowManager.displayRows[0].length > 0) {
        for (var i = firstVisibleRowIndex; i <= lastVisibleRowIndex; ++i) {
          visibleRowsData.push(this.tabulator.rowManager.displayRows[0][i].data);
        }
      }
      return { 
        firstRowIdx: firstVisibleRowIndex, 
        lastRowIdx:  lastVisibleRowIndex, 
        rowsData: visibleRowsData }
    },

    scrolled: function() {
      if (this.tabulator.getData().length > 0) {
        let visVars = this.getVisibleVariants();
        this.$emit("scroll", visVars.firstRowIdx, visVars.lastRowIdx, visVars.rowsData);
      }
    },

    hover: function(variant, hovered) {
      this.tabulator.getRows().forEach(r => { // clean up all elements (just in case)
        r.getElement().classList.remove("hover");
      });
      if (hovered) {
        this.tabulator.getRowFromPosition(variant).getElement().classList.add("hover");
      }
    },
    //fomerly ajaxError callback
    tblAjaxError: function() {
        this.loading = false;
        this.loaded = false;
        this.failed = true;
    },
    //fomerly dataLoaded callback
    tblDataLoaded: function(data){
      this.empty = data.length == 0;
    },
    //formerly renderComplete callback
    tblRenderComplete: function(){
      let visVars = this.getVisibleVariants();

      // make sure that row is hovered after re-rendering on mobile touch screen
      if (this.hoveredRowPosition != null) { 
        var row = this.tabulator.getRowFromPosition(this.hoveredRowPosition);
        row.getElement().classList.add('row-hovered');
      }
      this.$emit("scroll", visVars.firstRowIdx, visVars.lastRowIdx, visVars.rowsData);
    },
    //formerly enterMouseEnter callback
    tblRowMouseEnter: function(e, row) {
      // row was hovered from before and mouseleave was never called
      if ((this.hoveredRowPosition != null) && (this.hoveredRowPosition != row.getPosition())) { 
        var hoveredRow = this.tabulator.getRowFromPosition(this.hoveredRowPosition);
        hoveredRow.getElement().classList.remove('row-hovered');
        this.$emit("hover", hoveredRow.getPosition(), hoveredRow.getData(), false);
        this.hoveredRowPosition = null;
      }

      this.hoveredRowPosition = row.getPosition();
      row.getElement().classList.add('row-hovered');
      this.$emit("hover", row.getPosition(), row.getData(), true);
    },
    //formerly rowMouseLeave callback
    tblRowMouseLeave: function(e, row) {
      row.getElement().classList.remove('row-hovered');
      this.$emit("hover", row.getPosition(), row.getData(), false);
      this.hoveredRowPosition = null;
    },
    tblBuilt: function() {
      this.tabulator.setData()
    }
  },
  mounted: function() {
    this.tabulator = new Tabulator(this.$refs.snvtable, {
      placeholder: null,
      ajaxURL: this.ajaxUrl,
      dataLoader: false,
      dataLoaderLoading: "",
      dataLoaderError: "",
      ajaxConfig: {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
      },
      ajaxContentType: "json",
      sortMode: "remote",
      filterMode: "remote",
      progressiveLoad: "scroll",
      ajaxRequesting: () => {
        this.failed = false;
        this.loaded = false;
        this.loading = true;
        return true;
      },
      ajaxURLGenerator: (url, config, params) => {
        if (params.page == 1) { // when 1st page is requested "next" must be null
          params.next = null;

          if ((this.region.gene != null) && (this.region.segments.region.length > 2)) {
            // console.log("without introns");
            params.introns = 0;
          }
        }
        return url;
      },
      ajaxResponse: (url, params, response) => {
        response.last_page = Math.ceil(response.total / response.limit);
        params.next = response.next;
        this.failed = false;
        this.loading = false;
        this.loaded = true;
        return response;
      },
      paginationSize: this.paginationSize,
      height: "600px",
      layout: "fitColumns",
      columns: [
        {
          title: "Variant Id <a class='text-info' onclick='event.stopPropagation();' data-html='true' data-toggle='tooltip' title='chrom-position-ref-alt'>?</a>",
          titleDownload: "Variant Id",
          width: 130,
          field: "variant_id",
          visible: this.showCols.colVariantID,
          formatter: (cell) => { return `<a href='${this.api}/variant/snv/${cell.getValue()}'>${cell.getValue()}</a>`; }
        }
      ],
      initialSort: [ { column: "variant_id", dir: "asc" } ],
      initialFilter: this.filters
    })
    // register event handlers for the table
    this.tabulator.on("ajaxError", this.tblAjaxError)
    this.tabulator.on("dataLoaded", this.tblDataLoaded)
    this.tabulator.on("renderComplete", this.tblRenderComplete)
    this.tabulator.on("rowMouseEnter", this.tblRowMouseEnter)
    this.tabulator.on("rowMouseLeave", this.tblRowMouseLeave)
    this.tabulator.on("tableBuilt", this.tblBuilt)
  }
}
</script>
