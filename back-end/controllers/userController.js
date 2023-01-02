const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const User = require('../models/userModel');
const ObjectID = require("mongoose").Types.ObjectId;

//regex qui test l'email
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function validateName(name) {
    let regex = new RegExp("[a-zA-Z]")
    return regex.test(name);
}
//voir liste des utilisateurs
module.exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
};

// voir infos d'un utilisateur(profil)
module.exports.getOneUser = (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).json("ID unknow : " + req.params.id);
  
    User.findById(req.params.id, (err, docs) => {
      if (!err) return res.status(200).json(docs);
      else console.log("ID unknow: " + err);
    }).select("-password");
  };
/*REGISTER USER*/

exports.findEmail = async (req, res, next) => {
        let mail = req.body.email
        //on vérifie si le mail entré par l'utilisateur existe déjà
       await User.findOne({email: mail}, (err, docs) => {
            console.log("log 4", docs)
            console.log("TEST", err)
            if (docs) {
                return res.status(400).json("Ce compte existe déjà")
            }
        }).clone()
}
exports.register = async (req, res, next) => {
    try {
        const {
            firstname,
            lastname,
            email,
            password,
            picture,
            friends,
            job,
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
         if (req.body.firstname.length && req.body.lastname.length > 25 || req.body.firstname.length && req.body.lastname.length < 2) {
            res.status(400).send("La taille du nom doit etre comprise entre 2 et 25 caractères");
            return;
        }

        const hash = await bcrypt.hashSync(req.body.password, 11);

        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hash,
            picture,
            friends,
            job,
        })
        const savedUser = await newUser.save()
        return res.status(201).json(savedUser)
    } catch (error) {
        console.log('--> error:', error)
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

/*SUPRESSION DE COMPTE UTLISATEUR */

module.exports.deleteUser = async (req, res) => {
    const idParams = req.params.id
    try {
        await User.findById(idParams, (err, docs) => {
            const theUser = docs;
            if (!theUser) {
                return res.status(404).json("ce user n'existe pas")
            }
            if (req.auth.id != thePost.userId) {
                return res.status(403).json("Vous n'avez pas le droit de supprimer ce post");
            }

            //suppression de la publication
            User.remove(theUser, (err) => {
                if (!err) return res.status(200).json("utlisateur supprimé avec succès");
                console.log("Delete publication error : " + err)
                return res.status(500).json(err);
            });
        }).clone()
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}
module.exports.updateUser = async (req, res) => {
    const idParams = req.params.id
    try {
        await User.findById(idParams, (err, docs) => {
            const theUser = docs;
            if (!theUser) {
                return res.status(404).json("ce user n'existe pas")
            }
            if (req.auth.id != thePost.userId) {
                return res.status(403).json("Vous n'avez pas le droit de supprimer ce post");
            }
        }).clone()

        if(req.file) {
            const userUpdated = User.findById(idParams)
            const filename = userUpdated.picture.split("/images")[1];
            fs.unlink(`images/${filename}`, (err) => {
                if (err) throw err;
            });
        }
        //Si dans la requete il y a une image on l'envoi dans la BDD
        const objectPost = req.file ? {
            ...req.body,
            pictureImage: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } :
            {...req.body}
        
            await postModel.updateOne({ _id: req.params.id }, { ...objectPost, _id: req.params.id }) 
            .then(() => res.status(200).json({ message: "user mise à jour" }))
            .catch((error) => res.status(404).json({ error }));

    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

