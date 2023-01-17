import { Schema, model } from "mongoose";

export const cursoSchema = new Schema({
    nombre:{
        type:String,
        min: [2, 'Muy corto, got {VALUE}'],
        max: [4,'Max 4emD, got {VALUE}'],
        lowercase: true,
        unique:true,
        required:true
    },
    numero:{
        type:Number,        
        required:true
    },
    letra:{
        type:String,
        maxLength: 1,
        lowercase: true,
        required:true             
    },
    nivel:{
        type:String,
        lowercase: true,
        enum: { values: ['prebasica', 'basica','media'], message: '{VALUE} no es valido' }
    }   
})


export default model('Curso',cursoSchema)