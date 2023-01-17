import { Schema, model } from "mongoose";

export const asignaturaAlumnoSchema = new Schema({
   
    idAlumno: {
        ref:"User",type: Schema.Types.ObjectId,       
    },
    idAsignaturaCursoPac:{
        ref:"AsignaturaCursoPac",type: Schema.Types.ObjectId,   
    },    
    notas:{
        type: [Schema.Types.Decimal128],   
        required:true,
        default:[1,1,1,1,1,1,1,1,1,1],        
    },
},{
    timestamps : true,
    versionKey : false
})
asignaturaAlumnoSchema.index({ idAlumno: 1, idAsignaturaCursoPac: 1}, { unique: true });


export default model('AsignaturaAlumno',asignaturaAlumnoSchema)