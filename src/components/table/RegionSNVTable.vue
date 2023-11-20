<script>
import BaseSNVTable from '@/components/table/BaseSNVTable.vue'
import lofCategories from '@/domainModel/lofCategories'
import snvConsequences from '@/domainModel/snvConsequences'
import axios from "axios" //HX


export default {
  name: "RegionSNVTable",
  extends: BaseSNVTable,
  data: function(){
    return {
      // chrom, start, stop are injected from ancestor component
      downloadFileName: `variants_${this.chrom}-${this.start}-${this.stop}.csv`,
      //HX
      clinVarLoading: true,
      clinsig_info: {
        'Uncertain_significance': 'Uncertain Sig',
        'Conflicting_interpretations_of_pathogenicity': 'Conflict',
        'Benign': 'Benign',
        'Pathogenic': 'Pathogenic',
        'Likely_benign': 'Likely Benign',
        'Likely_pathogenic': 'Likely Pathogenic',
        'Benign/Likely_benign': '(Likely) Benign',
        'Pathogenic/Likely_pathogenic': '(Likely) Pathogenic',
        'not_provided': 'Not Provided',
        'risk_factor': 'Risk Factor',
        'Affects': 'Affects',
        'association': 'Association',
        'drug_response': 'Drug Response',
        'Uncertain_risk_allele': 'Uncertain Risk Allele',
        'other': 'Other',
        'protective': 'Protective',
        'Pathogenic/Likely_pathogenic/Likely_risk_allele': '(Likely) Pathogenic/Risk Allele',
        'confers_sensitivity': 'Confers Sensitivity',
        'Pathogenic/Likely_risk_allele': 'Pathogenic/Likely Risk Allele',
      }
    }
  },
  emits: ['openModal'],
  computed: {
    // define url to get data appropriate for region snv table
    ajaxUrl() { 
      return(`${this.api}/variants/region/snv/${this.chrom}-${this.start}-${this.stop}`) 
    }
  },
  //HX
  methods: {
    //HX
    clinVarData() {
      const url = `${this.api}/variants/region/snv/clinvar/${this.chrom}-${this.start}-${this.stop}`;
      axios.get(url)
        .then(response => {
          this.clinVar=response.data
          this.clinVarLoading = false; // 
          this.refreshClinVarColumn();
          // console.log(this.clinVar);
          // console.log(this.clinVar[0]);
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    },
    refreshClinVarColumn() {
      if (this.tabulator) {
        this.tabulator.redraw(true); // 强制重绘表格
      }
    },
    //HX
    // add region implementation for consequence, annotation, and loftee
    tblColumnDefs: function(){
      let clinvarCol ={
        title: "ClinVar"+" <a class='text-info' onclick='event.stopPropagation();' data-html='true' data-toggle='tooltip' data-placement='top' title='Uncertain Sig: Uncertain Significance <br>Conflict: Conflicting Interpretations of Pathogenicity'>?</a>",
        width: 100, 
        field: "ClinVar",
        headerSort: false,
        visible: this.showCols.ClinVar,
        formatter: (cell, formatterParams, onRendered) => {
          let variantId = cell.getRow().getData().variant_id;
          let variantIdParts = variantId.split("-");
          let chrom = variantIdParts[0]; // 
          let pos = variantIdParts[1];
          let foundIndex = this.clinVar.findIndex(element => element[0] === variantId);

          if (this.clinVarLoading) {
            return "Pending"; 
          } else if (foundIndex !== -1) {
            // let clnsig = this.clinVar[foundIndex][1]; // CLNSIG
            let rawClnsig = this.clinVar[foundIndex][2]; // Raw CLNSIG value
            let clnsigElements = rawClnsig.includes('|') ? rawClnsig.split('|') : [rawClnsig];
            let clnsigDescriptions = clnsigElements.map(clnsigElement => {
              return this.clinsig_info[clnsigElement] || clnsigElement;
            });
            let clnsigDisplay = clnsigDescriptions.join(', ');

            // let html = `<a href='https://www.ncbi.nlm.nih.gov/clinvar?term=${chrom}[chr]%20AND%20${pos}[chrpos]' target='_blank' rel='noopener noreferrer'>${clnsig}</a>`;
            // let html = `<a href='https://www.ncbi.nlm.nih.gov/clinvar?term=${cell.getRow().getData().rsids}' target='_blank' rel='noopener noreferrer'>${clnsigDisplay}</a>`;
            let html = `<a href='https://www.ncbi.nlm.nih.gov/clinvar/variation/${this.clinVar[foundIndex][1]}/' target='_blank' rel='noopener noreferrer'>${clnsigDisplay}</a>`;
           
            
            return html; 
          } else {
            return "No Information"; // 如果没有找到variantId，返回“None”
          }
        }
      }

      let consequenceCol =  {
        title: "Consequence" + " <a class='text-info' onclick='event.stopPropagation();' data-html='true' data-toggle='tooltip' data-placement='top' title='HGVSc/HGVSp nomenclature for the most severe variant effect (total number of HGVSc/HGVSp).'>?</a>",
        titleDownload: "Consequence",
        field: `annotation.region.hgvs`,
        headerTooltip: "HGVSc/HGVSp nomenclature for the most severe variant effect (total number of HGVSc/HGVSp).",
        hozAlign: "left",
        headerSort: false,
        width: 120,
        minWidth: 100,
        visible: this.showCols.consequence,
        formatter: (cell, params, onrendered) => {
          let html = ""
          if ((cell.getValue() != undefined) && (cell.getValue().length > 0)) {
            html += `<div>`
            html += cell.getValue()[0] + ' (' + cell.getValue().length + ')'
            html += `</div>`
          }
          return html
        },
        cellClick: (e, cell) => {
          this.$emit('openModal', cell._cell.row.data)
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
        title: "Annotation" +" <a class='text-info' onclick='event.stopPropagation();' data-html='true' data-toggle='tooltip' data-placement='top' title='Variant annotation (defined by Sequence Onthology) with most severe effect (total number of annotations).'>?</a>",
        titleDownload: "Annotation",
        headerTooltip: "Variant annotation (defined by Sequence Onthology) with most severe effect (total number of annotations).",
        field: 'annotation.region.consequence',
        hozAlign: "left",
        width: 145,
        minWidth: 120,
        visible: this.showCols.annotation,
        formatter: (cell, params, onrendered) => {
          let html = ""
          let annotations = cell.getValue()
          if (annotations.length > 0) {
            // let title = snvConsequences[annotations[0]].title 
            // HX
            let title = snvConsequences.lookup([annotations[0]]).title 
            let cssClass = `badge--${annotations[0]}`
            html += `<div>`
            html += `<span class="badge badge-light clickable ${cssClass}" style="">${title} </span>`
            html += `<span>(${annotations.length})</span>`
            html += `</div>`
          }
          return html;
        },
        cellClick: (e, cell) => {
          this.$emit('openModal', cell._cell.row.data)
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
        title: "LOFTEE" + " <a class='text-info' onclick='event.stopPropagation();' data-html='true' data-toggle='tooltip' data-placement='top' title='Variant was predicted to be Loss-of-Function by LOFTEE.'>?</a>",
        titleDownload: "LOFTEE",
        headerTooltip: "Variant was predicted to be Loss-of-Function by LOFTEE.",
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
      baseCols.splice(2, 0, consequenceCol, annoCol, lofteeCol, clinvarCol)

      return baseCols 
    },
  },
  created() {
    this.clinVarData();
  }
}
</script>
