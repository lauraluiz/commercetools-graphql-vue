<template>
  <div v-if="products">
    <u>{{ products.total }} total products</u>
    <div v-for="product in products.results"
         :key="product.id">
      {{ product.masterData.current.name }}
      <AddToCart :product-id="product.id"/>
    </div>
  </div>
</template>

<script>
  import gql from 'graphql-tag';
  import AddToCart from './AddToCart';

  export default {
    components: {AddToCart},
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
    },
  }
</script>