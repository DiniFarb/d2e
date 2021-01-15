<template>
  <v-app id="app">
    <router-view></router-view>
  </v-app>
</template>
<script>

export default {
 
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #606a78;
  background: #2a3441;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #a2a7af;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
