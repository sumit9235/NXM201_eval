const express=require('express')
const blogRouter=express.Router()
const {BlogModel}=require('../models/blog.model')
const {authenticate}=require('../middlewares/authtenticate.middlewares')
const { authorization } = require('../middlewares/authorization.middlewares')

blogRouter.get("/getBlogs",authenticate(["User","Moderator"]),async(req,res)=>{
    try {
        const data = await BlogModel.find()
        res.status(200).send(data)
    } catch (err) {
        res.send({"msg":err.message})
    }
})

blogRouter.post("/postBlog",authenticate(["User","Moderator"]),async(req,res)=>{
    const email=req.email
    const {title,body}=req.body
    try {
        const blogs= new BlogModel({title,body,user:email})
        await blogs.save()
        res.send({"msg":"Blog added successfully"})
    } catch (err) {
        res.send({"msg":err.message})
    }
})

blogRouter.delete("/User_delete/:id",authenticate(["User"]),async(req,res)=>{
    const email=req.email
    const id=req.params.id
    try {
        const data=await BlogModel.find({user:email})
        if(data){
            await BlogModel.findByIdAndDelete({_id:id})
            res.send({"msg":"Blog deleated"})
        }else{
            res.send({"msg":"User not found"})
        }
    } catch (err) {
        res.send({"err":err.message})
    }
})

blogRouter.patch("/Update/:id",authenticate(["User","Moderator"]),async(req,res)=>{
    const payload=req.body;
    const email=req.email
    const id=req.params.id
    console.log(payload,email,id)
    try {
        const data=await BlogModel.find({user:email})
        console.log(data)
        if(data){
            const blog=await BlogModel.findByIdAndUpdate({_id:id},payload)
            res.send({"msg":`${id} this id blog has been updatetd succesffully`})
        }else{
            res.send({"msg":"User not found"})
        }
    } catch (err) {
        res.send({"err":err.message})
    }
})


blogRouter.delete("/Mod_delete/:id",authenticate(["Moderator"]),async(req,res)=>{
    const id=req.params.id;
    try{
        await BlogModel.findByIdAndDelete({_id:id})
        res.send({"msg":"Blog deleated succesfully"})
    } catch (err) {
        res.send({"msg":err.message})
    }
})

module.exports={
    blogRouter
}