<template>
  <v-card class="grey darken-3">
    <v-card-title
    class="accent"
    >Download files ..
    <v-spacer></v-spacer>
    <v-btn
    @click="close"
    >close</v-btn> 
    </v-card-title>
    <div class=" ma-2 pa-1">
    <v-progress-linear
      v-if="loading"
      color="accent"
      indeterminate
      rounded
      height="60"
      >Creating files...
    </v-progress-linear>
    <v-alert type="success" text v-if="!loading && error === ''">
      Flies are ready to downlaod
    </v-alert>
    <v-alert type="error" text v-if="error !== ''">
      {{ error }}
    </v-alert>
     </div>
    <v-card-actions 
     class="d-flex justify-center"
    >
      <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
      <v-btn
          class="ma-1" 
          @click="downloadClientList('001')"
          :disabled="loading || error !== ''"
          v-bind="attrs"
          v-on="on">
        Client 1
      </v-btn>
      </template>
      <span>BACnet values of B01</span>
      </v-tooltip>

      <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
      <v-btn
          class="ma-1" 
          @click="downloadClientList('002')"
          :disabled="loading || error !== ''"
          v-bind="attrs"
          v-on="on">
        Client 2
      </v-btn>
      </template>
      <span>BACnet values of B02</span>
      </v-tooltip>

      <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
      <v-btn
          class="ma-1" 
          @click="downloadClientList('003')"
          :disabled="loading || error !== ''"
          v-bind="attrs"
          v-on="on">
        Client 3
      </v-btn>
      </template>
      <span>BACnet values of B03 / B05 / B06 / B07</span>
      </v-tooltip>

      <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
      <v-btn
          class="ma-1" 
          @click="downloadClientList('004')"
          :disabled="loading || error !== ''"
          v-bind="attrs"
          v-on="on">
        Client 4
      </v-btn>
      </template>
      <span>S7 values of B06</span>
      </v-tooltip>

      <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
      <v-btn
          class="ma-1" 
          @click="downloadClientList('005')"
          :disabled="loading || error !== ''"
          v-bind="attrs"
          v-on="on">
        Client 5
      </v-btn>
      </template>
      <span>S7 values of B01 / B02 / B03 / B04</span>
      </v-tooltip>
     
     <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
      <v-btn
          class="ma-1" 
          @click="downloadClientList('006')"
          :disabled="loading || error !== ''"
          v-bind="attrs"
          v-on="on">
        Client 6
      </v-btn>
      </template>
      <span>DesigoCC values</span>
      </v-tooltip>
      
      <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
      <v-btn
          class="ma-1" 
          @click="downloadAliasList()"
          :disabled="loading || error !== ''"
          v-bind="attrs"
          v-on="on">
        Alias list
      </v-btn>
      </template>
      <span>Alias list for SQL connection</span>
      </v-tooltip>
    </v-card-actions>
    <v-card-text>
      The client files are divided by buildings and drivers..
    </v-card-text>
  </v-card>
</template>

<script>
import REST_interface from "@/REST_interface";

export default {
  name: "Download",
  props: {
    filekey: String,
  },
  data() {
    return {
      loading: false,
      error: "",
      fKey: this.filekey,
      downloadActive: false,
    };
  },
  async created() {
    await this.creatingFiles(this.fKey);
  },
  methods: {
    close() {
      this.$emit("close-download");
    },
    async creatingFiles(key) {
      try {
        this.loading = true;
        await REST_interface.createOPCfiles(key);
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.error = e.message;
      }
    },
    async downloadClientList(clientNumber) {
      try {
        this.downloadActive = true;
        await REST_interface.getClientList(clientNumber);
        this.downloadActive = false;
      } catch (e) {
        this.error = e.message;
        this.downloadActive = false;
      }
    },
    async downloadAliasList() {
      try {
        this.downloadActive = true;
        await REST_interface.getAliasList();
        this.downloadActive = false;
      } catch (e) {
        this.error = e.message;
        this.downloadActive = false;
      }
    },
  },
};
</script>
