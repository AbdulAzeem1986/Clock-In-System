const Mongoose = require("mongoose");

const userSchema= Mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add user's name"],
    },
    email:{
        type:String,
        required:[true,"Please add the email"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"Please add the password"]
    },
   
    },
    {
        timestamps:true
   })

   const Usermodel = Mongoose.model("Users",userSchema);
   module.exports= Usermodel;