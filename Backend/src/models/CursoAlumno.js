import { Schema, model } from "mongoose";

export const cursoAlumnoSchema = new Schema({
   
    idAlumno: {
        ref:"User",type: Schema.Types.ObjectId,required:true
    },
    idCursoPac:{
        ref:"CursoPac",type: Schema.Types.ObjectId, required:true   
    },
    estadoPersonalidad:{
        type: [Number],   
        required:true,
        default:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],       
    },    
    
},{
    timestamps : true,
    versionKey : false
})
cursoAlumnoSchema.index({ idAlumno: 1, idCursoPac: 1}, { unique: true });

export default model('CursoAlumno',cursoAlumnoSchema)