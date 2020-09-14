<template>
  <v-container >
    <h1 class="OVTitle">Overview</h1>
    <v-card v-if="importState" class="pa-1 overview">
      <v-alert dense class="text--accent-1 ma-2" type="success">Last import at <span class="lastImport">{{this.lastImport}}</span></v-alert>
      <v-card-text>
            <div>Total tags in scope</div>
            <p class="display-1 text--primary">
              {{this.dash.summary.validObjects}}
            </p>
        <div class="pieChartSubSystem"></div>
        <v-row
            justify="center" >
          <v-col cols="3">
            <div>S7 tags</div>
            <p class="display-1 text--primary">
              {{this.dash.summary.S7Values}}
            </p>
          </v-col>
          <v-col cols="3">
            <div>BAC tags</div>
            <p class="display-1 text--primary">
              {{this.dash.summary.BACValues}}
            </p>
          </v-col>
        </v-row>
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
    <v-alert v-if="!importState" class="error">No data import yet 😥 ... <br>Ask siemens for help🧠</v-alert>
  </v-container>
</template>

<script>
import REST_interface from "@/REST_interface";

export default {
  name: "Overview",

  data() {
    return {
      dash: "",
      lastImport: "",
      importState: false
    }
  },
  mounted() {
   this.getOverview();
  },

  methods: {
    async getOverview() {
      try {
        this.dash = await REST_interface.getState();
        this.lastImport = this.parseDate(this.dash.summary.updated_at);
        this.importState = this.dash.importState;
      } catch (e) {
        this.importState = false
      }

    },

    parseDate(date){
    return new Date(date).toDateString();
    }
  }
}
</script>

<style scoped>
.OVTitle{
  font-size: xx-large;
  color: #ffffff;
}
.overview{
  background: #34495E;
}
.boxes{
  background: #5D6D7E;
}
.lastImport {
  font-weight: bold;
}

</style>
