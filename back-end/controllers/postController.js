const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const postModel = require('./../models/postsModel')
const userModel = require('./../models/userModel')

//lire les publications

module.exports.readPost = async (req, res) => {
    try {
       await postModel.find((err, docs) => {
          if (!err) res.status(200).json(docs);
        }).sort({ createdAt: -1 });
    } catch (e) {
        console.log("Error to get data : " + err);
        return res.status(500).json(e)
    }
  };

//lire les publications d'un utilisateur

module.exports.readPostOfUser = async (req, res) => {
    const idParams = req.params.id;
    try {
       await postModel.find(idParams, (err, docs) => {
          if (!err) res.status(200).json(docs);
        }).sort({ createdAt: -1 });
    } catch (e) {
        console.log("Error to get data : " + err);
        return res.status(500).json(e)
    }
  };

//créer une publication

module.exports.createPost = async (req, res) => {
    const id = req.auth.id
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    if (!req.file && !req.file.filename) {
        imageUrl = null
    }
    const {
        userId,
        firstname,
        lastname,
        description,
        pictureImage,
        userPicturePath,
        likes,
        dislikes,
        comments,
    } = req.body
    try {
        //on va chercher les infos de l'utilisateur connecté
        const user = await userModel.findById(id)
        const newPost = new postModel({
            userId: id,
            firstName: user.firstname,
            lastName: user.lastname,
            description,
            likes: {},
            dislikes: {},
            comments: [],
            pictureImage: imageUrl,
            userPicturePath: user.picture
        });
        return res.status(201).json(newPost);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

//supprimer une publication

module.exports.deletePost = async (req, res) => {
    const idParams = req.params.id
    try {
        postModel.findById(idparams, (err, docs) => {
            const thePost = docs;
            if(!thePost) {
                return res.status(404).json("ce post n'existe pas")
            }
            if(req.auth.id != thePost.userId) {
                return res.status(403).json("Vous n'avez pas le droit de supprimer ce post");
            }
            postModel.remove(thePost, (err, docs) => {
                if (!err) res.json(docs);
                else console.log("Delete error : " + err);
            });
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}