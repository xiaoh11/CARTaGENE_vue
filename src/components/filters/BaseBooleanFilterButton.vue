<template>
    <div class="parentMenu" v-click-outside="handleClickAway">
      <div style="display: inline-block;">
        <button class="btn btn-sm dropdown-toggle" :class="activeClass" v-on:click="showDropDown = !showDropDown">
          {{compositeTitle}} 
        </button>
        <div v-if="showDropDown" class="dropdown-menu shadow show">
          <form class="p-2">

            <template v-for="(group, groupKey) in eFilter" :key="groupKey">
              <li>
                <div class="custom-control custom-checkbox">
                  <input class="custom-control-input" type="checkbox" :value="groupKey" 
                    :id="groupKey" v-model="group.allTrue" @change="handleGroupToggle(group)">
                  <label class="custom-control-label" :for="groupKey">{{group.title}}</label>
                </div>
                <ul style="list-style-type: none; padding-left: 1rem; padding-top: 0.2rem;">
                <template v-for="(member, memberKey) in group.members" :key="memberKey">
                  <li>
                    <div class="custom-control custom-checkbox">
                      <input class="custom-control-input" type="checkbox" :value="memberKey" :id="memberKey" 
                             v-model="member.val" @change="handleMemberToggle(member, group)">
                      <label class="custom-control-label" :for="memberKey">{{member.title}}</label>
                      <small class="form-text text-muted">{{member.desc}}</small>
                    </div>
                  </li>
                </template>
                </ul>
              </li>
            </template>

            <hr/>
            <div class="form-row">
              <div class="col mr-auto">
                <button type="button" class="btn btn-secondary btn-sm" v-on:click="clearEphemeralFilters">
                  Clear
                </button>
              </div>
              <div class="col mr-auto">
                <button type="button" class="btn btn-primary btn-sm float-right" v-on:click="applyFilters">
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
import clone from 'just-clone';

export default {
  name: "BaseFilterButton",
  props: {
    title: {
      type: String,
      default: "Filters"
    },
    givenCategory: {
      type: String,
      default: "base"
    }
  },
  data: function() {
    return {
      // persisted form values. Loaded on show. Updated on save. 
      pFilter: {
        gColorFilter: {
          title: "Example Filter Group",
          allTrue: false,
          members: {
            red: { 
              title: "Red", 
              val: false,
              desc: "Is red."
            },
            green: { 
              title: "Green", 
              val: false,
              desc: "Is green"
            }
          }
        },
        gQCFails:{
          title: "Quality Control Failures",
          allTrue: false,
          members: {
            mainQC: { 
              title: "Main Quality Control", 
              val: false,
              desc: "Failed primary quality control"
            },
            secondary: { 
              title: "Secondary", 
              val: false,
              desc: "Failed Secondary quality control"
            },
            alice: { 
              title: "Project alICE", 
              val: false,
              desc: "Failed QC for the fictional alICE project"
            }
          }
        }
      },
      // ephemeral filter model the form edits directly
      eFilter: {},
      filterVals: [{field: "filter", type: "=", value: "PASS"}],
      showDropDown: false
    }
  },
  emits: ['filterChange'],
  created: function() {
    //save hassle of specifying allTrue on groups and val of members
    //  Default to false.
    let groups = Object.values(this.pFilter)
    for( let g of groups){
      g.allTrue = (g.allTrue === undefined) ? false : g.allTrue
      for( let m of Object.values(g.members)){
        m.val = (m.val === undefined) ? false: m.val
      }
    }

    //check if any groups are allTrue already.

    //ensure ephemeral filters are never empty.
    this.eFilter = clone(this.pFilter)
  },
  computed: {
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
    appliedFiltersCount() {
      let vals = Object.values(this.pFilter)
        .map(g => Object.values(g.members))
        .flat()
        .map(m => m.val)
      let sum = vals.reduce((acc, curr) => acc + curr, 0)
      return(sum)
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
    isEntireGroupTrue: function(filterGroup){
      let verdict = Object.values(filterGroup.members)
        .map(m => m.val)
        .every(v => v)
      return verdict
    },
    filterGroupToArray: function(filterGroup){
      let arr = []
      Object.entries(filterGroup.members).forEach( ([key, content]) => {
        if(content.val === true){
          arr.push({ field: 'filter', type: '=', value: key})
        }
      })
      return(arr)
    },
    filterToArray: function(filter){
      let arr = Object.values(filter)
        .map(g => this.filterGroupToArray(g))
        .flat()
      return(arr)
    },
    emitFilterChange: function (){
      this.$emit('filterChange', this.givenCategory, this.filterToArray(this.pFilter))
    },
    applyFilters: function() {
      this.showDropDown = false

      // If selection changed, make ephemeral selection persistent
      if( JSON.stringify(this.pFilter) === JSON.stringify(this.eFilter)){
        return
      }
      this.pFilter = clone(this.eFilter)
      this.emitFilterChange()
    },
    setGroupVals: function(filterGroup, val){
      for(let member of Object.values(filterGroup.members)){
        member.val = val
      }
    },
    clearEphemeralFilters: function() {
      for(let group of Object.values(this.eFilter)){
        group.allTrue = false
        this.setGroupVals(group, false)
      }
    },
    handleClickAway: function(){
      this.showDropDown = false
    },
    handleGroupToggle: function(group){
      // v-model fires after on click, so eventual value is opposite of observed here.
      // set group to match eventual value
      this.setGroupVals(group, group.allTrue)
    },
    handleMemberToggle: function(member, group){
      group.allTrue = this.isEntireGroupTrue(group)
    }
  }
}
</script>
