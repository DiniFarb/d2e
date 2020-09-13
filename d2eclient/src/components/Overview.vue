<template>
  <v-container >
    <h1 class="OVTitle">Overview</h1>
    <v-card v-if="!this.dash.importState.startsWith('No data')"
            class="overview">
      <v-card-text>
        <v-row>
          <v-col>
        <p>Last import 🟢</p>
          </v-col>
          <v-col>
            <p>Total OPC server tags: {{this.dash.summary.objectsTotal}} </p>
          </v-col>
          <v-col>
            <p>Total filtered out: -{{this.dash.summary.objectsTotal - this.dash.summary.validObjects}}</p>
          </v-col>
        </v-row>
            <div>Total tags in scope</div>
            <p class="display-1 text--primary">
              {{this.dash.summary.validObjects}}
            </p>
        <v-row>
          <v-col>
        <div>Analog tags</div>
        <p class="display-1 text--primary">
          {{this.dash.summary.analogValues}}
        </p>
          </v-col>
          <v-col>
        <div>Binary tags</div>
        <p class="display-1 text--primary">
          {{this.dash.summary.binaryValues}}
        </p>
          </v-col>
          <v-col>
            <div>Desigo server tags</div>
            <p class="display-1 text--primary">
              {{this.dash.summary.desigoCCValues}}
            </p>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card v-if="this.dash.importState.startsWith('No data')"
            class="overview">
      <v-alert class="error">No data import yet 😥 ... <br>Ask siemens for help🧠</v-alert>
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

    },
  }
}
</script>

<style scoped>
.OVTitle{
  font-size: xx-large;
  color: #ffffff;
}
.overview{
  background: #464b4f;
}
</style>
