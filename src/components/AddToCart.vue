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
      async addLineItem() {
        const cart = this.me.activeCart ? this.me.activeCart : await this.createCart();
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
                centAmount
              }
            }
          }`,
          variables: {
            id: cart.id,
            version: cart.version,
            productId: this.productId,
          },
        });
      },

      createCart() {
        return this.$apollo.mutate({
          mutation: gql`
            mutation {
              createMyCart(draft: {
                currency: "EUR"
                shippingAddress: { country: "DE" }
              }) {
                id
                version
              }
            }`,
          refetchQueries: ['me']
        }).then(result => result.data.createMyCart);
      }
    },
  }
</script>
