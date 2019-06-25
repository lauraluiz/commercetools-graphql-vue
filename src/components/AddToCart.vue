<template>
  <button @click="addLineItem">Add</button>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    props: ['productId'],

    apollo: {
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
      addLineItem() {
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
              totalPrice {
                currencyCode
                centAmount
              }
            }
          }`,
          variables: {
            id: this.me.activeCart.id,
            version: this.me.activeCart.version,
            productId: this.productId,
          },
        });
      },
    },
  }
</script>
