<!-- HX  -->
<template>
    <div class="card shadow-sm" style="min-width: 300px">
      <div class="card-body">
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <h5>Allele frequency per population</h5>
            </div>
          </div>
        </div>
        <div v-if="frequencies.length > 0">
          <div v-for="frequency in frequencies" class="container-fluid">
            <div class="row">
              <div class="col-6 col-sm-7 text-left text-truncate">{{ frequency.name }}</div>
              <div class="col-6 col-sm-5 text-right">{{ frequency.value }}</div>
            </div>
            <div class="row" style="margin-bottom:8px;">
              <div class="col-sm-12">
                <div class="progress" style="height:5px;">
                  <div class="progress-bar" role="progressbar" v-bind:style="{ width: frequency.percent + '%' }" v-bind:aria-valuenow="frequency.value" v-bind:aria-valuemax="frequency.max"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-muted text-center">Variant not found</div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
  name: 'VariantPopFrequency',
  props: ['allelePopFreq'],
  data: function() {
    return {
      populations: {
        'OTH': 'Others',
        'AFR': 'African',
        'AMR': 'Ad Mixed American',
        'EAS': 'East Asian',
        'ASN': 'Asian',
        'EUR': 'European',
        'SAS': 'South Asian',
        'FIN': 'Finnish',
        'NFE': 'Non-Finnish European',
        'ASJ': 'Ashkenazi Jewish',
        'AMI': 'Amish',
        'MID': 'Middle Eastern',
        'FrenchCanada': 'FC (French-Canada)',
        'Haiti': 'HT (Haiti)',
        'Morocco': 'MA (Morocco)',
      }
    }
  },
  computed: {
    frequencies: function() {
      return Object.entries(this.allelePopFreq)
        .map(([key, value]) => {
          let name = this.populations[key] ? `${key} (${this.populations[key]})` : key;
          return {
            name: `${this.populations[key]}`,
            // display values in 5 decimal places
            //value: value.toPrecision(4),
            value: value === 0 ? '0' : value.toPrecision(4),
            percent: value * 100,
            max: 1.0
          };
        })
        .filter(x => x);
    }
  }
}
  </script>
  