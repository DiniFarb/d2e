<template>
<v-card color="grey darken">
      <v-card-title
    class="accent">
    {{type === 'filteredObjects' ? 'Valid objects' : 'Imported objects'}}
    <v-spacer></v-spacer>
    <v-btn
    @click="close"
    >close</v-btn>    
    </v-card-title>
      <v-text-field
        class="ma-2"
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        outlined
        hide-details
      ></v-text-field>
    <v-data-table
      dense
      class="grey darken pa-1"
      :headers="headers"
      :loading="loading"
      :items="data"
      :search="search"
    ></v-data-table>
  </v-card>
   
</template>
<script>
import REST_interface from "@/REST_interface.js"

export default {
    name:"ObjectsList",
    props:{
        id:String,
        listType:String,
    },
    data(){
        return{
            key: this.id,
            loading: false,
            data: [],
            type:this.listType,
            error:"",
            search: '',
            headers: [
            {
                text: 'Alias',
                align: 'start',
                value: 'alias',
            },
            {
                text: 'OPC Tag',
                align: 'start',
                value: 'opcTag',
            },
            {
                text: 'Description',
                align: 'start',
                value: 'description',
            },
            {
                text: 'Datatype',
                align: 'start',
                value: 'dataType',
            },
            {
                text: 'Subsystem',
                align: 'start',
                value: 'subsystemType',
            },
            {
                text: 'Building',
                align: 'start',
                value: 'building',
            },
            {
                text: 'Unit',
                align: 'start',
                value: 'unit',
            },
            {
                text: 'Max Value',
                align: 'start',
                value: 'maxValue',
            },
            {
                text: 'Min Value',
                align: 'start',
                value: 'minValue',
            },
            ],

        }
    },
    async created(){
        this.loading = true
        if(this.type === "unfilteredObjects"){
            this.headers[1] =
            {
                text: 'CC Reference',
                align: 'start',
                value: 'ccRef',
            };
            this.headers[3] =
            {
                text: 'Object Model',
                align: 'start',
                value: 'objectModel',
            };
        }
        await REST_interface.getImp(this.key.toString()).then(
            res=>{
              this.data = res[this.type]
              this.loading = false  
            }
        ).catch(
            err=>{
                this.loading = false
                this.error = err
            }
        )
    },
    methods:{
        close(){
            this.$emit("close-list");
        }
    }
}
</script>