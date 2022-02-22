<template>
  <NavBar style="margin-left: 5px;"/>

  <div class="LoginStatus">
    <h2>Login Status</h2>
    <ul>
      <li>user: {{user}}</li>
      <li>active: {{active}}</li>
      <li>authenticated: {{authenticated}}</li>
    </ul>
    <pre>
    {{info}}
    </pre>
    <h2> Login/Logout </h2>
    <button v-if="user == null" v-on:click="handle_login()">Login</button>
    <button v-else v-on:click="handle_logout()">Logout</button>
    <p>
      {{api_auth_status}}
    </p>
    <p>
    End
    </p>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import axios from 'axios';
axios.defaults.headers.post['X-Requested-With']='XMLHttpRequest'
axios.defaults.withCredentials=true

export default {
  name: 'App',
  components: {
    NavBar,
  },
  data: function(){ 
    return {
      user: null,
      active: false,
      authenticated: false,
      info: '',
      api_auth_status: {}
    }
  },
  methods:{
    update_api_auth_status: function() {
      axios.get(process.env.VUE_APP_BRAVO_API_URL + '/auth_status', {withCredentials: true})
        .then(function(resp){ 
          this.api_auth_status = resp 
        })
    },
    set_state: function(state){
      this.info = state
      this.user = state.user
      this.active = state.active
      this.authenticated = state.authenticated
    },

    handle_logout: function(){ 
      axios({
        method: 'post',
        url:  'http://127.0.0.1:5000/logout',
        withCredentials: true,
        data: {}})
      .then(response => { this.set_state(response.data) })
    },

    handle_login: function() {
      this.$gAuth
        .getAuthCode()
        .then((authCode) => {
          axios({
            method: 'post',
            url:  'http://127.0.0.1:5000/auth_code',
            withCredentials: true,
            data: {code: authCode, redirect_uri: 'postmessage'}})
            .then(response => { 
              this.set_state(response.data) 
              this.update_api_auth_status()
            })
        })
        .catch((error) => {
          this.info = error
        });
    }
  },
  mounted () {
    axios
      .get('http://127.0.0.1:5000/auth_status', {withCredentials: true})
      .then(response => {
        this.info = response.data
        this.user = response.data.user
        this.active = response.data.active
        this.authenticated = response.data.authenticated
      })
  }
}
</script>

