<template>
  <NavBar/>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-10 col-sm-8 col-md-6">
        <h1 style="margin-bottom: 1em">About CARTaGENE Variant Browser</h1>
        <p>
        This variant browser shows chromosome locations, alleles, functional annotations, and allele frequencies for over 80 million variants observed in 2,173 deeply sequenced genomes from the CARTaGENE study in Quebec, Canada.
        </p>
        <p>
        The information is publicly available for users that agree to the <a href="terms.html">terms</a>.
        </p>
        <p>
        This variant browser is built using the open source BRAVO platform:
        <ul>
          <li>
            BRAVO API application at <a href="https://github.com/statgen/bravo_api.git">bravo_api</a>
          </li>
          <li>
            BRAVO UI application at <a href="https://github.com/statgen/bravo_vue.git">bravo_vue</a>
          </li>
        </ul>
        
        </p>
        <p>
        If you have a question about the CARTaGENE variant browser, contact <a href="">this email</a>
        </p>
        <p>
          <small>Bravo UI version: {{uiVersion}}</small>, <small>Bravo API version: {{apiVersion}}</small>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {NavBar},
  data() {
    return {
      uiVersion: process.env.VUE_APP_VERSION,
      apiVersionURL: process.env.VUE_APP_BRAVO_API_URL + '/version',
      apiVersion: ""
    }
  },
  mounted: function() {
    axios.get(this.apiVersionURL)
      .then(resp => {
        this.apiVersion = resp.data.version
      })
  }
}
</script>
