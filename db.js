const mongoose=require("mongoose")

const { number } = require("zod")
const Schema=mongoose.Schema
const ObjectId=mongoose.ObjectId
const User= new Schema({
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName:String

})
const Admins= new Schema({
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName:String,
    
})
const course= new Schema({
    title:String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:ObjectId

    

    
})
const purchase=new Schema({
    course:ObjectId,
    courseId:ObjectId

})
const UserModel=mongoose.model('users',User)
const AdminsModel=mongoose.model("admins",Admins)
const courseModel=mongoose.model("course",course)
const purchaseModel=mongoose.model("purchases",purchase)
module.exports={
    UserModel,
    AdminsModel,
    courseModel,
    purchaseModel

}
