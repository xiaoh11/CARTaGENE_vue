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
  name: 'BravoSearch',
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
      const p_query = query.replace(/,/g, '').trim();

      // check for empty or null query
      if(!p_query){
        return {endpoint: 'notfound'};
      }

      // check query for DbSNP format 
      const patt_rsid = /^rs(\d+)$/i;
      if(patt_rsid.test(p_query)){
        return {
          variant_type: 'snv',
          endpoint: 'variant'
        }
      }

      // check query for region format
      //pattern parts:      chromsome-------------          start---          end-----
      const patt_region = /^(?:CHR)?(\d+|X|Y|M|MT)\s*[-:]\s*([\d,]+)\s*[-:]\s*([\d,]+)$/i;
      const region_matches = p_query.match(patt_region);
      if(region_matches){
        return {
          variant_type: 'snv',
          endpoint: 'region',
          chrom: region_matches[1],
          start: region_matches[2],
          stop: region_matches[3]
        }
      }

      // check query for VCF style variant format 
      //pattern parts:           chromsome-------------          start---          end-----          ref------          alt-----
      const vcf_variant_patt = /^(?:CHR)?(\d+|X|Y|M|MT)\s*[-:]\s*([\d,]+)\s*[-:]\s*([\d,]+)\s*[-:]\s*([ATCG]+)\s*[-:]\s*([ATCG]+)$/i; 
      const vcf_variant_matches = p_query.match(vcf_variant_patt);
      if(vcf_variant_matches){
        return { 
          variant_type: 'snv',
          endpoint: 'variant',
          chrom: vcf_variant_matches[1],
          start: vcf_variant_matches[2],
          stop: vcf_variant_matches[3],
          ref: vcf_variant_matches[4],
          alt: vcf_variant_matches[5]
        }
      }
      return {endpoint: 'gene', variant_type: 'snv'}
    },
    resultTicketToHref: function(ticket) {
      // Append .html extension until dev server mime-type issue is resolved.
      let href = ticket.endpoint + '.html'
      
      delete ticket.endpoint

      let paramContent = []
      for(var p in ticket){
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
      let rTic = suggestion.data;
      if(rTic.feature === 'snv'){
        rTic.variant_type = 'snv';
        rTic.endpoint = 'variant';
        [rTic.chrom, rTic.pos, rTic.ref, rTic.alt] = suggestion.data.variant_id.split('-');
      }else{
        rTic.endpoint = rTic.feature;
      }
      return(rTic);
    },
    doSearch: function() {
      //convert query string from autocomplete input element to result ticket
      let resultTicket = this.queryToResultTicket(this.$refs.autocomplete.$el.value);
      //convert result ticket to href
      let resultUrl = this.resultTicketToHref(resultTicket);
      //instruct browser to goto href
      console.log(resultUrl);
      window.location.assign(resultUrl);
    },
    doSuggest: function(suggestion) {
      //convert suggestion to resultTicket.
      let resultTicket = this.suggestToResultTicket(suggestion);
      //convert result ticket to href
      let resultUrl = this.resultTicketToHref(resultTicket);
      //instruct browser to goto href
      console.log(resultUrl);
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
    isEmpty: function(e) {
      if (this.$refs.autocomplete.isEmpty()) {
        e.preventDefault();
      }
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
