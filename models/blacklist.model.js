const mongoose=require('mongoose')

const blacklistScheama=mongoose.Schema({
    token:String
},{
    versionKey:false
})

const BLacklistModel=mongoose.model("blacklist",blacklistScheama)

module.exports={
   BLacklistModel
}