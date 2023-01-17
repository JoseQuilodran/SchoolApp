import { Schema, model } from "mongoose";

export const estadoPersonalidadSchema = new Schema({    
    codigo:{
        type:Number,      
        required:true, 
    },
    descripcion:{
        type:String,      
        required:true,             
    },
   
})


export default model('EstadoPersonalidad',estadoPersonalidadSchema)