<template>
  <div v-if="products">
    <u>{{ products.total }} total products</u>
    <div v-for="product in products.results"
         :key="product.id">
      {{ product.masterData.current.name }}
      <button @click="addLineItem(product.id)">Add</button>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    apollo: {
      products: {
        query: gql`
        query products {
          products(limit: 10) {
            total
            results {
              id
              masterData {
                current {
                  name(locale: "en")
                }
              }
            }
          }
        }`,
      },
      me: {
        query: gql`
        query me {
          me {
            activeCart {
              id
              version
            }
          }
        }`,
      }
    },

    methods: {
      addLineItem(productId) {
        return this.$apollo.mutate({
          mutation: gql`
          mutation ($id: String!, $version: Long!, $productId: String!) {
            updateMyCart(id: $id, version: $version, actions: {
              addLineItem: {
                productId: $productId
              }
            }) {
              id
              version
              lineItems {
                id
                name(locale: "en")
                quantity
              }
            }
          }`,
          variables: {
            id: this.me.activeCart.id,
            version: this.me.activeCart.version,
            productId,
          },
        });
      },
    },
  }
</script>