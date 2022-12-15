//on utlise le framework express pour faciliter le codage avec nodeJS 
const express = require('express');
const app = express();

//le req et le res fonctionne avec le paquet body parser sa ressemble a la methode JSON.parse
//cela permet d'interpreter du JSON
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const usersRoutes = require("./routes/usersRoutes");

/*CONFIGURATION*/

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/images", express.static(path.join(__dirname, 'images')));

/*MONGOOSE SET UP*/ 
const result = dotenv.config();
const port = process.env.PORT || 4001
//pour se connecter à la base de données, mongoose fait le lien entre l'api et mongoDB

//pour eviter les bugs avec mongoose 7
mongoose.set('strictQuery', false);
mongoose.connect(
    "mongodb://0.0.0.0:27017/social",
    {useNewUrlParser : true, useUnifiedTopology: true},
    (err) => {
        if(!err) console.log("vous etes connecté à mongodb");
        else console.log("la connexion à mongodb a échouée" + err);
    }
)

//on écoute le port pour lancer le serveur
app.listen(port, (req, res) => {
    try {
        console.log(`Le server a été activé au port ${port}`)
        console.log("http://localhost:" + port)
    } catch (error) {
        console.log(`${error} le server ne fonctionne pas`)
    }
});

//ROUTES

//on utilise les routes users pour login et signup
app.use("/auth", usersRoutes);


