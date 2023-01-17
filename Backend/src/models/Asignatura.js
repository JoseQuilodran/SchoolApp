import { Schema, model } from "mongoose";


export const asignaturaSchema = new Schema({  
    nombre:{
        type:String,       
        lowercase: true,
        unique:true,
        required:true
    },
    codigo:{
        type:Number,    
        unique:true,        
    },   
})


export default model('Asignatura',asignaturaSchema)