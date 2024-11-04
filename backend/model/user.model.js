
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:  String,
        required: true,
        unique: true
    },
    email:{
        type:  String,
        required: true,
        unique: true
    },
    password:{
        type:  String,
        required: true
    },
    profilePicture:{
        type: String,
        default: "https://i.pinimg.com/564x/8b/11/a8/8b11a86980c64720a41ec22332a83115.jpg"
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
   
    

    
}, {timestamps: true});

const User = mongoose.model("user", userSchema)

module.exports = User