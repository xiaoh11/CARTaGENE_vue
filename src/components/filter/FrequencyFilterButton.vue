<script>
import BaseMinMaxFilterButton from '@/components/filter/BaseMinMaxFilterButton.vue'

export default {
  name: "FrequencyFilterButton",
  extends: BaseMinMaxFilterButton,
  methods: {
    // override to convert percent min/max vals to decimal.
    emitFilterChange: function (){
      let filterArr = []
      if( this.pMinVal > 0){
        filterArr.push(
          {field: this.fieldVal, type: ">", value: this.pMinVal / 100}
        )
      }
      if( this.pMaxVal < 100){
        filterArr.push(
          {field: this.fieldVal, type: "<", value: this.pMaxVal / 100}
        )
      }
      this.$emit('filterChange', this.givenCategory, filterArr)
    },
  }
}
</script>
