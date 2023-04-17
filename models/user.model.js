const mongoose=require('mongoose')

const userScheama=mongoose.Schema({
    name:String,
    email:String,
    pass:String,
    role:{
        type:String,
        default:"User",
        enum:["User","Moderator"]
    }
},{
    versionKey:false
})

const UserModel=mongoose.model("user",userScheama)

module.exports={
   UserModel
}