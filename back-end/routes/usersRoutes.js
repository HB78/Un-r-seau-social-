//ici on met en place les routes en utilisant les verbes liés au CRUD

const express = require("express");
const router = express.Router();
//on importe les consignes autrement dit les controllers
//on importe les schémas par richochet car déjà importés par les controllers
const userCTRL = require("../controllers/userController");

router.post("/signup", userCTRL.register);
//router.post("/login", userCTRL.login);

//on exporte tous les routers que l'on a coder ici
module.exports = router;