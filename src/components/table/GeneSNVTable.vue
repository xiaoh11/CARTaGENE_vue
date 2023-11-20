<script>
import BaseSNVTable from '@/components/table/BaseSNVTable.vue'
import lofCategories from '@/domainModel/lofCategories'
import snvConsequences from '@/domainModel/snvConsequences'
import axios from "axios" //HX


export default {
  name: "GeneSNVTable",
  extends: BaseSNVTable,
  inject: {
    geneId: {default: ''},
    ensemblId: {default: ''}
  },
  data: function(){
    return {
      // geneId injected from ancestor component
      downloadFileName: `variants_${this.geneId}.csv`,
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
      return(`${this.api}/variants/gene/snv/${this.ensemblId}`) 
    }
  },
  methods: {
    //HX
    clinVarData() {
      const url = `${this.api}/variants/gene/snv/clinVar/${this.ensemblId}`;
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
    tblColumnDefs: function(){
      let consequenceCol =  {
        title: "Consequence" + " <a class='text-info' onclick='event.stopPropagation();' data-html='true' data-toggle='tooltip' data-placement='top' title='HGVSc/HGVSp nomenclature for the most severe variant effect (total number of HGVSc/HGVSp).'>?</a>",
        titleDownload: "Consequence",
        field: "annotation.gene.hgvs",
        hozAlign: "left",
        headerSort: false,
        width: 120,
        minWidth: 100,
        visible: this.showCols.consequence,
        formatter: (cell, params, onrendered) => {
          let html = ""
          if ((cell.getValue() != undefined) && (cell.getValue().length > 0)) {
            html += '<div>'
            html += cell.getValue()[0] + " (" + cell.getValue().length + ")"
            html += "</div>"
          }
          return html
        },
        cellClick: (e, cell) => {
          this.$emit("openModal", cell._cell.row.data)
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
        field: "annotation.gene.consequence",
        hozAlign: "left",
        width: 165,
        minWidth: 120,
        visible: this.showCols.annotation,
        formatter: (cell, params, onrendered) => {
          let html = ""
          let annotations = cell.getValue()
          if (annotations.length > 0) {
            // let title = snvConsequences[annotations[0]].title 
            // HX
            let title = snvConsequences.lookup(annotations[0]).title
            let cssClass = `badge--${annotations[0]}`
            html += `<div>`
            html += `<span class="badge badge-light clickable ${cssClass}" style="">${title} </span>`
            html += `<span>(${annotations.length})</span>`
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

      let lofteeCol = {
        title: "LOFTEE" + " <a class='text-info' onclick='event.stopPropagation();' data-html='true' data-toggle='tooltip' data-placement='top' title='Variant was predicted to be Loss-of-Function by LOFTEE.'>?</a>",
        titleDownload: "LOFTEE",
        field: "annotation.gene.lof",
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

      let clinvarCol ={
        title: "ClinVar"+" <a class='text-info' onclick='event.stopPropagation();' data-html='true' data-toggle='tooltip' data-placement='top' title='Uncertain Sig: Uncertain Significance <br>Conflict: Conflicting Interpretations of Pathogenicity'>?</a>",
        width: 100, 
        field: "ClinVar",
        headerSort: false,
        visible: this.showCols.ClinVar,
        formatter: (cell, formatterParams, onRendered) => {
          let variantId = cell.getRow().getData().variant_id;
          // console.log(variantId)
          let variantIdParts = variantId.split("-");
          let chrom = variantIdParts[0]; // 
          let pos = variantIdParts[1];
          // console.log("Chromosome:", chrom);
          // console.log("Position:", pos);
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
            // if (cell.getRow().getData().rsids){
            //   let html = `<a href='https://www.ncbi.nlm.nih.gov/clinvar?term=${cell.getRow().getData().rsids}' target='_blank' rel='noopener noreferrer'>${clnsig}</a>`;
            // } else {
            //   let html = `<a href='https://www.ncbi.nlm.nih.gov/clinvar?term=${chrom}[chr]%20AND%20${pos}[chrpos]' target='_blank' rel='noopener noreferrer'>${clnsig}</a>`;
            // }

            // let rsids = cell.getRow().getData().rsids;
            // let url;
            // if (rsids && rsids.trim() !== "") {
            //   // 如果rsids有值，使用rsids构建URL
            //   url = `https://www.ncbi.nlm.nih.gov/clinvar?term=${rsids}`;
            // } else {
            //   // 如果rsids为空，使用染色体和位置信息构建URL
            //   url = `https://www.ncbi.nlm.nih.gov/clinvar?term=${chrom}[chr]%20AND%20${pos}[chrpos]`;
            // }

            // // 创建包含CLNSIG值的链接，并设置为在新窗口中打开
            // let html = `<a href='${url}' target='_blank' rel='noopener noreferrer'>${clnsig}</a>`;

            
            return html; 
          } else {
            return "No Information"; // 如果没有找到variantId，返回“None”
          }

          // if (this.clinVar.includes(variantId)) {
          //   // console.log("yes")
          //   // let html = `<a href='https://www.ncbi.nlm.nih.gov/clinvar?term=${cell.getRow().getData().rsids}'>Open</a>`;
          //   let html = `<a href='https://www.ncbi.nlm.nih.gov/clinvar?term=${chrom}[chr]%20AND%20${pos}[chrpos]'>Open</a>`;
          //   return html; 
          // } else {
          //   return "None";
          // }
        }
      }


      // Insert region specific columns into base columns
      let baseCols = this.baseColumnDefs()
      baseCols.splice(2, 0, consequenceCol, annoCol, lofteeCol, clinvarCol)
      // baseCols = baseCols.concat(dynamicCols);

      return baseCols 
    },
  },
  created() {
    this.clinVarData();
  }
}
</script>
