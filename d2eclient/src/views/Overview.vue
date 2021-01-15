<template>
<v-container>
<h1>D2E Tool</h1>
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
    class="mx-auto"
    max-width="1000"
    color="blue-grey darken-2"
  >
    <v-card-title
      dark
      class="blue-grey darken-3 white--text"
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
      small
      >
      <TimelineCard :key="i" :data="item" />
    </v-timeline-item>
     </v-slide-x-reverse-transition>
    </v-timeline>
    </v-card-text>
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
              this.items = res.data 
              this.items.sort(function(a,b){
              return new Date(b.imported_at) - new Date(a.imported_at);
              });
          } else{
            this.loadinge = false
            this.error = "NO DATA"
          }
          this.timeline.sort(function(a,b){
            return new Date(b.key) - new Date(a.key);
          });
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

