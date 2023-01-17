import { Schema, model } from "mongoose";
export const roles = ["usuario", "docente","coordinador", "administrador"];
const rolSchema = new Schema({
    nombre: {
        type:String,        
        required:true,
        maxlength:13
    }
},{
    versionKey : false
})
export default model('Rol',rolSchema)