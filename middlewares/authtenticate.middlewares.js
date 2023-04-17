const authenticate=(permittedrole)=>{
    return (req,res,next)=>{
        let role=req.role
        if(!role){
            role="User"
        }
        if(permittedrole.includes(role)){
            next()
        }else{
            res.send({"msg":"Unauthorized to access this route"})
        }
    }
}

module.exports={
    authenticate
}