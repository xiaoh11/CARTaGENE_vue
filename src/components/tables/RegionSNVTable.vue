<script>
import BaseSNVTable from '@/components/tables/BaseSNVTable.vue'

export default {
  name: "RegionSNVTable",
  extends: BaseSNVTable,
  computed: {
    // define url to get data appropriate for region snv table
    ajaxUrl() { 
      return(`${this.api}/variants/region/snv/${this.chrom}-${this.start}-${this.stop}`) 
    }
  },
}
</script>
