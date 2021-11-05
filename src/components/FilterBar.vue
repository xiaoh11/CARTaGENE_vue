<template>
  <div class="filter-bar">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12" style="padding-left: 0px; padding-top: 2px; padding-bottom: 2px;">
          <QualityFilterButton v-bind="$attrs" givenCategory="quality"/>
          <BaseFilterButton v-bind="$attrs"/>
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
import BaseFilterButton from '@/components/filters/BaseFilterButton.vue'
export default {
  name: "FilterBar",
  inheritAttrs: false,
  props: {
    filters: {
      type: Object,
      default: function(){ return {} }
    }
  },
  components: {
    QualityFilterButton,
    BaseFilterButton
  },
}
</script>
