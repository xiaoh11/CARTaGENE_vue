<script>
import BaseSNVTable from '@/components/tables/BaseSNVTable.vue'

export default {
  name: "RegionSNVTable",
  extends: BaseSNVTable,
  computed: {
    // should be overridden by extending component
    ajaxUrl() { 
      return(`${this.api}/variants/region/snv/${this.chrom}-${this.start}-${this.end}`) 
    }
  },
}
</script>
