<template>
  <v-container>
      <h1
      class="OVTitle"
      >Overview</h1>
    <v-card>
      <v-card-title
      class="justify-lg-center"
      >{{this.dash.importState}}</v-card-title>
    </v-card>
  </v-container>
</template>

<script>
import REST_interface from "@/REST_interface";

export default {
  name: "Overview",

  data() {
    return {
      dash: "",
    }
  },
  mounted() {
   this.getOverview();
  },

  methods: {
    async getOverview() {
     this.dash =  await REST_interface.getState();
     console.log(this.dash);
    },
  }
}
</script>

<style scoped>
.OVTitle{
  font-size: xx-large;
  color: #ffffff;
}
</style>
