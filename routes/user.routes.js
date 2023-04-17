const express=require('express')
const userRouter=express.Router()
const jwt= require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {UserModel}=require("../models/user.model")

const {BLacklistModel}=require('../models/blacklist.model')

userRouter.post("/signup",async(req,res)=>{
    let {name,email,pass,role}=req.body
    if(!role){
        role="User"
    }
    try {
        bcrypt.hash(pass,4,async(err,hash)=>{
            if(err){
                res.send(err.message)
            }else{
                const user = new UserModel({name,email,pass:hash,role})
                await user.save()
                res.status(200).send({"msg":"User registered successfully"})
            }
        })
    } catch (error) {
        res.status(400).send({"msg":"Something went wrong"})
    }
})

userRouter.post("/login",async(req,res)=>{
    const{email,pass}=req.body
    try{
        const user= await UserModel.find({email})
        if(user.length>0){
            bcrypt.compare(pass,user[0].pass,(err,result)=>{
                if(result){
                    let AcessToken=jwt.sign({id:user[0]._id},process.env.access_Token,{expiresIn:"1m"})
                    let RefreshToken=jwt.sign({id:user[0]._id},process.env.refresh_Token,{expiresIn:"5m"})
                    res.status(200).send({"msg":"Loggedin successfull","Access_Token":AcessToken,"Refresh_Token":RefreshToken})
                }else{
                    res.send({"msg":"Something went wrong"})
                }
            })
        }else{
            res.send({"msg":"User not found"})
        }
    } catch (err) {
        res.send({"msg":"Something went wrong"})
    }
})

userRouter.get("/refreshtoken",async(req,res)=>{
    const refreshToken=req.headers.authorization;
    try {
        const decoded = jwt.verify(refreshToken,process.env.refresh_Token)
        if(decoded){
            const token=jwt.sign({id:decoded.id},process.env.access_Token,{expiresIn:"1m"})
            res.send({"new acess_Token":token})
        }else{
            res.send({"msg":"Invalid refresh token"})
        }
    } catch (err) {
        if(err instanceof jwt.JsonWebTokenError){
            return res.send("Invalid token")
        }
        res.send({"msg":"Server error"})
    }
})

userRouter.post("/logout",async(req,res)=>{
    try {
        const blacklisttoken = req.headers.authorization;
        console.log(blacklisttoken)
            const data = new BLacklistModel({token:blacklisttoken})
            await data.save()
            res.send({"msg":"logged out successfully"})
    } catch (error) {
        res.send({"msg":"Something went wrong"})
    }
})

module.exports={
    userRouter
}