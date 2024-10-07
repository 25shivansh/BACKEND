const {Router}=require("express")
const { purchaseModel, courseModel } = require("../db")
const courseRouter=Router()
courseRouter.post("/purchases",async function(req,res){
    const userId=req.userId
    const courseId=req.body.courseId
    //should check whether user paid the price or not(logic)
    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        message:"You have succesfully purchased this course"

    })
})
courseRouter.post("/preview", async function(req,res){
    const courses=await courseModel.find({})
    res.json({
        courses
    })
    
})

module.exports={
    courseRouter:courseRouter

}