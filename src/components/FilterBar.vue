<template>
  <div class="filter-bar">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12" style="padding-left: 0px; padding-top: 2px; padding-bottom: 2px;">
          <QualityFilterButton/>
          <!--
          <AnnotationFilterButton/>
          <LOFTEEFilterButton/>
          <FrequencyFilterButton/>
          <CADDFilterButton/>
          <rsIdFilterButton/>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import QualityFilterButton from '@/components/filters/QualityFilterButton.vue'
  export default {
    name: "FilterBar",
    props: {
      filters: {
        type: Object,
        default: function(){ return {} }
      }
    },
    components: {
      QualityFilterButton
    },
  }
</script>
