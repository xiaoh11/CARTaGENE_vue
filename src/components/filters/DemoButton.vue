<script>
import BaseFilterButton from '@/components/filters/BaseFilterButton.vue'
//import clone from 'just-clone';

export default {
  name: "DemoButton",
  extends: BaseFilterButton,
  data: function() {
    return ({
      pFilter: {
        gColorFilter: {
          title: "Example Filter Group",
          allTrue: false,
          members: {
            blue: { 
              title: "Blue", 
              val: false,
              desc: "Is blue."
            },
            pink: { 
              title: "pink", 
              val: false,
              desc: "Is pink"
            }
          }
        },
      },
    })
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
