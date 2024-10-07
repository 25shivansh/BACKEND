const bcrypt = require("bcrypt")
const {Router}=require("express")
const {UserModel,purchaseModel}=require("../db")
const userRouter=Router()
const {z}=require("zod")
const jwt=require("jsonwebtoken")
const {JWT_USER_PASSWORD}=require("../config")
const { userMiddleware } = require("../middlewares/userAuth")



userRouter.post("/signup", async function(req,res){
    const reqBody=z.object({
        email:z.string(),
        password:z.string(),
        firstName:z.string(),
        lastName:z.string()
    })
    const parsedDatawithSuccess=reqBody.safeParse(req.body);
    if(!parsedDatawithSuccess.success){
        res.json({
            message:"Invalid format"
        })
        return
    }
    const email=req.body.email
    const password=req.body.password
    const firstName=req.body.firstName
    const lastName=req.body.lastName
    let errorThrow=false
    try{
        const hashedPassword=await bcrypt.hash(password,5)
        console.log(hashedPassword)
        await UserModel.create({
            email:email,
            password:hashedPassword,
            firstName:firstName,
            lastName:lastName
        })

    }catch(e){
        console.error(e)
        res.json({
            message:"User already exists"
        })
        errorThrow=true
    }
    if(!errorThrow){
        res.json({
            message:"You are signed up"
        })
    }
    
    
})
userRouter.post("/signin",async function(req,res){
    const {email,password}=req.body
    const user=await UserModel.findOne({
        email,
        
    })
    if(!user){
        res.status(403).json({
            message:"User does not exists in our database"
        })
        return
    }
    const passwordMatch=await bcrypt.compare(password,user.password)
    console.log(user)
    if(passwordMatch){
        const token=jwt.sign({
            id:user._id.toString()
        },JWT_USER_PASSWORD)
        res.json({
            token:token
        })
    }else{
        res.status(403).json({
            message:"Invalid Credentials"
        })
    }
    
})
userRouter.get("/purchases",userMiddleware,async function(req,res){
    const userId=req.userId
    const purchases=await purchaseModel.find({
        userId,
    })
    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })
    res.json({
        purchases,
        coursesData
    })
})

module.exports={
    userRouter:userRouter
}