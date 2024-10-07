const {Router}=require("express")
const jwt=require("jsonwebtoken")
const adminRouter=Router()
const {AdminsModel, courseModel}=require("../db")
const {JWT_ADMIN_PASSWORD}=require("../config")
const {z}=require("zod")
const bcrypt=require("bcrypt")
const { adminMiddleware } = require("../middlewares/adminAuth")
adminRouter.post("/signup", async function(req,res){
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
        await AdminsModel.create({
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
adminRouter.post("/signin",async function(req,res){
    const {email,password}=req.body
    const admin=await AdminsModel.findOne({
        email,
        
    })
    if(!admin){
        res.status(403).json({
            message:"User does not exists in our database"
        })
        return
    }
    const passwordMatch=await bcrypt.compare(password,admin.password)
    console.log(admin)
    if(passwordMatch){
        const token=jwt.sign({
            id:admin._id.toString()
        },JWT_ADMIN_PASSWORD)
        res.json({
            token:token
        })
    }else{
        res.status(403).json({
            message:"Invalid Credentials"
        })
    }
    
})
adminRouter.post("/course",async function(req,res){
    const adminId=req.userId;
    const {title,description,imageUrl,price}=req.body
    const course=await courseModel.create({
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price,
        creatorId:adminId
    })
    res.json({
        message:"Course created",
        courseId:course._id
    })
})

adminRouter.put("/course",adminMiddleware,async function(req,res){
    const adminId=req.userId
    const {title,description,imageUrl,price,courseId}=req.body
    const course=await courseModel.updateOne({
        _id:courseId,
        creatorId:adminId
    },{
        title:title,
        description:description,
        imageUrl:imageUrl,
        price:price
    })
    
    res.json({
        message:"Course Updated",
        courseId:course._id
    })
})
adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
    const adminId=req.userId
    const course=await courseModel.find({
        creatorId:adminId
    })
    res.json({
        message:"Signup endpoint",
        course
    })
})
module.exports={
    adminRouter:adminRouter
}