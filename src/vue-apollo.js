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

const tokenProvider = new TokenProvider({
  sdkAuth: new SdkAuth({
    host: 'https://auth.commercetools.com',
    projectKey: 'sunrise-spa',
    credentials: {
      clientId: 'Cie7e2JpX5Z0bUzzQUkhAuZh',
      clientSecret: 'QhgNoWJFjKjNSf3Z3MriUulzjGH74MEj',
    },
    scopes: ['view_products:sunrise-spa', 'manage_my_orders:sunrise-spa'],
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
    httpEndpoint: 'https://api.commercetools.com/sunrise-spa/graphql',
    cache: new InMemoryCache(),
    link: authLink,
  });

  apolloClient.wsClient = wsClient;

  return apolloClient;
}

const apolloProvider = new VueApollo({
  defaultClient: createClient(),
  errorHandler(error) {
    // eslint-disable-next-line no-console
    console.error(error);
  },
});
export default apolloProvider;