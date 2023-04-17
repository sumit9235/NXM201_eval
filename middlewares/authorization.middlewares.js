const jwt =require('jsonwebtoken')
const {BLacklistModel}=require('../models/blacklist.model')
const {UserModel}=require('../models/user.model')

const authorization=async(req,res,next)=>{
    try {
        const token=req.headers.authorization;
        const isBlacklisted = await BLacklistModel.find({token:token})
        if(isBlacklisted.length>0){
           return res.send({"msg":"Please login again"})
        }
        const decoded=jwt.verify(token,process.env.access_Token)
        const id=decoded.id
        const user = await UserModel.findById(id)
        const role=user.role
        const email=user.email
        req.role=role
        req.email=email
        next()
    } catch(err){
        res.send({"msg":"token expired"})
    }
}

module.exports={
    authorization
}