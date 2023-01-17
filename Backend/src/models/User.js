import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { comunaSchema } from "./Comuna";
export const userSchema = new Schema({
    nombre:{
        type:String,
        maxlength:60,
        required:true
    },
    apellidoP:{
        type:String,       
        maxlength:30, 
    },
    apellidoM:{
        type:String,      
        maxlength:30,   
    },    
    email:{
        type:String,
        unique:true,
        maxlength:254, 
        required:true
    },
    emailAp:{
        type:String,    
        maxlength:254,           
    },
    rut:{
        type:String,
        maxlength:12, 
        unique:true,
        required:true
    },
    telefono:{
        type:String,
        maxlength:13, 
    },
    habilitado:{
        type:Boolean,
        required:true,
        default:true,
    },
    password:{
        type:String,
        required:true,        
    },
    rol: {
        idRol:{ref:"Rol",type: Schema.Types.ObjectId},
        nombre: {type:String,maxlength:13}
    },
    idComuna: {
        ref:"Comuna",
        type: Schema.Types.ObjectId  
    }
},{
    timestamps : true,
    versionKey : false
})

userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password , salt)
}
userSchema.statics.comparePassword = async(password,receivedPassword)=>{
   return await bcrypt.compare(password,receivedPassword)
}
export default model('User',userSchema)