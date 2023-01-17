import { Schema, model } from "mongoose";

export const asisteSchema = new Schema({
   
    idAlumno: {
        ref:"User",type: Schema.Types.ObjectId,       
    },
    idCursoPac:{
        ref:"CursoPac",type: Schema.Types.ObjectId,   
    },
    fechaSemana:{
        type: Date,   
        required:true,
    },
    estadoSemana:{
        type: [Number],   
        required:true,
        default:[0,0,0,0,0,0,0],       
    },
    numeroSemana:{
        type:Number,
        required:true,
    }
    
},{
    timestamps : true,
    versionKey : false
})


export default model('Asiste',asisteSchema)