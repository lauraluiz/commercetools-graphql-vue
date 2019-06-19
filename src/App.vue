<template>
  <div id="app">
    <HelloCart id="cart"/>
    <HelloProduct id="products"/>
  </div>
</template>

<script>
import HelloProduct from './components/HelloProduct.vue'
import HelloCart from './components/HelloCart.vue'

export default {
  name: 'app',
  components: {
    HelloProduct,
    HelloCart,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#cart {
  float:right;
}
#products {
  float: left;
}
</style>
