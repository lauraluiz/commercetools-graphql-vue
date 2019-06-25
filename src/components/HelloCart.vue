<template>
  <div>
    <div v-if="cartIsNotEmpty">
      <div v-for="lineItem in me.activeCart.lineItems"
           :key="lineItem.id">
        {{ lineItem.quantity }} x {{ lineItem.name }}
      </div>
      <div>{{ totalPrice }} €</div>
      <button @click="placeOrder">Place order</button>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    name: "HelloCart",

    computed: {
      cartIsNotEmpty() {
        return this.me && this.me.activeCart && this.me.activeCart.lineItems.length;
      },

      totalPrice() {
        return this.me.activeCart.totalPrice.centAmount / 100;
      }
    },

    apollo: {
      me: {
        query: gql`
        query me {
          me {
            activeCart {
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
          }
        }`,
      },
    },

    methods: {
      placeOrder() {
        return this.$apollo.mutate({
          mutation: gql`
          mutation ($id: String!, $version: Long!) {
            createMyOrderFromCart(draft: {
              id: $id
              version: $version
            }) {
              id
            }
          }`,
          variables: {
            id: this.me.activeCart.id,
            version: this.me.activeCart.version,
          },
          refetchQueries: ['me'],
        })
      }
    }
  }
</script>
