<template>
    <div class="parent-menu" v-click-outside="handleClickAway">
      <div style="display: inline-block;">
        <button class="btn btn-sm dropdown-toggle btn-primary" v-on:click="showDropDown = !showDropDown">
          Quality 
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
                <button type="button" class="btn btn-secondary btn-sm" v-on:click="clearEphemeralFilters">Clear</button>
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
          gPassQC: {
            title: "All variants which pass QC",
            allTrue: false,
            members: {
              PASS: { 
                title: "PASS", 
                val: false,
                desc: "All filters passed"
              }
            }
          },
          gFailQC:{
            title: "All variants which failed QC",
            allTrue: false,
            members: {
              SVM: { 
                title: "SVM", 
                val: false,
                desc: "Variant failed SVM filter"
              },
              DISC: { 
                title: "DISC", 
                val: false,
                desc: "Mendelian or duplicate genotype discordance is high"
              },
              EXHET: { 
                title: "EXHET", 
                val: false,
                desc: "Excess heterozygosity"
              }
            }
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
        this.$emit('filterChange', 'qualityFitler', this.filterToArray(this.pFilter))
      },
      applyFilters: function() {
        if( JSON.stringify(this.pFilter) === JSON.stringify(this.eFilter)){
          return
        }
        // Make ephemeral selection persistent
        this.pFilter = clone(this.eFilter)

        this.emitFilterChange()
        this.showDropDown = false
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
