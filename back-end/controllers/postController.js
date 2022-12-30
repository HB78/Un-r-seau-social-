const ObjectID = require("mongoose").Types.ObjectId;
const fs = require("fs");
const postModel = require('./../models/postsModel')
const userModel = require('./../models/userModel')
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

//lire les publications

module.exports.readPost = async (req, res) => {
    console.log("log")
    try {
        await postModel.find((e, docs) => {
            console.log("log 3", docs)
            if (docs.length === 0 || docs === null) return res.status(404).json("il n'y a pas de publication pour le moment")
            return res.status(200).json(docs)
        }).sort({ createdAt: -1 }).clone();
    } catch (e) {
        console.log("Error to get data : " + e);
        return res.status(500).json(e)
    }
};

//lire les publications d'un utilisateur

module.exports.readPostOfUser = async (req, res) => {
    const idUser = req.params.id;
    try {
        await postModel.find(idUser, (err, docs) => {
            console.log("log 3", docs)
            if (!docs) return res.status(404).json("La personne n'a encore rien posté")
            if (!err) return res.status(200).json(docs);
        }).sort({ createdAt: -1 }).clone()
    } catch (err) {
        console.log("Error to get data : " + err);
        return res.status(500).json(err)
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
        firstName,
        lastName,
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

        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

//supprimer une publication

module.exports.deletePost = async (req, res) => {
    const idParams = req.params.id
    try {
        await postModel.findById(idParams, (err, docs) => {
            const thePost = docs;
            if (!thePost) {
                return res.status(404).json("ce post n'existe pas")
            }
            // if (req.auth.id != thePost.userId) {
            //     return res.status(403).json("Vous n'avez pas le droit de supprimer ce post");
            // }

            //Suppression de l'image car elle va être remplacer par la nouvelle image envoyée
            //Sinon on va avoir des doublons dans le dossier image
            if(!thePost.pictureImage === null) {
                const photo = JSON.stringify(thePost.pictureImage)
                const filename = photo.split("/images")[1];
                fs.unlink(`images/${filename}`, (err) => {
                    if (err) throw err;
                });
            }
            
            //suppression de la publication
            postModel.remove(thePost, (err, docs) => {
                if (!err) return res.status(200).json("Publication supprimée avec succès");
                console.log("Delete publication error : " + err)
                return res.status(500).json(err);
            });
        }).clone()
    } catch (error) {
        console.log(error)
        return res.status(400).json(error);
    }
}

//modifier une publication

module.exports.updatePost = async (req, res) => {
    const idParams = req.params.id

    try {
        await postModel.findById(idParams, (err, docs) => {
            let thePost = docs
            if (!thePost) return res.status(404).send("Post not found");
            //if (req.auth.id != thePost.userId) return res.status(403).send("Vous n'avez pas le droit de modifier cette publication");
           
        }).clone()
        if (req.file) {
            //Suppression de l'image car elle va être remplacer par la nouvelle image envoyée
            //Sinon on va avoir des doublons dans le dossier image
            const filename = postModel.pictureImage.split("/images")[1];
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
            .then(() => res.status(200).json({ message: "publication mise à jour" }))
            .catch((error) => res.status(404).json({ error }));
    } catch (error) {
        console.log(error)
        return res.status(500).json(error);
    }
}

/****************************************** COMMENTAIRES ********************************************* */

/*CREER UN COMMENTAIRE*/

module.exports.createCom = async (req, res) => {
    const idPost = req.params.id;
    const idToken = req.auth.id
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknow : " + req.params.id);

    const userCommenter = await userModel.findById(idToken, (err, docs) => {
        if (!docs) return res.status(404).json("Ce user n'existe pas")
        if (!err) return res.status(200).json(docs);
    })

    try {
        await postModel.findByIdAndUpdate(idPost,  {
            $push: {
              comments: {
                commenterId: userCommenter.userId,
                commenterName: userCommenter.lastname,
                commenterImage: userCommenter.picture,
                text: req.body.text,
                timestamp: new Date().getTime(),
              },
            },
          },
          { new: true },
          (err, docs) => {
            if (!err) return res.status(201).json(docs);
            else return res.status(400).send(err);
          }
          ).clone()
    } catch (err) {
        console.log("Error to create data : " + err);
        return res.status(500).json(err)
    }
};

/*effacer un commentaire*/
module.exports.deleteCom = async (req, res) => {
    const idPost = req.params.id;
    const idToken = req.auth.id

    try {
         postModel.findById(req.params.id, (err, docs) => {
            const theComment = docs.comments.find(comments._id.equals(req.params.id))
            if (!theComment) return res.status(404).send("Comment not found");
            if (idToken != theComment.commenterId) return res.status(403).send("Vous n'avez pas le droit de supprimer ce commentaire");

            postModel.remove(theComment, (err, docs) => {
                if (!err) return res.status(200).json("message supprimé");
                return res.status(500).json(err)
              });
        })
    } catch (error) {
        console.log("Error to delete data : " + error);
        return res.status(500).json(error)
    }
}

//mettre un commentaire à jour
module.exports.updateCom = async (req, res) => {
    const idPost = req.params.id;
    const idToken = req.auth.id

    try {
         postModel.findById(req.params.id, (err, docs) => {
            const theComment = docs.comments.find(comments._id.equals(req.params.id))
            if (!theComment) return res.status(404).send("Comment not found");
            if (idToken != theComment.commenterId) return res.status(403).json("Vous n'avez pas le droit de supprimer ce commentaire");
            theComment.text = req.body.text

            docs.save((err) => {
                if (!err) return res.status(200).json("message mis à jour");
                return res.status(500).json(err)
              });
        })
    } catch (error) {
        console.log("Error to delete data : " + error);
        return res.status(500).json(error)
    }
};

//Mettre à jour un like ou un dislike
exports.dislikeandlike = (req, res, next) => {
    switch(req.body.like) {
        //si le user a liker
        case 1 : 
        postModel.updateOne(
            { _id: req.params.id},
            {
             $inc: { likes: 1 },
             $push: { usersLiked: req.auth.id }
            }
        )
        .then(() => res.status(201).json({ message: 'post liker' }))
        .catch((error) => { res.status(400).json({ error }) });
        break;
        
        //pour disliker
        case -1 : 
        postModel.updateOne(
            { _id: req.params.id},
            {
             $inc: { dislikes: 1 },
             $push: { usersDisliked: req.auth.id }
            }
        )
        .then(() => res.status(201).json({ message: 'post disliker' }))
        .catch(error => res.status(400).json({ error }));
        break;
        
        //pour annuler le like ou le dislike
        case 0 :
        postModel.findOne({ _id: req.params.id })
        .then((obj) => {
            if(obj.usersLiked.includes(req.auth.id)) {
                postModel.updateOne(
                    { _id: req.params.id},
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.auth.id }
                    }
                )
                .then(() => res.status(201).json({ message: 'like annulé' }))
                .catch(error => res.status(400).json({ error }));
            }
            if(obj.usersDisliked.includes(req.auth.id)) {
                postModel.updateOne(
                    { _id: req.params.id},
                    {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.auth.id }
                    }
                )
                .then(() => res.status(201).json({ message: 'dislike annulé' }))
                .catch(error => res.status(400).json({ error }));
            }
        })
        .catch((error) => res.status(400).json({ error }));
        break;
        
        default :
        console.log(' le problème se situe au niveau du switch')
  }
};
