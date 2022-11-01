<template>
  <NavBar/>
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="col-10 col-sm-8 col-md-6">
      <h1 style="margin-bottom: 1em">Terms of Use</h1>
      <p>To use this site, you must agree with all of the following:</p>
        <ul>
          <li>You will not attempt to download any dataset in bulk from this website.</li>
          <li>You will not attempt to re-identify or contact research participants.</li>
          <li>You will protect data confidentiality.</li>
          <li>You will report any inadvertent data release,
          security breach or other data management incident of which you become aware.</li>
          <li>You will abide by all applicable laws and regulations for handling genomic data.</li>
          <li>You will not share data from this site with others.
        Instead, please direct them to this site, dbGaP, or elsewhere to view this data.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../../components/NavBar.vue'

export default {
  name: 'App',
  components: {NavBar}
    
}
</script>
