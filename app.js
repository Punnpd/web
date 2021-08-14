//jshint esversion:6
require('dotenv').config() //to keep some varibles as secret or confidential.
const express = require('express')
const bodyParser = require("body-parser")
const ejs = require('ejs')
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express()
// console.log(process.env.SECRET) //process is a global object of node.js

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true})

// **** Set Schema as an object
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: String,
    password: String
})


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']})

const User = mongoose.model("User", userSchema)

app.get("/", (req, res)=>{
    res.render("home")
})

app.get("/login", (req, res)=>{
    res.render("login")
})

app.get("/register", (req, res)=>{
    res.render("register")
})

app.post("/register", (req, res)=>{
    // console.log(req.body)
    const username = req.body.username
    const password = req.body.password

    const newUser = new User({
        email: username,
        password: password
    })

    newUser.save((err)=>{
        if(!err){
            res.render("secrets")
        }else{
            res.send(err)
        }
    })

})

app.post("/login", (req, res)=>{
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username}, (err, founduser)=>{
        if(err){
            console.log(err)
        }else{
            if(founduser){
                if(founduser.password === password){
                    res.render("secrets")
                }
                // console.log(founduser.password === password)
                // console.log(typeof founduser.password)
                // console.log(typeof password)
                // console.log(typeof password) --> String
            }
        }
    })
})

app.listen(3000, ()=>{
    console.log("Sucessfully start the server on port 3000!")
})