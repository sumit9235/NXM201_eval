const mongoose=require('mongoose')

const blogScheama=mongoose.Schema({
    title:String,
    body:String,
    user:String
},{
    versionKey:false
})

const BlogModel=mongoose.model("blog",blogScheama)

module.exports={
   BlogModel
}