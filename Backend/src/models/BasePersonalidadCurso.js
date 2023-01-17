import { Schema, model } from "mongoose";

export const basePersonalidadCursoSchema = new Schema({    
    idCursoPac:{
        ref:"CursoPac",
        type: Schema.Types.ObjectId,
        required:true,
    },
    orden:{
        type:Number,      
        required:true, 
    },
    basepersonalidad:{
        idBase:{
            ref:"BasePersonalidad",type: Schema.Types.ObjectId,   
            required:true,
        },    
        descripcion:{
            type:String,      
            required:true,             
        },
    },

})


export default model('BasePersonalidadCurso',basePersonalidadCursoSchema)