<script>
import BaseBooleanFilterButton from '@/components/filters/BaseBooleanFilterButton.vue'

export default {
  name: "LofteeFilterButton",
  extends: BaseBooleanFilterButton,
  data: function() {
    return ({
      pFilter: {
        gLof: {
          title: "All putative Loss-of-Function (pLoF) variants",
          allTrue: false,
          members: {
            HC: { 
              title: "High Confidence",
              val: false, 
              desc: "Variants which pass all LOFTEE filters" 
            },
            LC: { 
              title: "low-confidence", 
              val: false, 
              desc: "Variants which fail at least one LOFTEE filter" 
            }
          }
        }
      }
    })
  }
}
</script>
