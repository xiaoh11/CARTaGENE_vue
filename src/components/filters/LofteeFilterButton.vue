<script>
import BaseBooleanFilterButton from '@/components/filters/BaseBooleanFilterButton.vue'

export default {
  name: "LofteeFilterButton",
  extends: BaseBooleanFilterButton,
  data: function() {
    return ({
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
