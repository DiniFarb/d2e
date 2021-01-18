<template>
    <div>
    <v-card
        class="grey darken-3"
      >
        <v-card-title class="title accent"
       
        >{{parseDate(data.imported_at)}}
             <v-spacer></v-spacer>
             <v-btn
             class="ma-1 "
             @click="exportView = true"
             >
            Export
          </v-btn>
          <v-btn
             class="ma-1"
             @click="detailView = true"
             >
            Details
          </v-btn>
        </v-card-title>
        <v-row class="ma-1 ">
            <v-col>
                <h2 class="title">
                    Imported objects 
                    <v-btn
                    class="warning"
                    @click="listViewIO = true"
                    >{{item.objectsTotal}}</v-btn>
                </h2>
            </v-col>
            <v-col>
                 <h2 class="title">
                    Valid objects 
                    <v-btn
                    class="success"
                    @click="listViewVO = true"
                    >{{item.validObjects}}</v-btn>
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
       <v-dialog
            v-if="listViewVO"
            v-model="listViewVO"
            max-width="80%"
            >
            <ObjectsList
            :listType="'filteredObjects'"
            :id="data.imported_at" 
            @close-list="listViewVO = false"
             />
       </v-dialog>
       <v-dialog
            v-if="listViewIO"
            v-model="listViewIO"
            max-width="80%"
            >
            <ObjectsList
            :listType="'unfilteredObjects'"
            :id="data.imported_at" 
            @close-list="listViewIO = false"
             />
       </v-dialog>
      </div>
</template>
<script>
import TimelineCardDetails from '../components/TimelineCardDetails';
import Download from '../components/Download'
import ObjectsList from '../components/ObjectsList'

export default {
    name:"TimelineCard",
    props:{
        data:Object,
        color:String,
    },
    components:{
        TimelineCardDetails,
        Download,
        ObjectsList
     },
    data() {
        return {
            item: this.data,
            detailView: false,
            exportView:false,
            listViewIO: false,
            listViewVO: false,
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