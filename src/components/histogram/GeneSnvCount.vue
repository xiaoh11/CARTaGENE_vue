<script>
import BaseSnvCount from '@/components/histogram/BaseSnvCount.vue'

export default {
  name: "GeneSnvCount",
  extends: BaseSnvCount,
  inject: {
    ensemblId: {default: '' }
  },
  computed: {
    url() { return `${this.api}/variants/gene/snv/${this.ensemblId}/histogram` }
  }
}
</script>
