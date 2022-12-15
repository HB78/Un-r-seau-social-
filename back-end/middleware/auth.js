const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const result = dotenv.config();

module.exports = async (req, res, next) => {
    try {
        let tokenAndBearer = req.headers.authorization;
        if (!tokenAndBearer) {
            return res.status(403).json("Acces refusé")
          }
        let token = tokenAndBearer.replace("Bearer ", "");
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN);

        if (!decodedToken) {
            res.status(401).json("Vous n'etes pas autorisé à vous connecté")
            throw "Mauvais jwt";
          }
          req.auth= {
            id: decodedToken.userId
          }
          next()
          return;
    } catch (error) {
        console.log('error', error)
        res.status(401).json({error});
    }
}