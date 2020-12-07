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
    <h1 class="OVTitle">Overview</h1>
    <v-btn @click="startImport()" >Import data </v-btn>
     <v-timeline :dense="$vuetify.breakpoint.smAndDown" >
      <v-timeline-item
      v-for="(timeline, i) in timeline"
      :key="i"
      small
    
      >
      <template v-slot:opposite>
        <span
          :class="`headline font-weight-bold blue--text`"
          v-text="timeline.value.imported_at"
        ></span>
      </template>
      <div class="py-8">
          <div class="ma-2 float-right" >
            <v-btn
              dark
              @click="setSheetValue(timeline.value)"
            >
              Details
            </v-btn>
            </div>
          <v-simple-table dark disabled>
          <template v-slot:default >
            <tbody>
              <tr>
                <td>Total imported Objects</td>
                <td>{{ timeline.value.objectsTotal }}</td>
              </tr>
              <tr>
                <td>Total valid Objects</td>
                <td>{{ timeline.value.validObjects }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </v-timeline-item>
     </v-timeline>
    <v-alert v-if="!importState" class="error">No data import yet 😥 ... <br>Ask siemens for help🧠</v-alert>
    <div class="text-center">
    <v-bottom-sheet v-model="sheet" inset>
      <v-sheet class="text-center" height="500px">
        <v-btn
          class="mt-6"
          text
          color="error"
          @click="sheet = !sheet"
        >close</v-btn>
        <div class="my-3">
            <v-simple-table>
          <template v-slot:default >
            <p>Imoprt from: {{sheetItem.imported_at}}</p>
            <tbody>
              <tr>
                <td>Total imported Objects</td>
                <td>{{ sheetItem.objectsTotal }}</td>
              </tr>
              <tr>
                <td>Total valid Objects</td>
                <td>{{ sheetItem.validObjects }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        </div>
      </v-sheet>
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
