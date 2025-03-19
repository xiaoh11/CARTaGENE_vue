<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white">
    <a class="navbar-brand" v-bind:href="publicPath">
      <img class="bo-small-logo" width="100" v-bind:src="logo"/>
    </a>

    <!-- Slot for search box -->
    <slot>
    </slot>

    <div class="collapse navbar-collapse">
      <ul class="navbar-nav ml-auto">
        <div v-if="this.user">
          <li class="nav-item btn-sm">{{user}}</li>
        </div>
        <div v-if="!this.loginDisabled">
          <li class="nav-item"><a class="nav-link btn-sm" :href="this.logInOutUrl">{{logInOutText}}</a></li>
        </div>
        <li class="nav-item"><a class="nav-link btn-sm" href="/about.html">About</a></li>
        <li class="nav-item"><a class="nav-link btn-sm" href="/terms.html">Terms</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
import logo from "../assets/Cartagene_Logos_RVB_Principal_Bicolore_Foncé.png"

export default {
  name: 'NavBar',
  inject: {
    user: {default: null},
    loginDisabled: {default: true}
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      logo: logo,
      api: process.env.VUE_APP_BRAVO_API_URL
    };
  },
  computed: {
    logInOutUrl: function(){
      if(this.user){
        return('/logout.html')
      } else {
        let dest = encodeURIComponent(window.location.href)
        return(this.api + '/login?dest=' + dest)
      }
    },
    logInOutText: function(){
      if(this.user){
        return('Logout')
      } else {
        return('Login')
      }
    }
  }
}
</script>
