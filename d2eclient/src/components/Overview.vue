<template>
  <v-container >
    <h1 class="OVTitle">Overview</h1>
    <v-card v-if="!this.dash.importState.startsWith('No data')"
            class="overview">
      <v-card-text>
        <p v-if="!this.dash.importState.startsWith('No data')">Last import 🟢</p>
        <div>OPC Server Tags</div>
        <p class="display-1 text--primary">
          {{this.dash.summary.objectsTotal}}
        </p>
        <div>Valid Tags</div>
        <p class="display-1 text--primary">
          {{this.dash.summary.validObjects}}
        </p>
        <div>
        <div>Analog Tags</div>
        <p class="display-1 text--primary">
          {{this.dash.summary.analogValues}}
        </p>
        <div>Binary Tags</div>
        <p class="display-1 text--primary">
          {{this.dash.summary.binaryValues}}
        </p>
        </div>
      </v-card-text>
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
.overview{
  background: #464b4f;
}
</style>
