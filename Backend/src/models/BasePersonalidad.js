import { Schema, model } from "mongoose";

export const basePersonalidadSchema = new Schema({    
    descripcion:{
        type:String,      
        required:true,             
    },
   
})


export default model('BasePersonalidad',basePersonalidadSchema)