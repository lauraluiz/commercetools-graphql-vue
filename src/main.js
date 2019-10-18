import Vue from 'vue'
import VueApollo from 'vue-apollo'
import apolloClient  from './vue-apollo'
import App from './App.vue'

// Install the vue plugin
Vue.use(VueApollo);

Vue.config.productionTip = false;

new Vue({
  apolloProvider: new VueApollo({ defaultClient: apolloClient }),
  render: h => h(App)
}).$mount('#app');
