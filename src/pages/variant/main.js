import { createApp } from 'vue'
import App from './Variant.vue'
import VueGtag from 'vue-gtag'
import 'bootstrap/dist/css/bootstrap.css'
import '@/assets/bravo.css'
import {clickOutside} from '@/CustomDirectives'
import { authExpectedMount } from '@/AuthAwareMount'

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

authExpectedMount(app, '#app')
