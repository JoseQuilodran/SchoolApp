import { Schema, model } from "mongoose";

const asignaturaCursoPacSchema = new Schema({  
    
        
    idCursoPac:{
        ref:"CursoPac",
        type: Schema.Types.ObjectId
    },
     
    asignatura:{
        idAsignatura:{ref:"Asignatura",type: Schema.Types.ObjectId},
        nombre:{
            type:String,       
            lowercase: true,            
            required:true
        },
        codigo:{
            type:Number,                        
        }
    },   
    idProfesor: {    
        ref:"User",
        type: Schema.Types.ObjectId,
        required:true       
        
    },
    idAsistente: {
        ref:"User",
        type: Schema.Types.ObjectId,    
    },
    esquemaNotas: {
        type:[Number],
        default:[0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    },
})
asignaturaCursoPacSchema.index({ idCursoPac: 1, "asignatura.idAsignatura": 1}, { unique: true });

export default model('AsignaturaCursoPac',asignaturaCursoPacSchema)