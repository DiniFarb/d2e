<template>
    <v-card
        dark
      >
        <v-card-title class="title grey darken-3"
       
        >{{parseDate(data.imported_at)}}
             <v-spacer></v-spacer>
             <v-btn
             class="ma-1"
             outlined
             >
            Export
          </v-btn>
          <v-btn
          class="ma-1"
             outlined
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
        <v-dialog
            v-if="detailView"
            v-model="detailView"
            >
            <TimelineCardDetails 
            :id="item.imported_at"
            @close-details="detailView = false"
             />
       </v-dialog>
      </v-card>
</template>
<script>
import TimelineCardDetails from '../components/TimeLineCardDetails';

export default {
    name:"TimelineCard",
    props:{
        data:Object,
        color:String,
    },
    components:{
        TimelineCardDetails
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