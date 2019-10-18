# GraphQL webinar

## Requirements
- [Vue CLI](https://github.com/vuejs/vue-cli) installed
- [Yarn](https://yarnpkg.com/en/) installed

## Step by step

Create project with Vue CLI (default settings)
```
vue create webinar
```

Add apollo as dependency (default options)
```
cd webinar
vue add apollo
```
Install commercetools Auth SDK
```
yarn add @commercetools/sdk-auth
```
Replace `src/vue-apollo.js` content with this code
```javascript
import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client'
import { setContext } from 'apollo-link-context';
import SdkAuth, { TokenProvider } from '@commercetools/sdk-auth';

// Install the vue plugin
Vue.use(VueApollo);

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

// Call this in the Vue app file
export function createProvider() {
  const authLink = setContext((_, { headers = {} }) => tokenProvider.getTokenInfo()
    .then(tokenInfo => `${tokenInfo.token_type} ${tokenInfo.access_token}`)
    .then(authorization => ({ headers: { ...headers, authorization } })));

  const { apolloClient } = createApolloClient({
    httpEndpoint: 'https://api.sphere.io/graphql-webinar/graphql',
    link: authLink,
    inMemoryCacheOptions: { freezeResults: false },
  });

  return new VueApollo({ defaultClient: apolloClient });
}
```

Now you can create GraphQL queries and mutations to commercetools in any Vue component. 



## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
