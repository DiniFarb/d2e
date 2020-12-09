<template>
  <v-container >
    <v-overlay
        :value="importingActive"
    >
      <v-progress-circular
          size="128"
          indeterminate
      >

      </v-progress-circular>
    </v-overlay>
    <h1 class="OVTitle">Import Timeline</h1>
    <v-btn @click="startImport()" >Import data </v-btn>
     <v-timeline :dense="$vuetify.breakpoint.smAndDown" >
      <v-timeline-item
      v-for="(timeline, i) in timeline"
      :key="i"
      small
      >
      <template v-slot:opposite>
        <span
          :class="`headline font-weight-bold white--text`"
          v-text="timeline.value.imported_at"
        ></span>
      </template>
      <div class="py-8">
          <v-simple-table dark disabled>
          <template v-slot:default >
            <tbody>
              <tr>
                <td>Total imported Objects</td>
                <td>{{ timeline.value.objectsTotal }}</td>
              </tr>
               <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
              <tr @click="setSheetValue(timeline.value)"
              v-bind="attrs"
              v-on="on">
                <td>Total valid Items for OSI PI</td>
                <td>{{ timeline.value.validObjects }}
                </td>
              </tr>
                  </template>
                <span>Click for details</span>
              </v-tooltip>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </v-timeline-item>
     </v-timeline>
    <v-alert v-if="!importState" class="error">No data import yet 😥 ... <br>Ask siemens for help🧠</v-alert>
    <div class="text-center">
    <v-bottom-sheet v-model="sheet" inset>
      <div>
      <v-sheet 
      class="text-center blue-grey darken-4"
      height="auto"
      rounded
       >
        <v-btn
          class="mt-6"
          text
          color="error"
          @click="sheet = !sheet"
        >close</v-btn>
        <v-card class="ma-2 grey darken-1">
          <v-card-title>Total per driver</v-card-title>
          <v-simple-table dark>
          <template v-slot:default >
            <tbody>
              <tr>
                <td>S7 items</td>
                <td>{{ sheetItem.S7Values }}</td>
              </tr>
              <tr>
                <td>BACnet items</td>
                <td>{{ sheetItem.BACValues}}</td>
              </tr>
              <tr>
                <td>DesigoCC items</td>
                <td>{{ sheetItem.desigoCCValues}}</td>
              </tr>
            </tbody>
          </template>
          </v-simple-table>
          </v-card>
          <v-card class="ma-2 grey darken-1">
          <v-card-title>Total per type</v-card-title>
          <v-simple-table dark>
          <template v-slot:default >
            <tbody>
              <tr>
                <td>Analog items</td>
                <td>{{ sheetItem.analogValues }}</td>
              </tr>
              <tr>
                <td>Binary items</td>
                <td>{{ sheetItem.binaryValues}}</td>
              </tr>
            </tbody>
          </template>
          </v-simple-table>
          </v-card>
          <div class="my-3">
          <v-card class="ma-2 grey darken-1">
           <v-card-title>Objectmodels</v-card-title> 
          <v-card-title> 
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            dense
            dark
            :headers="headers"
            :items="sheetItem.objectModels"
            :search="search"
            :height="400"
            >
          </v-data-table>
        </v-card>
        </div>
      </v-sheet>
      </div>
    </v-bottom-sheet>
  </div>
  </v-container>
</template>

<script>
import REST_interface from "@/REST_interface";

export default {
  name: "Overview",

  data() {
    return {
      importingActive: false,
      error: "",
      importState: true,
      timeline: [],
      sheet: false,
      sheetItem: {},
      headers: [{
              text:"Object model name",
              align: 'start',
              value: 'model',
            },{
              text:"Number of entries",
              value: 'amount',
            }],
      search: '',
    }
  },

  mounted() {
   this.getOverview();
  },

  methods: {
    async getOverview() {
      try {
        this.importingActive = true;
        await REST_interface.getState().then(res=>{
          if(res.summary.length > 0){
           res.summary.forEach(item =>{
             item.value.imported_at = this.parseDate(item.value.imported_at);
           })    
          this.timeline = res.summary;
          } else{
            this.importState = false
          }
          this.timeline.sort(function(a,b){
            return new Date(b.key) - new Date(a.key);
          });
        });
        this.importingActive = false;
      } catch (e) {
        this.importState = false
        this.importingActive = false;
        this.error = e.message;
      }
    },

    parseDate(date){
     let viewDate = new Date(date)
    return viewDate.toDateString() + " " + viewDate.toLocaleTimeString();
    },

    async startImport(){
      try{
         this.importingActive = true;
         await REST_interface.importExcel();
         await this.getOverview();
         this.importingActive = false;
      } catch (e){
        this.importingActive = false;
        this.error = e.message;
      }
    },
    setSheetValue(item){
      this.sheet = true;
      this.sheetItem = item;
    },
  }
}
</script>

<style scoped>
.OVTitle{
  font-size: xx-large;
  color: #ffffff;
  margin: 1em;
}
</style>
