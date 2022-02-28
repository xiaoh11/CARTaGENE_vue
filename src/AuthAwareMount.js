/* Mount Vue app with respect to auth status 
 * When:
 *  - login disabled: mount app normally
 *  - authenticated: set user and loginDisabled props.
 *  - unauthenticated: redirect to API login endpoint.
 *
 * Expected use:
 *   var authProps = { z_user: null, z_login_disabled: true }
 *   const app = createApp(App, authProps);
 *   authAwareMount(app, '#app')
 */

import axios from 'axios'

// Expects app to have user and login_disabled props
// Auth redirect if auth being used by API
function authAwareMount(app, mountPoint){
  axios.get(process.env.VUE_APP_BRAVO_API_URL + '/auth_status', {withCredentials: true})
    .then(function(resp){
      if(resp.data.login_disabled){
        app.mount(mountPoint)
      }else if(resp.data.authenticated){
        console.log('authenticated')
        app.provide('user', resp.data.user) 
        app.provide('loginDisabled', resp.data.login_disabled) 
        app.mount(mountPoint)
      } else {
        console.log('NOT authenticated')
        // Redirect to login passing current location as the eventual destination
        let dest = encodeURIComponent(window.location.href)
        window.location.href = process.env.VUE_APP_BRAVO_API_URL + '/login?dest=' + dest
      }
    })
}

export {authAwareMount}
