const express=require('express')
const {connection}=require("./db")
const {userRouter}=require('./routes/user.routes')
require('dotenv').config()
const {authorization}=require('./middlewares/authorization.middlewares')
const {blogRouter}=require('./routes/blog.route')

const app=express()

app.use(express.json())

app.use("/users",userRouter)

app.use(authorization)

app.use("/blogs",blogRouter)

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Connected to db")
    } catch (err) {
        console.log(err)
    }
    console.log("Server is running on 5500")
})