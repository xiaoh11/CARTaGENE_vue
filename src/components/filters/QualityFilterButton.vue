<script>
import BaseBooleanFilterButton from '@/components/filters/BaseBooleanFilterButton.vue'

export default {
  name: "QualityFilterButton",
  extends: BaseBooleanFilterButton,
  data: function() {
    return ({
      // Override default fieldVal
      fieldVal: "filter",

      // Define filter groups and members
      pFiltSet: {
        gPassQC: {
          title: "All variants which pass QC",
          allTrue: false,
          members: {
            PASS: { 
              title: "PASS", 
              val: false,
              desc: "All filters passed"
            }
          }
        },
        gFailQC:{
          title: "All variants which failed QC",
          allTrue: false,
          members: {
            SVM: { 
              title: "SVM", 
              val: false,
              desc: "Variant failed SVM filter"
            },
            DISC: { 
              title: "DISC", 
              val: false,
              desc: "Mendelian or duplicate genotype discordance is high"
            },
            EXHET: { 
              title: "EXHET", 
              val: false,
              desc: "Excess heterozygosity"
            }
          }
        }
      },
    })
  }
}
</script>
