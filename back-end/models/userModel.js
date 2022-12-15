const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String, 
            required: true, 
            min: 2,
            max: 50,
            trim: true
        },
        lastname: {
            type: String, 
            required: true, 
            min: 2,
            max: 50
        },
        email: {
            type: String, 
            required: true, 
            max: 50,
            unique: true
        },
        password: {
            type: String, 
            required: true, 
            min: 5,
        },
        picturePath: {
            type: String, 
            default: ""
        },
        friends: {
            type: Array, 
            default: []
        },
        role: {
            type: String
        },
        job: {
            type: String
        },
        likes: {
          type: Number,
          required: false,
          default: 0
        },
        dislikes: {
          type: Number,
          required: false,
          default: 0
        },
        usersLiked: {
            type: [String]
        },
        usersDisliked: {
            type: [String]
        }
    },

    {timestamps: true}
)

//on installe mongoose unique validator pour eviter a l'utilisateur de créer unautre compte avec le meme mail
//avec unique:true et mongoose validator l'utilisateur ne peut pas créer deux comptes avec une seul adresse mail 
//on ajoute le plugin à la constante signSchema qui contient le schema
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema) 