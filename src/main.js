// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Uimini from 'uimini/src/stylus/main.styl'

import App from './App'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.use(
  Vuelidate,
  Uimini
)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: 'AIzaSyDQEdoMDIvV41uAZWbHSOm_pmmNaaDQLZI',
      authDomain: 'film-library-kraken.firebaseapp.com',
      databaseURL: 'https://film-library-kraken.firebaseio.com',
      projectId: 'film-library-kraken',
      storageBucket: 'film-library-kraken.appspot.com',
      messagingSenderId: '841174236072',
      appId: '1:841174236072:web:c9cfa89cd9598dcb803b9d',
      measurementId: 'G-DREJ3YB6G3'
    }
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig)

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('loggedUser', user)

        // Loading All Tasks
        this.$store.dispatch('loadTasks')

        // Loading All Tags
        this.$store.dispatch('loadTags')

        console.log(this.$store.getters.message.title)
      }
    })
  }
})
