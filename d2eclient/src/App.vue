<template>
  <v-app id="app">
    <AppBar></AppBar>
    <v-container>
      <br>
      <router-view :state="state"></router-view>
      <div>
        <v-alert class="error" v-if="error">Something went wrong 😐 <br>{{error}}</v-alert>
      </div>
    </v-container>

  </v-app>
</template>
<script>
import AppBar from '@/views/AppBar';
import REST_interface from './REST_interface'
export default {
  components: {
    AppBar: AppBar
  },
  data() {
    return {
      state: [],
      error: '',
    }
  },
  async created() {
    try {
      this.state = await REST_interface.getState();
    } catch (e) {
      this.error = e.message;
    }
  },
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
