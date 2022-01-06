<template>
    <div class="btn-group mr-1 mt-1 position-static" v-click-outside="handleClickAway">
      <div style="display: inline-block;">
        <button ref="dropBtn" class="btn btn-sm dropdown-toggle" :class="activeClass" @click="toggleDropDown">
          {{compositeTitle}} 
        </button>
        <div ref="dropBody" v-if="showDropDown" class="dropdown-menu shadow show" :style="transformStyle">
          <form class="p-2">
            <!--
            <h6>Variant deleteriousness score (CADD) on PHRED-like scale</h6>
            -->
            <h6>{{desc}}</h6>
            <div class="form-group row">
              <label for="minInput" class="col-sm-2 col-form-label">Min</label>
              <div class="col-sm-10">
                <input class="form-control" id="minInput" type="number" name="" min="0" max="100" step="0.01" v-model="eMinVal" required>
              </div>
            </div>
            <div class="form-group row">
              <label for="maxInput" class="col-sm-2 col-form-label">Max</label>
              <div class="col-sm-10">
                <input class="form-control" id="maxInput" type="number" name="" min="0" max="100" step="0.01" v-model="eMaxVal" required>
              </div>
            </div>

            <!-- Apply & Cancel buttons -->
            <hr/>
            <div class="form-row">
              <div class="col mr-auto">
                <button type="button" class="btn btn-secondary btn-sm" @click="clearEphemeralFilters">
                  Clear
                </button>
              </div>
              <div class="col mr-auto">
                <button type="button" class="btn btn-primary btn-sm float-right" @click="applyFilters">
                  Apply
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
</template>

<script>

export default {
  name: "BaseMinMaxFilterButton",
  props: {
    title: {
      type: String,
      default: "Filters"
    },
    givenCategory: {
      type: String,
      default: "minmax"
    },
    desc: {
      type: String,
      default: "Min and max bounds"
    },
    // value for the 'field' key of the filters emitted
    fieldVal: {
      type: String,
      default: "default"
    }
  },
  data: function() {
    return {
      // ephemeral values for form modification
      eMinVal: 0,
      eMaxVal: 100,
      // persistent values for apply/clear
      pMinVal: 0,
      pMaxVal: 100,

      // Filter Values will be one or both of:
      //  {field: this.fieldVal, type: ">", value: this.pMinVal}
      //  {field: this.fieldVal, type: "<", value: this.pMaxVal}
      filterVals: [],

      showDropDown: false,
      showHidden: false,
      dropBodyTx: 0
    }
  },
  emits: ['filterChange'],
  watch: {
    showDropDown: function(val){
      if(val){
        // When showing the drop down, load the persistent filters.
        this.eMinVal = this.pMinVal
        this.eMaxVal = this.pMaxVal
      }
    }
  },
  computed: {
    transformStyle() {
      return( `transform: translate(${this.dropBodyTx}px)` )
    },
    appliedFiltersCount() {
      return((this.pMinVal > 0) + (this.pMaxVal < 100))
    },
    activeClass() { 
      if(this.appliedFiltersCount > 0){ 
        return('btn-primary')
      }
      else {
        return('btn-outline-primary')
      }
    },
    compositeTitle() {
      if( this.appliedFiltersCount > 0 ) {
        return( this.title + ` (${this.appliedFiltersCount})`)
      } else {
        return( this.title )
      }
    },
    isDisabled() {
      return( this.eMinVal == 0 && this.eMaxVal == 100 )
    }
  },
  methods: {
    toggleDropDown: function() {
      this.showDropDown = !this.showDropDown
      // Calculate x difference for right side alignment if body is short.
      this.$nextTick( () => { this.slideBodyRight() })
    },
    slideBodyRight(){
      if( this.$refs.dropBody == null ){ return }

      let bttnRight = this.$refs.dropBtn.getBoundingClientRect().right 
      let bodyRight = this.$refs.dropBody.getBoundingClientRect().right
      let xdiff = Math.floor( bttnRight - bodyRight)

      if(xdiff > 0){ this.dropBodyTx = xdiff }
    },
    emitFilterChange: function () {
      let filterArr = []
      console.log('MinVal: ' + this.pMinVal)
      if( this.pMinVal > 0){
        filterArr.push({field: this.fieldVal, type: ">", value: this.pMinVal})
      }
      if( this.pMaxVal < 0){
        filterArr.push({field: this.fieldVal, type: "<", value: this.pMaxVal})
      }
      this.$emit('filterChange', this.givenCategory, filterArr)
    },
    applyFilters: function() {
      this.showDropDown = false

      this.pMinVal = this.eMinVal
      this.pMaxVal = this.eMaxVal

      this.emitFilterChange()
    },
    clearEphemeralFilters: function() {
      this.pMinVal = 0
      this.pMaxVal = 100
    },
    handleClickAway: function(){
      this.showDropDown = false
    },
  }
}
</script>
