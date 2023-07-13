<template>
<div class="child-component" v-on:click-annotations="showAnnotationsModal">

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
//import {TabulatorFull as Tabulator} from "tabulator-tables"
import Tabulator from 'tabulator-tables'
import 'tabulator-tables/dist/css/bootstrap/tabulator_bootstrap4.min.css';//HX
import axios from "axios" //HX
import 'bootstrap/dist/css/bootstrap.css';//HX
import 'bootstrap/dist/js/bootstrap.js';//HX
import $ from 'jquery';
import 'bootstrap';

export default {
  name: "BaseSNVTable",
  inject: {
    chrom: {default: 0},
    start: {default: 0},
    stop: {default: 1},
  },
  emits: ["hover", "scroll"],
  props: {
    segmentRegions: {
      type: Array,
      default: function(){return [100000, 101000]},
    },
    introns: {
      type: Boolean,
      default: function(){return true},
    },
    showCols: {
      type: Object,
      default: function(){
        return({
          variantID:   {val: true},
          rsID:        {val: true},
          consequence: {val: true},
          annotation:  {val: true},
          LOFTEE:      {val: true},
          quality:     {val: true},
          CADD:        {val: true},
          nAlleles:    {val: false},
          het:         {val: true},
          homAlt:      {val: true},
          frequency:   {val: true},
          freq_pop:    {val: true}, //HX
        })
      }
    },
    filters: {
      type: Array,
      default: function() { return [] }
    },
    doDownload: {
      type: Number,
      default: 0
    },
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
      paginationSize: 100,
      downloadFileName: "variants.csv",
    }
  },
  computed: {
    // should be overridden by extending component
    ajaxUrl() { return(this.api) },
  },
  watch: {
    //HX
    introns: function() {
      this.tabulator.setData(this.ajaxUrl)
        .then(function(){
          console.log('Table data reloaded with new introns value.');
        })
        .catch(function(error){
          console.error('Failed to reload table data with new introns value:', error);
        });
    },
    filters: function() {
      this.tabulator.setFilter(this.filters);
    },
    doDownload: function() {
      if(this.tabulator == null){ return }
      this.tabulator.download('csv', this.downloadFileName)
    },
    // HX
    showCols: {
      handler: function(newShowCols, oldShowCols) {
        for (let column in newShowCols) {
          //console.log(column, newShowCols[column].val, oldShowCols[column].val);
          if (newShowCols[column].val) {
            // console.log(newShowCols[column]);
            // console.log("show", column);
            this.tabulator.showColumn(newShowCols[column].field);
          } else {
            // console.log("hide", column);
            this.tabulator.hideColumn(newShowCols[column].field);
          }
        }
        //this.tabulator.toggleColumn('variant_id');
        //this.tabulator.redraw();
        // console.log("we are here!");
      },
      deep: true
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
      if(this.tabulator == null){ return }
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
    formatCaddValue: function(cell) {
      return(cell.getValue() === null ? "" : cell.getValue().toFixed(2))
    },
    // function to override to customize column defs. 
    tblColumnDefs: function(){
      return this.baseColumnDefs()
    },
    // common column defs. 
    // HX: fix title tooltip, add allele_pop_freq column
    baseColumnDefs: function(){
      return([
        {
          // title: "Variant Id" + " <a class='text-info' onclick='event.stopPropagation();' data-html='true' data-toggle='tooltip' data-placement='top' title='1)chromosome &#10;2)position&#10;3)reference allele&#10;4)alternate allele'>?</a>",
          title: "Variant Id " + "<a class='text-info' onclick='event.stopPropagation();' data-html='true' data-toggle='tooltip' data-placement='top' title='1)Chromosome 2)Position 3)Reference allele 4)Alternate allele'>?</a>",
          // titleFormatter: function(cell) {
          //   return "Variant Id" + " <p class='tooltip'>?<span class='tooltiptext'>Tooltip text</span></p>";
          // },
          titleDownload: "Variant Id",
					// headerTooltip: "chrom-position-ref-alt",
          width: 130,
          field: "variant_id",
          visible: this.showCols.variantID,
          formatter: (cell) => { return `<a href='variant.html?id=${cell.getValue()}'>${cell.getValue()}</a>`; },
        },
        {
          title: "rsId" + " <a class='text-info' onclick='event.stopPropagation();' data-toggle='tooltip' title='Reference SNP (rs) number is a locus accession for a variant type assigned by dbSNP.'>?</a>",
          titleDownload: "rsId",
					// headerTooltip: "Reference SNP (rs) number is a locus accession for a variant type assigned by dbSNP.",
          width: 100,
          field: "rsids",
          visible: this.showCols.rsID.val,
          formatter: (cell) => {
            var html = "";
            cell.getValue().forEach(v => {
              html += `<a href='variant.html?id=${v}'>${v}</a>`;
            });
            return html;
          },
          accessorDownload: (value) => {
            if (value != null) {
              return value.join(';');
            } else {
              return "";
            }
          }
        },
        {
          title: "Quality",
          titleDownload: "Quality",
          field: "filter",
          width: 78,
          hozAlign: "left",
          visible: this.showCols.quality.val,
          formatter: (cell, params, onrendered) => {
            var html = "";
            cell.getValue().forEach( v => {
              var badge_type = v == "PASS" ? "success" : "danger";
              html += `<span class="badge badge-${badge_type}" style="margin-right:1px">${v}</span>`;
            });
            return html;
          },
          accessorDownload: (value) => {
            if (value != null) {
              return value.join(';');
            } else {
              return "";
            }
          }
        },
        {
          title: "CADD" + " <a class='text-info' onclick='event.stopPropagation();' data-toggle='tooltip' title='Variant deleteriousness score (PHRED-like scaled) computed with Combined Annoation Dependent Depletion (CADD) tool. '>?</a>",
          titleDownload: "CADD",
					// headerTooltip: "Variant deleteriousness score (PHRED-like scaled) computed with Combined Annoation Dependent Depletion (CADD) tool.",
          field: "cadd_phred",
          width: 80,
          hozAlign: "left",
          visible: this.showCols.CADD.val,
          formatter: this.formatCaddValue
        },
        {
          title: "N Alleles",
          titleDownload: "N Alleles",
          field: "allele_num",
          width: 88,
          hozAlign: "left",
          visible: this.showCols.nAlleles.val,
          formatter: (cell, params, onrendered) => cell.getValue().toLocaleString()
        },
        {
          title: "Het" + " <a class='text-info' onclick='event.stopPropagation();' data-toggle='tooltip' title='Number of heterozygotes. '>?</a>",
					// headerTooltip: "Number of heterozygotes.",
          titleDownload: "Het",
          field: "het_count",
          width: 80,
          hozAlign: "left",
          visible: this.showCols.het.val,
          formatter: (cell, params, onrendered) => cell.getValue().toLocaleString()
        },
        {
          title: "Hom" + " <a class='text-info' onclick='event.stopPropagation();' data-toggle='tooltip' title='Number of homozygotes for alternate allele. '>?</a>",
          titleDownload: "Hom",
					// headerTooltip: "Number of homozygotes for alternate allele.",
          field: "hom_count",
          width: 90,
          hozAlign: "left",
          visible: this.showCols.homAlt.val,
          formatter: (cell, params, onrendered) => cell.getValue().toLocaleString()
        },
        {
          title: "Frequency %",
          titleDownload: "Frequency %",
          field: "allele_freq",
          width: 115,
          hozAlign: "left",
          visible: this.showCols.frequency.val,
          formatter: (cell, params, onrendered) => `${(cell.getValue() * 100).toPrecision(3)}%`,
        },
        //HX:
        {
          title: "Frequency per population %" + " <a class='text-info' onclick='event.stopPropagation();' data-toggle='tooltip' title='OTH: Others; AFR: African; AMR: Ad Mixed American; EAS: East Asian; ASN: Asian; EUR: European; SAS: South Asian; FIN: Finnish, NFE: Non-Finnish European, ASJ: Ashkenazi Jewish, AMI: Amish, MID: Middle Eastern'>?</a>",
          titleDownload: "Frequency per population %",
          field: "allele_pop_freq",
          headerSort: false,
          //headerTooltip: "'OTH': 'Others'\n'AFR': 'African'\n'AMR': 'Ad Mixed American'\n'EAS': 'East Asian'\n'ASN': 'Asian'\n'EUR': 'European'\n'SAS': 'South Asian'\n'FIN': 'Finnish'\n'NFE': 'Non-Finnish European'\n'ASJ': 'Ashkenazi Jewish'\n'AMI': 'Amish'\n'MID': 'Middle Eastern'",
          
          width: 380,
          hozAlign: "left",
          visible: this.showCols.freq_pop,
          formatter: (cell, params, onrendered) => {
            let freqObj = cell.getValue();
            let freqStr = '';
            for (let [pop, freq] of Object.entries(freqObj)) {
              freqStr += `${pop}: ${(freq*100).toFixed(2)}%, `;
            }
            return freqStr.slice(0, -2);  // remove trailing comma and space
          },
        },
      ])
    }
  },
  mounted: function() {
    this.tabulator = new Tabulator(this.$refs.snvtable, {
      placeholder: null,
      ajaxURL: this.ajaxUrl,
      ajaxConfig: {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=utf-8",
        },
        credentials: "include"
      },
      ajaxContentType: "json",
      ajaxRequesting: () => {
        if ((this.ajaxUrl == null) || (this.ajaxUrl.length == 0)) {
          return false; //abort ajax request
        }
        this.failed = false;
        this.loaded = false;
        this.loading = true;
        return true;
      },
      ajaxURLGenerator: (url, config, params) => {
        // when 1st page is requested "next" must be null
        if (params.page == 1) {
          params.next = null;
        }
        params.introns = this.introns; //HX
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
      scrollVertical: (top) => {
        let visVars = this.getVisibleVariants();
        this.$emit("scroll", visVars.firstRowIdx, visVars.lastRowIdx, visVars.rowsData);
      },
      paginationSize: this.paginationSize,
      height: "600px",
      layout: "fitColumns",
      columns: this.tblColumnDefs(),
      initialSort: [ { column: "variant_id", dir: "asc" } ],
      initialFilter: this.filters,

      // tabulator-table 5.0 options
      //sortMode: "remote",
      //filterMode: "remote",
      //dataLoader: false,
      //dataLoaderLoading: "",
      //dataLoaderError: "",
      //progressiveLoad: "scroll",

      // tabulator-table 4.9 options
      ajaxProgressiveLoad: "scroll",
      ajaxLoaderError: "",
      ajaxLoaderLoading: "",
      ajaxLoader:    false,
      ajaxSorting:   true,
      ajaxFiltering: true,
      ajaxError:      this.tblAjaxError,
      dataLoaded:     this.tblDataLoaded,
      renderComplete: this.tblRenderComplete,
      rowMouseEnter:  this.tblRowMouseEnter,
      rowMouseLeave:  this.tblRowMouseLeave
    });
    $(function () {
      $('[data-toggle="tooltip"]').tooltip(); //HX initialize tooltip
    });
    // register event handlers tabulator 5.0
    //this.tabulator.on("ajaxError", this.tblAjaxError)
    //this.tabulator.on("dataProcessed", this.tblDataLoaded)
    //this.tabulator.on("renderComplete", this.tblRenderComplete)
    //this.tabulator.on("rowMouseEnter", this.tblRowMouseEnter)
    //this.tabulator.on("rowMouseLeave", this.tblRowMouseLeave)

  }
}
</script>


