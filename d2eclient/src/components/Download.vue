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
      @click="downloadButton('001')"
      >
      Client 1
      </v-btn>
      <v-btn
          class="DlButton"
          @click="downloadButton('002')"
      >
        Client 2
      </v-btn>

      <v-btn
          class="DlButton"
          @click="downloadButton('003')"
      >
        Client 3
      </v-btn>

    <v-btn
          class="DlButton"
          @click="downloadButton('004')"
      >
        Client 4
      </v-btn>

    <v-btn
          class="DlButton"
          @click="downloadButton('005')"
      >
        Client 5
      </v-btn>
    <v-btn
        class="DlButton"
        @click="downloadButton('006')"
    >
      Client 6
    </v-btn>

  </v-container>
</template>

<script>
import REST_interface from "@/REST_interface";

export default {
  name: "Download",

  data() {
    return {
      downloadActive: false

    }
  },

  methods: {
    async downloadButton(clientNumber) {
      this.downloadActive = true;
      await REST_interface.getClientList(clientNumber);
      this.downloadActive = false;
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
