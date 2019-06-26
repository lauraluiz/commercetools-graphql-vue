import Vue from 'vue';
import VueApollo from 'vue-apollo';
import SdkAuth, { TokenProvider } from '@commercetools/sdk-auth';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { createApolloClient } from 'vue-cli-plugin-apollo/graphql-client';

// Install the vue plugin
Vue.use(VueApollo);

const tokenInfoStorageName = 'token';
let storedTokenInfo;

// JUST FOR DEMO PURPOSES!
// best practice would be to put the credentials in an external configuration file
const tokenProvider = new TokenProvider({
  sdkAuth: new SdkAuth({
    host: 'https://auth.sphere.io',
    projectKey: 'graphql-webinar',
    credentials: {
      clientId: 'is9ea6eVSatpeUSplttICYik',
      clientSecret: 'VifeyXjhHLi3ZWSH1w1XK31vj9wOz9td',
    },
    scopes: ['view_products:graphql-webinar', 'manage_my_orders:graphql-webinar'],
  }),
  fetchTokenInfo: sdkAuth => sdkAuth.anonymousFlow(),
  onTokenInfoChanged: tokenInfo => localStorage.setItem(tokenInfoStorageName, JSON.stringify(tokenInfo)),
}, storedTokenInfo);

const buildAuthorizationHeader = () => tokenProvider.getTokenInfo()
  .then(tokenInfo => `${tokenInfo.token_type} ${tokenInfo.access_token}`);

function getAuthToken() {
  return buildAuthorizationHeader().catch((error) => {
    // eslint-disable-next-line no-console
    console.warn('Could not connect to commercetools, cleaning up session...', error);
    localStorage.removeItem(tokenInfoStorageName);
    return buildAuthorizationHeader();
  });
}

function createClient() {
  const authLink = setContext((_, { headers = {} }) => getAuthToken()
    .then(authorization => ({ headers: { ...headers, authorization } })));

  const { apolloClient, wsClient } = createApolloClient({
    httpEndpoint: 'https://api.sphere.io/graphql-webinar/graphql',
    cache: new InMemoryCache(),
    link: authLink,
  });

  apolloClient.wsClient = wsClient;

  return apolloClient;
}

export function createProvider() {
  return new VueApollo({
    defaultClient: createClient(),
    errorHandler(error) {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });
}