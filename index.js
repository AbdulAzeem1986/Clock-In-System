const Express = require("express");
const Mongoose = require("mongoose");
const Cors = require("cors");
const Bodyparser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usermodel = require("./models/Usermodel")
const Entriesmodel = require("./models/Userentries");
const path = require("path");
// testb

const app = new Express;
app.use(Express.static(path.join(__dirname,"/build")));
app.use(Bodyparser.json());
app.use(Bodyparser.urlencoded({extended:true}));
app.use(Cors());

Mongoose.connect("mongodb+srv://abdulazeem:abdulazeem86@cluster0.qch7vjx.mongodb.net/Clockin?retryWrites=true&w=majority",{useNewUrlParser:true});


//Api to Signin
app.post("/api/signin", async (req, res) => {

    try {
        let email = req.body.email;
        let password = req.body.password;
        console.log(req.body)
        const result = await Usermodel.findOne({ email: email })
        // console.log(result)
        // console.log(result.password)
        if (!result) throw ('username not found')


        //Comparing given password & encrypted password in DB
        const passwordValidator = bcrypt.compareSync(password, result.password)

        console.log(passwordValidator)
        if (!passwordValidator) throw ({ "status": "failed", "data": "invalid password" })

        // Token Authentication-Generate-To be included in signin
       const token = jwt.sign({ "email": email, "id": result._id }, "signin-token", { expiresIn: "1d" })
       if(!token) throw ("Token not generated")
       console.log(token)
      console.log(result)
       res.send({ "status": "success", "data":result, "token":token })

    }
     
    catch (error) {
        console.log(error);
        res.send(error);
    }
})


//Api to add a user
app.post("/api/adduser", (req, res) => {

    
    jwt.verify(req.body.token,"signin-token",(err,decoded)=>{
        if(decoded && decoded.email){
       //  console.log("authorised")

            var data = {
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password,10)
                }
        
            var user = new Usermodel(data);
            user.save((err, data) => {
                if (err) {
                    res.json({ "Status": "Error", "Error": err })
                  
                } 
                else {
                    res.json({ "Status": "User added successfully", "Data": data })
                    console.log(user);
                }
        })
    }
        else{
            res.json({"status":"unauthorised"})
        }
    })
});


//Api to View users
app.get("/api/viewusers", async(req,res)=>{

    try {
        var result = await Usermodel.find();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }

});


//Delete user api

            app.delete("/api/deleteuser/:id", async(req,res)=>{
                await Usermodel.deleteOne({"_id":req.params.id})
            .then(
                (data)=>{
                    console.log(data)
                    res.send(data)
                })
            .catch((error)=>{
                res.status(500).send(error);
                    })
            });
       



//Api to add a time tracker entry
app.post("/api/addentry", (req, res) => {

    //Token Authentication-verify-To be included in every api operations after signin
    jwt.verify(req.body.token,"signin-token",(err,decoded)=>{
        if(decoded && decoded.email){
            // res.json({"status":"authorised"})

            var data = {
                name:req.body.name,
                token:req.body.token,
                userId:req.body.userId,
                Project: req.body.Project,
                Task: req.body.Task,
                Workmode: req.body.Workmode,
                Description: req.body.Description,
                Timer:req.body.Timer,
                Start: req.body.Start,
                End: req.body.End,
                Date:req.body.Date
                }
        
            var entry = new Entriesmodel(data);
            entry.save((err, data) => {
                if (err) {
                    res.json({ "Status": "Error", "Error": err })
                } 
                else {
                    res.json({ "Status": "Entry added successfully", "Data": data })
                    
                }
        })
    }
        else{
            res.json({"status":"unauthorised"})
        }
    })
});


//View api's

//View all entries
app.post("/api/viewallentries", async(req,res)=>{

 try {
       var result = await Entriesmodel.find();
        res.send(result);
   } catch (error) {
       res.status(500).send(error);
        }
     })


//View my entries
app.post("/api/viewmyentries", async(req,res)=>{

    try {
       var result = await Entriesmodel.find({"userId":req.body.userId});
       res.send(result);
   } catch (error) {
       res.status(500).send(error);
        }
    })


//Delete entry api
app.delete("/api/deleteentry/:id", (req,res)=>{

   
      Entriesmodel.deleteOne({"_id":req.params.id})
    .then(
        (data)=>{
            console.log(data)
            res.send(data)
        })
    .catch((error)=>{
        res.status(500).send(error);
      })
    
});



//Retrieve data api
app.get("/api/updateentries/:id", (req,res)=>{


        Entriesmodel.findOne({_id:req.params.id})
        .then(
            (data)=>{
                console.log(data)
                res.send(data)
            })
        .catch((error)=>{
            res.status(500).send(error);
        })
        
    });


//Update data api
  app.post("/api/updateentries/:id",(req,res)=>{


    var id = req.params.id;    
    var data = req.body;
    Entriesmodel.findByIdAndUpdate({_id: id},data,(err,data)=>{
            if (err) {
                res.json({"Status":"Error","Error":err})
            } else {
                res.json({"Status":"Success","Data":data});
            }
        }
    )
  
});


app.listen(3001,(err)=>{
    if(err){
        console.log("server crashed")
    }
    else{
        console.log("server started")
    }
})

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});