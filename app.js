const express = require("express");
const ejs = require("ejs");
//const bcrypt  = require("bcryptjs");
const config = require("config");
//const jwt = require("jsonwebtoken");
const posts = require("./posts");
const connectDB = require("./.env/config/db");
const User = require("./model/user.js");
const user = require("./model/user.js");

const app =express();

app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

connectDB();

app.get("/topic/:title",(req,res)=>{
    posts.forEach((post)=>{
        if(req.params.title===post.title){
            res.render("topic",{post:post});
        }
    });
});

app.get("/",(req,res)=>{
    res.render("Login");
});



app.post("/",(req,res)=>{
    //verify login here

    const {username,password}=req.body;

    User.findOne({email:username},(err,founduser)=>{
        if(err) {alert("User not found")}
        else{
            if(founduser.password === password){
                res.redirect("/blog");
            }
            else{
                res.redirect("/");
            }
        }
    })

});

app.get("/signin",(req,res)=>{
    res.render("signin");
});

app.post("/signin",(req,res)=>{
    //save new user details

    const {email,password}=req.body;

    const newuser = new User({
        email:email,
        password:password
    });

    // const salt = bcrypt.genSalt(10);

    // newuser.password = bcrypt.hash(password,salt);

    newuser.save();

    const payload={
        user:{
            id:user.id
        }
    };

    //  jwt.sign(payload, config.get("jwtsecret"),(err,token)=>{
    //     if(err) throw err;
    //     res.json({token});
    // });



    res.redirect("/");
});


app.get("/blog",(req,res)=>{
    res.render("blog",{post:posts});
});

app.post("/blog",(req,res)=>{
    const {imgurl,title,content} = req.body;
    const blogobj={
        imgurl:imgurl,
        title:title,
        content:content
    };
    posts.push(blogobj);
    res.redirect("/blog");
})

app.get("/createBlog",(req,res)=>{
    res.render("createBlog");
});

app.get("/delete/:topic",(req,res)=>{
    posts.forEach((post)=>{
        if(req.params.topic===post.title){
            const index = posts.indexOf(post.title);
            if(index >= -1) posts.splice(index,1);
        }
    });
    res.redirect("/blog");

});

app.get("/editBlog/:topic",(req,res)=>{
    posts.forEach((post)=>{
        if(req.params.topic===post.title){
            res.render("editBlog",{post:post});
        }
    })

});

app.post("/editBlog/:topic",(req,res)=>{
    posts.forEach((post)=>{
        if(req.params.topic===post.title){
            const index = posts.indexOf(post.title);
                console.log(posts[index]);
        }
    })
    res.redirect("/blog");
});


app.get("/home",(req,res)=>{
    res.render("/")
});

app.get("/about",(req,res)=>{
    res.render("about")
});

app.get("/contact",(req,res)=>{
    res.render("contact")
});


app.listen(process.env.PORT || 3000,()=>{
    console.log("Server running ...");
})
