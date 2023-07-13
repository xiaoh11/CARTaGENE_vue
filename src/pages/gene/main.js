import { createApp } from 'vue'
import App from './GenePage.vue'
import VueGtag from 'vue-gtag'
import 'bootstrap/dist/css/bootstrap.css'
import 'tabulator-tables/dist/css/bootstrap/tabulator_bootstrap.css'
import '@/assets/bravo.css'
import '@/assets/snv_consequences.css'
import '@/assets/snv_tabulator_table.css'
import {clickOutside} from '@/CustomDirectives'
import { agreementExpectedMount } from '@/AuthAwareMount'

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

app.directive('click-outside', clickOutside)

// Temporary config for refs in provide/inject.
//   see: https://vuejs.org/guide/components/provide-inject.html#working-with-reactivity
app.config.unwrapInjectedRef = true

agreementExpectedMount(app, '#app')
