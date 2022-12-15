const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require('../models/userModel')

//regex qui test l'email
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

/*REGISTER USER*/

exports.register = async (req, res, next) => {
    try {
        const {
            firstname,
            lastname,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
            viewProfile,
            impressions
        } = req.body

         //si le user ne rentre pas de mdp, de nom ou de mail
         if (!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname) {
            res.status(400).send("bad request need email and password and name");
            return;
        }
          //si le user n'entre pas de mail valide ou de mdp valide
          if (!validateEmail(req.body.email) || req.body.password.length < 4 || req.body.password.length > 80 || req.body.email.length > 70) {
            res.status(400).send("L'email ou le mot de passe n'est pas correct");
            return;
        }
        //si le user n'entre pas de nom valide
        if (!validateName(req.body.firstname)) {
            res.status(400).send("Il n'y pas de lettre dans votre nom");
            return;
        }
        if (!validateName(req.body.lastname)) {
            res.status(400).send("Il n'y pas de lettre dans votre nom");
            return;
        }
         //si le user n'entre pas de nom validen (longueur du nom)
         if (req.body.firstname.length && req.body.lastname > 25 || req.body.firstname.length && req.body.lastname < 2) {
            res.status(400).send("La taille du nom doit etre comprise entre 2 et 25 caractères");
            return;
        }

        const hash = await bcrypt.hashSync(req.body.password, 11);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password,
            picturePath: hash,
            friends,
            location,
            occupation,
            viewProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        })
        const savedUser = await newUser.save()
        return res.status(201).json(savedUser)
    } catch (error) {
        return res.status(500).json(error)
    }
}

/*LOG IN*/

exports.login = async (req, res) => {
    try {
        const { password, email } = req.body;

        //find * from user where req.body.email
        const user = await User.findOne({email: email})
        if(!user) return res.status(400).json("utilisateur inexistant")

        //on compare le mdp entré par l'utilisateur et celui stocker
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(400).json("mot de passe incorrect")

        //token
        const token = jwt.sign({id : user._id }, process.env.JWT_TOKEN, {expiresIn: "1d"});
        const objResponse = {
            userId : user._id,
            token : token,
        }
        res.status(200).json({token: objResponse.token, userId: objResponse.userId });
    } catch (error) {
        return res.status(500).json(error)
    }
}