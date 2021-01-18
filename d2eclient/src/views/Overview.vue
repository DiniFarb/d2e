<template>
<v-container>
  <v-overlay
        :value="loading"
    >
      <v-progress-circular
          size="128"
          indeterminate
      >
      </v-progress-circular>
    </v-overlay>
    <v-card
    class="mx-auto grey darken"
    max-width="1000"
     elevation="24"
  >
    <v-card-title
      dark
      class="accent"
    >
      <span class="title">Imports</span>
      <v-spacer></v-spacer>
    <v-btn class="ma-1" @click="startImport()" >Import data </v-btn>
     </v-card-title>
     <v-card-text class="py-0">
    <v-timeline dense >
      <v-slide-x-reverse-transition
          group
          hide-on-leave
        >
      <v-timeline-item
      v-for="(item, i) in items"
      :key="i"
      color="accent"
      >
      <TimelineCard :key="i" :data="item" />
    </v-timeline-item>
     </v-slide-x-reverse-transition>
    </v-timeline>
    </v-card-text>
    <v-alert class="ma-1" type="error" text v-if="error !== ''">
      {{ error }}
      <v-btn class="error" @click="error = ''">OK</v-btn>
    </v-alert>
  </v-card>
  
</v-container>
</template>

<script>
import REST_interface from "@/REST_interface";
import TimelineCard from '../components/TimelineCard.vue';
export default {
  name: "Overview",
  components:{
    TimelineCard
  },

  data() {
    return {
      loading: false,
      error: "",
      items: [],
    }
  },

  mounted() {
   this.getOverview();
  },

  methods: {
    async getOverview() {
      try {
        this.loading = true;
        
        await REST_interface.getState().then(res=>{
          if(res.data.length > 0){
              this.items = res.data.sort(function(a,b){
              return new Date(b.imported_at) - new Date(a.imported_at);
              });
          } else{
            this.loadinge = false
            this.error = "NO DATA"
          }
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.error = e.message;
      }
    },

    async startImport(){
      try{
         this.loading = true;
         await REST_interface.importExcel();
         await this.getOverview();
         this.loading = false;
      } catch (e){
        this.loading = false;
        this.error = e.message;
      }
    },
  }
}
</script>

