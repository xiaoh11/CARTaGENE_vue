<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white">
      <a class="navbar-brand" v-bind:href="publicPath">
        <img class="bo-small-logo" width="34" v-bind:src="logo"/>
      </a>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item"><a class="nav-link btn-sm" href="/about.html">About</a></li>
        </ul>
      </div>
    </nav>
</template>

<script>
import logo from "../assets/bravo_logo_square.png"

export default {
  name: 'NavBar',
  props: { },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      logo: logo
    };
  },
}
</script>
