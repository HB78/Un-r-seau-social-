const express = require('express');
const router = express.Router();

//importation de multer et de sa config
const multer = require("../middleware/multer");

//on importe le middleware d'authentification
const auth = require("../middleware/auth");

//importation des controllers pour le CRUD
const crud = require("../controllers/postController");

/*publication*/
router.get("/", crud.readPost);
router.get("/:id", crud.readPostOfUser);
router.post("/", crud.createPost);
router.put("/:id", crud.updatePost);
router.delete("/:id", crud.deletePost);

/*commentaire*/
router.post("/commentaire/:id", crud.createCom);
router.put("/commentaire/:id", crud.updateCom);
router.delete("/commentaire/:id", crud.deleteCom);

/*likes et dislikes*/
router.post("/:id/like", crud.dislikeandlike);

//on exporte tous les routers que l'on a coder ici
module.exports = router;