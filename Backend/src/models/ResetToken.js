import { Schema, model } from "mongoose";
const resetTokenSchema = new Schema({
    idUser:{
       type: Schema.Types.ObjectId,
       ref:"User"
    },
    token:{
        type:String,        
        required:true
    }
},{
    timestamps : true,
    versionKey : false
})


export default model('ResetToken',resetTokenSchema)