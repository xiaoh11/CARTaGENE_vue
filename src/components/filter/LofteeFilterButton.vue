<script>
import BaseBooleanFilterButton from '@/components/filter/BaseBooleanFilterButton.vue'

export default {
  name: "LofteeFilterButton",
  extends: BaseBooleanFilterButton,
  data: function() {
    return ({
      // Override default fieldVal
      fieldVal: "annotation.lof",

      // Define filter groups and members
      pFiltSet: {
        gLof: {
          title: "All putative Loss-of-Function (pLoF) variants",
          members: {
            HC: { 
              title: "High Confidence",
              desc: "Variants which pass all LOFTEE filters" 
            },
            LC: { 
              title: "low-confidence", 
              desc: "Variants which fail at least one LOFTEE filter" 
            }
          }
        }
      }
    })
  }
}
</script>
