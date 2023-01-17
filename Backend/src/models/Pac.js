import { Schema, model } from "mongoose";

export const pacSchema = new Schema({
    year:{
        type:Number,     
        min: [2020, 'Min 2020, got {VALUE}'],   
        required:true
    },
    type:{
        type:String,
        lowercase: true,
        enum: { values: ['semestre', 'trimestre','otro'], message: '{VALUE} no es valido' },
        required:true,
    },
    number:{
        type:Number,     
        min: [1, 'Min 1, got {VALUE}'],   
        max: [4, 'Max 4, got {VALUE}'],
        required:true
    },
    fechaInicio:{
        type:Date,
        
    },
    fechaFin:{
        type:Date,
        
    }
})
pacSchema.index({ year: 1, number: 1}, { unique: true });

export default model('Pac',pacSchema)