<template>
    <div class="parent-menu" v-click-outside="handleClickAway">
      <div style="display: inline-block;">
        <button class="btn btn-sm dropdown-toggle btn-primary" v-on:click="showDropDown = !showDropDown">
          Quality 
        </button>
        <div v-if="showDropDown" class="dropdown-menu shadow show">
          <form class="p-2">
            <ul style="list-style-type: none; padding-left: 0;">
              <li>
                <div class="custom-control custom-checkbox">
                  <input class="custom-control-input" type="checkbox" value="allPassQC" id="allPassedQC" v-model="eFilter.allPassQC">
                  <label class="custom-control-label" for="allPassedQC">All variants which pass QC</label>
                </div>
                <ul style="list-style-type: none; padding-left: 1rem; padding-top: 0.2rem;">
                  <li>
                    <div class="custom-control custom-checkbox">
                      <input class="custom-control-input" type="checkbox" value="PASS" id="PASS" v-model="eFilter.groupPassQC.PASS">
                      <label class="custom-control-label" for="PASS">PASS</label>
                      <small class="form-text text-muted">All filters passed</small>
                    </div>
                  </li>
                </ul>
              </li>
              <li>
                <div class="custom-control custom-checkbox">
                  <input class="custom-control-input" type="checkbox" value="" id="allFailedQC" v-model="eFilter.allFailQC">
                  <label class="custom-control-label" for="allFailedQC">All variants which failed QC</label>
                </div>
                <ul style="list-style-type: none; padding-left: 1rem; padding-top: 0.2rem;">
                  <li>
                    <div class="custom-control custom-checkbox">
                      <input class="custom-control-input" type="checkbox" value="SVM" id="SVM" v-model="eFilter.groupFailQC.SVM">
                      <label class="custom-control-label" for="SVM">SVM</label>
                      <small class="form-text text-muted">Variant failed SVM filter</small>
                    </div>
                  </li>
                  <li>
                    <div class="custom-control custom-checkbox">
                      <input class="custom-control-input" type="checkbox" value="DISC" id="DISC" v-model="eFilter.groupFailQC.DISC">
                      <label class="custom-control-label" for="DISC">DISC</label>
                      <small class="form-text text-muted">Mendelian or duplicate genotype discordance is high</small>
                    </div>
                  </li>
                  <li>
                    <div class="custom-control custom-checkbox">
                      <input class="custom-control-input" type="checkbox" value="EXHET" id="EXHET" v-model="eFilter.groupFailQC.EXHET">
                      <label class="custom-control-label" for="EXHET">EXHET</label>
                      <small class="form-text text-muted">Excess heterozygosity.</small>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
            <hr/>
            <div class="form-row">
              <div class="col mr-auto">
                <button type="button" class="btn btn-secondary btn-sm" v-on:click="clearFilters">Clear</button>
              </div>
              <div class="col mr-auto">
                <button type="button" class="btn btn-primary btn-sm float-right" v-on:click="applyFilters">Apply</button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
</template>

<script>
  import clone from 'just-clone';

  export default {
    name: "QualityFilterButton",
    data: function() {
      return {
        // persisted form values. Loaded on show. Updated on save. 
        pFilter: {
          allPassQC: false,
          groupPassQC: {
            PASS: false
          },
          allFailQC: false,
          groupFailQC:{
            SVM: false,
            DISC: false,
            EXHET: false
          }
        },
        // ephemeral filter model the form edits directly, but need to be applied to persist.
        eFilter: {},
        filterVals: [{field: "filter", type: "=", value: "PASS"}],
        showDropDown: false
      }
    },
    emits: ['filterChange'],
    created: function() {
      // initial setup of ephemeral filters to ensure they're never empty.
      this.eFilter = clone(this.pFilter)
    },
    computed: {
      buttonClass() { 
        if(this.filterVals.length > 0){ 
          return('btn-primary')
        }
        else {
          return('btn-outline-primary')
        }
      },
      dropDownClass(){
        if(this.showDropDown){
          return("parent-menu-dropdown shadow")
        }
        else {
          return("parent-menu-dropdown shadow show")
        }
      }
    },
    watch: {
      // When showing the drop down, load the persistent filters.
      showDropDown: function(val){
        if(val){
          this.eFilter = clone(this.pFilter)
        }
      }
    },
    methods: {
      filterGroupToArray: function(filterGroup){
        let arr = []
        Object.entries(filterGroup).forEach( ([key, value]) => {
          if(value === true){
            arr.push({ field: 'filter', type: '=', value: key})
          }
        })
        return(arr)
      },
      filterToArray: function(filter){
        let arr = [].concat(this.filterGroupToArray(filter.groupPassQC))
          .concat(this.filterGroupToArray(filter.groupFailQC))
        return(arr)
      },
      emitFilterChange: function (){
        this.$emit('filterChange', 'qualityFitler', this.filterToArray(this.pFilter))
      },
      applyFilters: function() {
        if( JSON.stringify(this.pFilter) === JSON.stringify(this.eFilter)){
          return
        }
        // Make selection persistent
        this.pFilter = clone(this.eFilter)

        this.emitFilterChange()
        this.showDropDown = false
      },
      clearFilters: function() {
        console.log('run clear')
        // set all ephemeral filters to false
        this.eFilter = {
          allPassQC: false,
          groupPassQC: {
            PASS: false
          },
          allFailQC: false,
          groupFailQC:{
            SVM: false,
            DISC: false,
            EXHET: false
          }
        }
      },
      handleClickAway: function(){
        this.showDropDown = false
      }
    }
  }
</script>

<style scoped>
  .parent-menu {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    display: inline-block;
    font-size: 14px;
  }
  .parent-menu-button {
    outline: none;
    padding: 0px 7px 0px 7px;
    margin: 1px 1px 1px 1px;
    color: white;
    background-color: #007bff;
    border: 1px solid #007bff;
    border-radius: 2px;
    box-shadow: none;
  }
  .parent-menu-button:hover {
    background-color: #0062cc;
    border-color: #0062cc;
  }
  .parent-menu-dropdown {
    display: block;
    position: absolute;
    background-color: #eeeeee;
    min-width: 140px;
    overflow: auto;
    box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.2);
    border: 1px solid #cbcacb;
    z-index: 999;
  }
  .parent-menu-dropdown a {
    display: block;
    padding: 4px 2px;
    color: black;
    text-align: left;
    text-decoration: none;
  }
  .parent-menu-dropdown a:hover {
    background-color: #cccccc;
  }
</style>
