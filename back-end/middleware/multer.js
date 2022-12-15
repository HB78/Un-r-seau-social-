//importation de multer
const multer  = require('multer');

//on choisit les format qui seront accéptés
const MIME_TYPES = {
    "image/jpg " : "jpg",
    "image/jpeg" : "jpeg",
    "image/png" : "png"
};

//la destination des fichiers images / creation d'un fichier unique pour l'image
const storage = multer.diskStorage({
    //la destination de stockage du fichier image avec la clef destination
    destination : (req, file, callback) => {
        callback(null, "images")
    },
    //mise en place du nom unique pour chaque fichier
    filename: (req, file, callback) => {
        //on supprime les espaces dans le nom des fichiers
        const name = file.originalname.split(' ').join('_');
        const originalName = name.split(".")[0];
        const extension = MIME_TYPES[file.mimetype];
        //le callback va créer le nom à partir du name de extension et de date.now
        callback(null, originalName + '_' + Date.now() + '.' + extension);
    }
});
// exportation de multer avec single on autorise l'upload d'une seule photo
module.exports = multer({storage: storage}).single('image');