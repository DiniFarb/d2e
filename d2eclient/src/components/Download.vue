<template>
  <v-card class="secondary pa-2" :disabled="loading">
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
    <v-alert type="error" text v-if="!loading && error !== ''">
      {{ error }}
    </v-alert>
    <v-card-actions class="d-flex justify-center">
      <v-btn class="DlButton" @click="downloadClientList('001')">
        Client 1
      </v-btn>
      <v-btn class="DlButton" @click="downloadClientList('002')">
        Client 2
      </v-btn>
      <v-btn class="DlButton" @click="downloadClientList('003')">
        Client 3
      </v-btn>

      <v-btn class="DlButton" @click="downloadClientList('004')">
        Client 4
      </v-btn>

      <v-btn class="DlButton" @click="downloadClientList('005')">
        Client 5
      </v-btn>
      <v-btn class="DlButton" @click="downloadClientList('006')">
        Client 6
      </v-btn>
      <v-btn
        class="DlButton"
        @click="downloadAliasList()"
        >
        Alias list
        </v-btn>
    </v-card-actions>
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
