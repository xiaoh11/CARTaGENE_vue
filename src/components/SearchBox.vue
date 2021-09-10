<template>
  <div id="bravosearch">
    <div class="div-shadow" v-bind:style="{ width: width + 'px', height: height + 'px' }"  v-bind:class="{ 'div-shadow-show': showShadow(), 'div-shadow-expand': isDropdownOpen }"> </div>

    <form id="form" class="search-box" @submit.prevent="doSearch()" @mouseover="isHovered = true" @mouseout="isHovered = false" :class="{ 'search-box-dropdown-open': isDropdownOpen }">
      
      <autocomplete ref="autocomplete" v-bind:autofocus="autofocus" v-on:inputfocus="isActive = true" v-on:inputfocusout="isActive = false" v-on:dropdownopen="openDropdown(true)" v-on:dropdownclose="openDropdown(false)" v-bind:width = "width"></autocomplete> <!-- v-once should make jQuery plugin to ignore any updates -->

      <button class="search-box-button" type="submit">
        <font-awesome-icon :icon="searchIcon"></font-awesome-icon>
      </button>
    </form>
  </div>
</template>

<script>
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import autocomplete from '@/components/Autocomplete.vue';

export default {
  name: 'bravosearch',
  components: {
    FontAwesomeIcon,
    autocomplete
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
      return {query: query};

    },
    resultTicketToUrl: function(ticket) {
      return ticket

    },
    doSearch: function() {
      console.log('Search searhed!');
      console.log(this.$refs.autocomplete.$el.value.trim());
      let resultTicket = this.queryToResultTicket('');
      let resultUrl = this.resultTicketToUrl(resultTicket);
      console.log(resultUrl);
      return false;
    },
    onResize: function() {
      var height = this.$el.querySelector("form").getBoundingClientRect().height;
      if (this.isDropdownOpen) {
        height += this.$el.querySelector(".autocomplete-suggestions").getBoundingClientRect().height + 14; // extra 14 pixels to compensate rounded borders
      }
      this.width = this.$el.querySelector("form").getBoundingClientRect().width;
      this.height = height;
    },
    openDropdown: function(open) {
      var height = this.$el.querySelector("form").getBoundingClientRect().height;
      if (open) {
        height += this.$el.querySelector(".autocomplete-suggestions").getBoundingClientRect().height + 14; // extra 14 pixels to compensate rounded borders
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