<template>
<v-card color="blue-grey darken-2">
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        outlined
        hide-details
      ></v-text-field>
    </v-card-title>
    <v-data-table
      class="blue-grey darken-2"
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
    name:"ValidObjectsList",
    props:{
        id:String,
    },
    data(){
        return{
            key: this.id,
            loading: false,
            data: [],
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
        await REST_interface.getImp(this.key.toString()).then(
            res=>{
              this.data = res
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
            this.$emit("close-details");
        }
    }
}
</script>