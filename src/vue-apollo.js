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
    inMemoryCacheOptions: { freezeResults: false }
  });

  return new VueApollo({ defaultClient: apolloClient });
}