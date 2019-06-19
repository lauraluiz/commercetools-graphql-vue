<template>
  <div>
    <div v-if="me && me.activeCart">
      <div v-for="lineItem in me.activeCart.lineItems"
           :key="lineItem.id">
        {{ lineItem.quantity }} x {{ lineItem.name }}
      </div>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    name: "HelloCart",

    apollo: {
      me: {
        query: gql`
        query me {
          me {
            activeCart {
              id
              lineItems {
                id
                name(locale: "en")
                quantity
              }
            }
          }
        }`,
      }
    }
  }
</script>
