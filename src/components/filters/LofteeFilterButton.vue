<script>
import BaseFilterButton from '@/components/filters/BaseFilterButton.vue'

export default {
  name: "LofteeFilterButton",
  extends: BaseFilterButton,
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
