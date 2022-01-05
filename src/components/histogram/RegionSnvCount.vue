<script>
import BaseSnvCount from '@/components/histogram/BaseSnvCount.vue'

export default {
  name: "RegionSnvCount",
  extends: BaseSnvCount,
  inject: {
    chrom: {default: '11'},
    start: {default: 200000},
    stop:  {default: 201000},
  },
  computed: {
    url() { return `${this.api}/variants/region/snv/${this.chrom}-${this.start}-${this.stop}/histogram` }
  }
}
</script>
