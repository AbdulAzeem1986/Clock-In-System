const Mongoose = require("mongoose");

const entriesSchema = Mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name"]},

        userId:{
                type:String,
                required:[true,"userId"]},
        
        Project:{
                type:String,
                required:[true,"Please select the project"]},

        Task:{
                type:String,
                required:[true,"Please select the task"]},

        Workmode:{
                type:String,
                required:[true,"Mode of work"]},

        Description:{
                type:String,
                required:[true,"Please add the description"]},

        Timer:{
                type:String,
                required:[true,"Time lapse"]},

        Start:{
                type:String,
                required:[true,"Start time"]},

        End:{
                type:String,
                required:[true,"End time"]},
    
        Date:{
                type:String,
                required:[true,"Date"]}

    },
    {
        timestamps:true
})

const Entriesmodel = Mongoose.model("Entries",entriesSchema);
module.exports= Entriesmodel;