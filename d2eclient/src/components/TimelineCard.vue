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
             >
            Details
          </v-btn>
        </v-card-title>
        <v-row class="ma-1 ">
            <v-col>
                <h2>
                    Imported objects 
                    <v-chip
                    label
                    class="accent"
                    >{{item.objectsTotal}}</v-chip>
                </h2>
            </v-col>
            <v-col>
                 <h2>
                    Valid objects 
                    <v-chip
                    label
                    class="success"
                    >{{item.validObjects}}</v-chip>
                </h2>
            </v-col>
        </v-row>
      </v-card>
</template>
<script>
export default {
    name:"TimelineCard",
    props:{
        data:Object,
        color:String,
    },
    data() {
        return {
            item: this.data,
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