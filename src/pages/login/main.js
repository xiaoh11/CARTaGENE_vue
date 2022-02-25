import { createApp } from 'vue'
import App from './LoginPage.vue'

import VueGtag from 'vue-gtag'
import 'bootstrap/dist/css/bootstrap.css'
import 'tabulator-tables/dist/css/bootstrap/tabulator_bootstrap.css'
import '@/assets/bravo.css'
import '@/assets/snv_consequences.css'
import '@/assets/snv_tabulator_table.css'
import {clickOutside} from '@/CustomDirectives'
import axios from 'axios'

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

// Auth redirect if auth being used by API
axios.get(process.env.VUE_APP_BRAVO_API_URL + '/auth_status', {withCredentials: true})
  .then(function(resp){
    if(resp.data.login_disabled){
      console.log('login disabled')
      app.mount('#app')
    }else if(resp.data.authenticated){
      console.log('authenticated')
      app.mount('#app')
    } else {
      console.log('NOT authenticated')
      // Redirect to login passing this location as the eventual destination
      let dest = encodeURIComponent(window.location.href)
      window.location.href=process.env.VUE_APP_BRAVO_API_URL + '/login?dest=' + dest
    }
  })
