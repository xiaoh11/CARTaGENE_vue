<script>
import BaseSNVTable from '@/components/tables/BaseSNVTable.vue'
import lofCategories from '@/domainModel/lofCategories'
import snvConsequences from '@/domainModel/snvConsequences'

export default {
  name: "RegionSNVTable",
  extends: BaseSNVTable,
  data: function(){
    return {
      // chrom, start, stop are injected from ancestor component
      downloadFileName: `variants_${this.chrom}-${this.start}-${this.stop}.csv`
    }
  },
  computed: {
    // define url to get data appropriate for region snv table
    ajaxUrl() { 
      return(`${this.api}/variants/region/snv/${this.chrom}-${this.start}-${this.stop}`) 
    }
  },
  methods: {
    // add region implementation for consequence, annotation, and loftee
    tblColumnDefs: function(){
      let consequenceCol =  {
        title: "Consequence <a class='text-info' onclick='event.stopPropagation();' data-toggle='tooltip' title='HGVSc/HGVSp nomenclature for the most severe variant effect (total number of HGVSc/HGVSp).'>?</a>",
        titleDownload: "Consequence",
        field: `annotation.region.hgvs`,
        hozAlign: "left",
        headerSort: false,
        minWidth: 120,
        visible: this.showCols.consequence,
        formatter: (cell, params, onrendered) => {
          if ((cell.getValue() != undefined) && (cell.getValue().length > 0)) {
            return cell.getValue()[0] + ` <a href="javascript:void(0)" role="button" onclick='this.dispatchEvent(new CustomEvent("click-annotations", { "bubbles": true, "detail": ${cell.getRow().getPosition()} }))'>(${cell.getValue().length})</a>`
          } else {
            return ""
          }
        },
        accessorDownload: (value) => {
          if (value != null) {
            return value.join(';')
          } else {
            return ""
          }
        }
      }

      let annoCol =  {
        title: "Annotation <a class='text-info' onclick='event.stopPropagation();' data-toggle='tooltip' title='Variant annotation (defined by Sequence Onthology) with most severe effect (total number of annotations).'>?</a>",
        titleDownload: "Annotation",
        field: 'annotation.region.consequence',
        hozAlign: "left",
        minWidth: 120,
        visible: this.showCols.annotation,
        formatter: (cell, params, onrendered) => {
          let html = ""
          let annotations = cell.getValue()
          if (annotations.length > 0) {
            let title = snvConsequences[annotations[0]].title 
            let cssClass = `badge--${annotations[0]}`
            html += `<span class="badge badge-light ${cssClass}" style="margin-right:1px;font-weight:bold;-webkit-text-stroke: 0.15px black;">${title}</span>`
            html += ` <a href="javascript:void(0)" role="button" onclick='this.dispatchEvent(new CustomEvent("click-annotations", { "bubbles": true, "detail": ${cell.getRow().getPosition()} }))'>(${annotations.length})</a>` // we emit here an Event intead of directly calling Bootstrap modal, because we want to do all modal's dynamics through VueJs.
          }
          return html;
        },
        accessorDownload: (value) => {
          if (value != null) {
            return value.join(';')
          } else {
            return ""
          }
        }
      }

      let lofteeCol = {
        title: "LOFTEE <a class='text-info' onclick='event.stopPropagation();' data-toggle='tooltip' title='Variant was predicted to be Loss-of-Function by LOFTEE.'>?</a>",
        titleDownload: "LOFTEE",
        field: "annotation.region.lof",
        hozAlign: "left",
        minWidth: 95,
        visible: this.showCols.LOFTEE.val,
        formatter: (cell, params, onrendered) => {
          let html = ""
          if (cell.getValue() != undefined) {
              cell.getValue().forEach(v => {
                let badge_type = v == "HC" ? "success" : "warning"
                let title = lofCategories[v].title
                html += `<span class="badge badge-${badge_type}" style="margin-right:1px">${title}</span>`
              });
          }
          return html;
        },
        accessorDownload: (value) => {
          if (value != null) {
            return value.join(';')
          } else {
            return ""
          }
        }
      }

      // Insert region specific columns into base columns
      let baseCols = this.baseColumnDefs()
      baseCols.splice(2, 0, consequenceCol, annoCol, lofteeCol)

      return baseCols 
    },
  }
}
</script>
