<template>
  <button @click="placeOrder">Place order</button>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    props: ['cart'],

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
            id: this.cart.id,
            version: this.cart.version,
          },
          refetchQueries: ['me'],
        })
      }
    }  }
</script>
