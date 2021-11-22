import { createApp } from 'vue'
import App from './RegionPage.vue'
import VueGtag from 'vue-gtag'
import 'bootstrap/dist/css/bootstrap.min.css'
//import 'tabulator-tables/dist/css/tabulator_bootstrap4.min.css'
import '@/assets/debug_tabulator.css'
import '@/assets/bravo.css'
import '@/assets/snv_consequences.css'
import '@/assets/snv_tabulator_table.css'
import {clickOutside} from '@/CustomDirectives'

const app = createApp(App);

// Inject gtag header if config includes a non-blank google analyitics id
if(process.env.GA_ID){
  app.use(VueGtag, {
    property: {
      id: process.env.VUE_APP_GA_ID,
      send_page_view: true
    }
  });
}

app.directive('click-outside', clickOutside);

app.mount('#app');
