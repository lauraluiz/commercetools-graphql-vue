<template>
  <div id="app">
    <Cart id="cart"/>
    <Products id="products"/>
  </div>
</template>

<script>
import Products from './components/Products.vue'
import Cart from './components/Cart.vue'

export default {
  name: 'app',
  components: {
    Products,
    Cart,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  padding: 0 100px;
}

#cart {
  float:right;
}

#products {
  float: left;
}
</style>
