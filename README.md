# commercetools GraphQL Vue.js

[![Netlify Status](https://api.netlify.com/api/v1/badges/c48dc8e1-1cf6-48e9-b037-dd40527ab679/deploy-status)](https://app.netlify.com/sites/commercetools-graphql-vue/deploys)

## Demo
https://commercetools-graphql-vue.netlify.com/

## Requirements
- [Yarn](https://yarnpkg.com/en/) installed

## Commands

Project setup
```
yarn install
```

Compiles and hot-reloads for development
```
yarn run serve
```

Compiles and minifies for production
```
yarn run build
```

## How to re-create this project

This is the setup that was used to create and connect this project to commercetools GraphQL API.

### Steps
Create project with [Vue CLI](https://github.com/vuejs/vue-cli) (default settings)
```
vue create commercetools-graphql-vue
```

Add apollo as dependency (default options)
```
cd commercetools-graphql-vue
vue add apollo
```
Install commercetools Auth SDK
```
yarn add @commercetools/sdk-auth
```
Replace `src/vue-apollo.js` content with this code
```javascript
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import SdkAuth, { TokenProvider } from '@commercetools/sdk-auth';

// Create token provider for the commercetools project
const tokenProvider = new TokenProvider({
  sdkAuth: new SdkAuth({
    host: 'https://auth.sphere.io',
    projectKey: 'graphql-webinar',
    credentials: {
      clientId: 'EepIOtr0P2evGfeWCAh48qIs',
      clientSecret: 'nCmLN6J5bCSx0ZoicI5GpoyibjnUDnHk',
    },
    scopes: ['manage_my_orders:graphql-webinar', 'view_products:graphql-webinar'],
  }),
  fetchTokenInfo: sdkAuth => sdkAuth.anonymousFlow(),
});

const httpLink = createHttpLink({
  uri: 'https://api.sphere.io/graphql-webinar/graphql',
});

const authLink = setContext((_, { headers = {} }) => tokenProvider.getTokenInfo()
  .then(tokenInfo => `${tokenInfo.token_type} ${tokenInfo.access_token}`)
  .then(authorization => ({ headers: { ...headers, authorization } })));

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
```

Replace `src/main.js` content with this code
```javascript
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
```

Now you can create GraphQL queries and mutations to commercetools in any Vue component. 
