import { Schema, model } from "mongoose";

export const comunaSchema = new Schema({
    nombre:{
        type:String,    
        maxlength:30,   
        lowercase: true,
        unique:true,
        required:true
    },
    codigotesoreria:{
        type:Number,    
        unique:true,
        required:true
    },

})


export default model('Comuna',comunaSchema)