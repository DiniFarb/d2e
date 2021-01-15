<template>
    <v-card>
        <p>{{data}}</p>     
    </v-card>
   
</template>
<script>
import REST_interface from "@/REST_interface.js"

export default {
    name:"TimeLineCardDetalis",
    props:{
        id:String,
    },
    data(){
        return{
            key: this.id,
            data: {},
            error:""
        }
    },
    async created(){
        await REST_interface.getImp(this.key.toString()).then(
            res=>{
              this.data = res  
            }
        ).catch(
            err=>{
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