import Vue from 'vue'
import App from './App.vue'
import apolloProvider from './vue-apollo'

Vue.config.productionTip = false

new Vue({
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
