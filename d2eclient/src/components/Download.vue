<template>
  <v-container>
    <v-overlay
        :value="downloadActive"
    >
      <v-progress-circular
          size="128"
          indeterminate
      >

      </v-progress-circular>
    </v-overlay>
    <h1
        class="OVTitle"
    >Download</h1>
    <h2 class="text--accent-1"
    >
      Excel for OPC clients 🐱‍👤
    </h2>
      <v-btn
      class="DlButton"
      @click="downloadClientList('001')"
      >
      Client 1
      </v-btn>
      <v-btn
          class="DlButton"
          @click="downloadClientList('002')"
      >
        Client 2
      </v-btn>

      <v-btn
          class="DlButton"
          @click="downloadClientList('003')"
      >
        Client 3
      </v-btn>

    <v-btn
          class="DlButton"
          @click="downloadClientList('004')"
      >
        Client 4
      </v-btn>

    <v-btn
          class="DlButton"
          @click="downloadClientList('005')"
      >
        Client 5
      </v-btn>
    <v-btn
        class="DlButton"
        @click="downloadClientList('006')"
    >
      Client 6
    </v-btn>
    <br>
    <h2 class="text--accent-1"
    >
      Excel for SQL 📥
    </h2>
    <v-btn
        class="DlButton"
        @click="downloadAliasList()"
    >
      Alias list
    </v-btn>
    <v-alert type="error" v-if="error">Something went wrong 😐 <br>{{error}}</v-alert>
  </v-container>
</template>

<script>
import REST_interface from "@/REST_interface";

export default {
  name: "Download",

  data() {
    return {
      downloadActive: false,
      error: ""

    }
  },

  methods: {
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
}


</script>

<style scoped>
.DlButton{
  margin: 1em;
}
.OVTitle{
  font-size: xx-large;
  color: #ffffff;
}
</style>
