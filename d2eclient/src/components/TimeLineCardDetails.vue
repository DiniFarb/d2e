<template>
    <v-row>
        <v-col>
       <v-card 
                max-width="200px"
                elevation="2" 
                class="ma-1 secondary"
                >
              <v-card-title class="title justify-center" > BACnet
              </v-card-title>
              <v-progress-circular
                class="mb-6"
                :rotate="360"
                :size="100"
                :width="15"
                :value="getpercentage(data.BACValues)"
                color="accent"
              >
                {{ Math.round(getpercentage(data.BACValues))  }}%
              </v-progress-circular>
              <v-card-text class="title">{{data.BACValues}}</v-card-text>
        </v-card>
        </v-col>
         <v-col>
       <v-card  max-width="200px"
                elevation="2" 
                class="ma-1 secondary"
                >
              <v-card-title class="title justify-center" > S7
              </v-card-title>
              <v-progress-circular
                class="mb-6"
                :rotate="360"
                :size="100"
                :width="15"
                :value="getpercentage(data.S7Values)"
                color="accent"
              >
                {{ Math.round(getpercentage(data.S7Values))  }}%
              </v-progress-circular>
              <v-card-text class="title">{{data.S7Values}}</v-card-text>
        </v-card>
        </v-col>
         <v-col>
       <v-card  max-width="200px"
                elevation="2" 
                class="ma-1 secondary"
                >
              <v-card-title class="title justify-center" > DesigoCC
              </v-card-title>
              <v-progress-circular
                class="mb-6"
                :rotate="360"
                :size="100"
                :width="15"
                :value="getpercentage(data.desigoCCValues)"
                color="accent"
              >
                {{ Math.round(getpercentage(data.desigoCCValues))  }}%
              </v-progress-circular>
              <v-card-text class="title">{{data.desigoCCValues}}</v-card-text>
        </v-card>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name:"TimelineCardDetails",
    props:{
        data:Object,
    },
    data(){
        return{
            item:this.data
        }
    },
    methods:{
        close(){
            this.$emit("close-details");
        },
        getpercentage(data){
            let res = (data / this.item.validObjects ) * 100 
           if(res < 0.1){
               return 1
           }
           return res
        }
    },
}
</script>