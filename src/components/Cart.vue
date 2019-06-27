<template>
  <div>
    <div v-if="cartIsNotEmpty">
      <div v-for="lineItem in me.activeCart.lineItems"
           :key="lineItem.id">
        {{ lineItem.quantity }} x {{ lineItem.name }}
      </div>
      <div>{{ totalPrice }} €</div>
      <PlaceOrder :cart="me.activeCart"/>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import PlaceOrder from './PlaceOrder';

  export default {
    components: { PlaceOrder },
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
                centAmount
              }
            }
          }
        }`,
      },
    },
  }
</script>
