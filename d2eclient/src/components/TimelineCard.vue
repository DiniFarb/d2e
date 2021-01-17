<template>
    <div>
    <v-card
        dark
      >
        <v-card-title class="title grey darken-3"
       
        >{{parseDate(data.imported_at)}}
             <v-spacer></v-spacer>
             <v-btn
             class="ma-1 accent"
             @click="exportView = true"
             >
            Export
          </v-btn>
          <v-btn
             class="ma-1 accent"
             @click="detailView = true"
             >
            Details
          </v-btn>
        </v-card-title>
        <v-row class="ma-1 ">
            <v-col>
                <h2 class="title">
                    Imported objects 
                    <v-chip
                    label
                    class="accent"
                    >{{item.objectsTotal}}</v-chip>
                </h2>
            </v-col>
            <v-col>
                 <h2 class="title">
                    Valid objects 
                    <v-chip
                    label
                    class="success"
                    >{{item.validObjects}}</v-chip>
                </h2>
            </v-col>
        </v-row>
      </v-card>
      <v-dialog
            v-if="detailView"
            v-model="detailView"
            max-width="80%"
            >
            <TimelineCardDetails 
            :data="item"
            @close-details="detailView = false"
             />
       </v-dialog>
       <v-dialog
            v-if="exportView"
            v-model="exportView"
            max-width="80%"
            >
            <Download
            :filekey="data.imported_at" 
            @close-download="exportView = false"
             />
       </v-dialog>
      </div>
</template>
<script>
import TimelineCardDetails from '../components/TimelineCardDetails';
import Download from '../components/Download'

export default {
    name:"TimelineCard",
    props:{
        data:Object,
        color:String,
    },
    components:{
        TimelineCardDetails,
        Download
     },
    data() {
        return {
            item: this.data,
            detailView: false,
            exportView:false,
        }
    },
    methods:{
        parseDate(date){
        let viewDate = new Date(date)
        return viewDate.toDateString() + " " + viewDate.toLocaleTimeString();
    },
    }
}
</script>