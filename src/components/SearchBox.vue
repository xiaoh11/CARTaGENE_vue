<template>
  <div id="bravosearch">
    <div class="div-shadow" v-bind:style="{ width: width + 'px', height: height + 'px' }"  v-bind:class="{ 'div-shadow-show': showShadow(), 'div-shadow-expand': isDropdownOpen }"> </div>

    <form id="form" class="search-box" @submit.prevent="doSearch()" @mouseover="isHovered = true" @mouseout="isHovered = false" :class="{ 'search-box-dropdown-open': isDropdownOpen }">

       <!-- v-once should make jQuery plugin to ignore any updates -->
      <AutoComplete ref="autocomplete" v-bind:autofocus="autofocus" 
        v-on:inputfocus="isActive = true" v-on:inputfocusout="isActive = false"
        v-on:dropdownopen="openDropdown(true)" v-on:dropdownclose="openDropdown(false)" 
        v-bind:width = "width" v-on:suggestionSelect="doSuggest">
      </AutoComplete>

      <button class="search-box-button" type="submit">
        <font-awesome-icon :icon="searchIcon"></font-awesome-icon>
      </button>
    </form>
  </div>
</template>

<script>
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import AutoComplete from '@/components/Autocomplete.vue';

export default {
  name: 'SearchBox',
  components: {
    FontAwesomeIcon,
    AutoComplete
  },
  props: {
    autofocus: {
      type: Boolean
    }
  },
  data: function() {
    return {
      width: 600, // arbitrary initial value. will be changed on "mounted" hook
      height: 10,
      isHovered: false,
      isActive: false,
      isDropdownOpen: false,
      searchIcon: faSearch,
      searchapi: process.env.VUE_APP_BRAVO_API_URL + '/search'
    };
  },
  methods: {
    queryToResultTicket: function(query) {
      // pre-process query string
      const pQuery = query.replace(/,/g, '').trim();

      // check for empty or null query
      if(!pQuery){
        return {endpoint: 'notfound'};
      }

      // check query for DbSNP format 
      const pattRsid = /^rs(\d+)$/i;
      if(pattRsid.test(pQuery)){
        return {
          endpoint: 'variant',
          rsId: pQuery
        }
      }

      // check query for region format
      //pattern parts:      chromsome-------------          start---          end-----
      const pattRegion = /^(?:CHR)?(\d+|X|Y|M|MT)\s*[-:]\s*([\d,]+)\s*[-:]\s*([\d,]+)$/i;
      const regionMatches = pQuery.match(pattRegion);
      if(regionMatches){
        return {
          endpoint: 'region',
          chrom: regionMatches[1],
          start: regionMatches[2],
          stop: regionMatches[3]
        }
      }

      // check query for VCF style variant format 
      //pattern parts:           chromsome-------------          start---          end-----          ref------          alt-----
      const vcfVariantPatt = /^(?:CHR)?(\d+|X|Y|M|MT)\s*[-:]\s*([\d,]+)\s*[-:]\s*([\d,]+)\s*[-:]\s*([ATCG]+)\s*[-:]\s*([ATCG]+)$/i; 
      const vcfVariantMatches = pQuery.match(vcfVariantPatt);
      if(vcfVariantMatches){
        return { 
          endpoint: 'variant',
          chrom: vcfVariantMatches[1],
          start: vcfVariantMatches[2],
          stop: vcfVariantMatches[3],
          ref: vcfVariantMatches[4],
          alt: vcfVariantMatches[5]
        }
      }

      // Default to gene endpoint.
      return {
        endpoint: 'gene', 
        id: pQuery
      }
    },
    resultTicketToHref: function(ticket) {
      // Append .html extension until dev server mime-type issue is resolved.
      let href = ticket.endpoint + '.html'

      console.log("In ticket ticket\n" + ticket)
      
      delete ticket.endpoint

      let paramContent = []
      for(let p in ticket){
        if(Object.prototype.hasOwnProperty.call(ticket,p)){
          paramContent.push(
            encodeURIComponent(p) + "=" + encodeURIComponent(ticket[p]) 
          )
        }
      }

      if(paramContent.length){ 
        href += "?" + paramContent.join('&')
      }
      return href
    },
    suggestToResultTicket(suggestion){
      let rTicket = {}

      if(suggestion.data.feature === 'snv'){
        rTicket.endpoint = 'variant';

        let var_id_parts = suggestion.data.variant_id.split('-')
        rTicket.chrom = var_id_parts[0]
        rTicket.pos   = var_id_parts[1]
        rTicket.ref   = var_id_parts[2]
        rTicket.alt   = var_id_parts[3]  
      }else{
        // Default assumes gene endpoint
        rTicket.endpoint = 'gene'
        rTicket.id = suggestion.value
      }
      return(rTicket);
    },
    doSearch: function() {
      //convert query string from autocomplete input element to result ticket
      let resultTicket = this.queryToResultTicket(this.$refs.autocomplete.$el.value)

      //convert result ticket to href
      let resultUrl = this.resultTicketToHref(resultTicket)

      //instruct browser to goto href
      window.location.assign(resultUrl)
    },
    doSuggest: function(suggestion) {
      //convert suggestion to resultTicket.
      let resultTicket = this.suggestToResultTicket(suggestion);

      //convert result ticket to href
      let resultUrl = this.resultTicketToHref(resultTicket);

      //instruct browser to goto href
      window.location.assign(resultUrl);
    },
    onResize: function() {
      var height = this.$el.querySelector("form").getBoundingClientRect().height;
      if (this.isDropdownOpen) {
        // extra 14 pixels to compensate rounded borders
        height += this.$el.querySelector(".autocomplete-suggestions")
          .getBoundingClientRect().height + 14;
      }
      this.width = this.$el.querySelector("form").getBoundingClientRect().width;
      this.height = height;
    },
    openDropdown: function(open) {
      var height = this.$el.querySelector("form").getBoundingClientRect().height;
      if (open) {
        // extra 14 pixels to compensate rounded borders
        height += this.$el.querySelector(".autocomplete-suggestions")
          .getBoundingClientRect().height + 14;
      }
      this.height = height;
      this.isDropdownOpen = open;
    },
    showShadow: function() {
      return this.isHovered || this.isActive;
    },
  },
  mounted: function() {
    this.width = this.$el.querySelector("form").getBoundingClientRect().width;
    this.height = this.$el.querySelector("form").getBoundingClientRect().height;
    window.addEventListener('resize', this.onResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
  }
}
</script>

<style scoped>
.search-box {
   position: relative;
   display: flex;
   flex-direction: row;
   flex-wrap: nowrap;
   border: 0px;
   padding: 5px;
   margin: 0px;
   z-index: 9998;
}
.search-box-dropdown-open {
}
.search-box-dropdown-open::after {
  content: "";
  position: absolute;
  top: calc(100% - 1px);
  -webkit-top: calc(100% - 1px);
  left: 0%;
  width: calc(100% - 26px);
  -webkit-width: calc(100% - 26px);
  margin-left: 13px;
  border-top: 1px solid #ced4da;
}
.div-shadow {
  background-color: white;
  position: absolute;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-radius: 1.2rem;
  border: 1px solid #ced4da;
  z-index: 9998;
}
.div-shadow-show {
  box-shadow: 0px 0px 8px 0 rgba(0, 0, 0, 0.4);
}
.div-shadow-expand {
  border-radius: 1rem 1rem 1rem 1rem;
}
.search-box-button {
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}
.search-box-button:focus {
  border: none;
  box-shadow: none;
  outline: none;
}
#bravosearch :deep(.autocomplete-suggestions) {
  background-color: transparent;
  border: 0px;
  overflow: auto;
  padding-bottom: 0px;
  padding-top: 0px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
#bravosearch :deep(.autocomplete-suggestion) {
  padding: 2px 13px;
  white-space: nowrap;
  overflow: hidden;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
#bravosearch :deep(.autocomplete-selected) {
  background-color: #F0F0F0;
  border-left: 1px solid #ced4da;
  border-right: 1px solid #ced4da;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
</style>
