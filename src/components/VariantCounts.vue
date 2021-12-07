<template>
  <div class="card shadow-sm" style="min-width: 300px">
    <div class="card-body">
      <div v-for="count in counts" class="container-fluid">
        <div class="row">
          <div class="col-5 col-sm-7 text-left text-truncate">{{ count.name }}</div>
          <div class="col-7 col-sm-5 text-right">{{ count.value }}</div>
        </div>
        <div class="row" style="margin-bottom:8px;">
          <div class="col-12 col-sm-12">
            <div class="progress" style="height:5px;">
              <div class="progress-bar" role="progressbar" :style="{ width: count.percent + '%' }" :aria-valuenow="count.value" :aria-valuemax="count.max"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'VariantCounts',
  props: ['variant'],
  data: function(){
    return {
      nSamples: process.env.VUE_APP_TOTAL_SAMPLES,
    }
  },
  computed: {
    counts: function() {
      return [
        { name: "Samples", 
          value: (this.variant.allele_num / 2).toLocaleString(), 
          percent:  100 * this.variant.allele_num / (2 * this.nSamples),
          max: this.nSamples },
        { name: "AC (Alternate allele Count)",
          value: this.variant.allele_count.toLocaleString(),
          percent: 100 * this.variant.allele_count / (2 * this.nSamples),
          max: 2 * this.nSamples },
        { name: "AF (Alternate allele Frequency)",
          value: this.variant.allele_freq.toPrecision(5),
          percent: 100 * this.variant.allele_freq,
          max: 1.0 },
        { name: "Heterozygotes",
          value: this.variant.het_count.toLocaleString(),
          percent: 100 * this.variant.het_count / this.nSamples,
          max: this.nSamples },
        { name: "Homozygotes",
          value: this.variant.hom_count.toLocaleString(),
          percent: 100 * this.variant.hom_count / this.nSamples,
          max: this.nSamples }
      ]
    }
  }
}
</script>
