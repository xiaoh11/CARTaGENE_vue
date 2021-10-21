<template>
  <div style="display: inline-block;">
    <button class="parent-menu-button" v-on:click="showListDropDown = !showListDropDown">
      {{listTitle}} <font-awesome-icon style="background-color: transparent; display: inline-block; vertical-align: middle" :icon="icon"></font-awesome-icon>
    </button>
    <div v-if="showListDropDown" class="parent-menu-dropdown">
      <template v-for="(varContent, varKey) in listVars" :key='varKey' >
      <div>
        <a href="#" v-on:click.prevent="emitToggle(varKey)">
          <div v-bind:style="onOffStyle(varContent.val)">&#10004;</div>
          {{varContent.title}}
        </a>
      </div>
      </template>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

export default {
  name: "ToggleList",
  components: {FontAwesomeIcon},
  data: function() {
    return {
      showListDropDown: false
    }
  },
  props: {
    listTitle: {
      type: String,
      required: true
    },
    listGroup: {
      type: String,
      default: "varToggleGroup"
    },
    listVars: {
      type: Object,
      default() {
        return {
          var1: { title: 'Var One', val: true },
          var2: { title: 'Var Two', val: true },
          var3: { title: 'Var Tri', val: false }
        }
      }
    },
    icon: { 
      default: faEllipsisV
    }
  },
  emits: ['varToggled'],
  methods: {
    emitToggle: function(varKey) {
      this.$emit('varToggled', this.listGroup, varKey)
      this.showListDropDown = false
    },
    onOffStyle: function(boolVar) {
      return boolVar ? 'display: inline;' : 'display: inline; visibility: hidden;'
    },
  }
}
</script>

<style scoped>
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
