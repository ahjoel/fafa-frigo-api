const mouvemententreeHandler = require("../apis/mouvementEntreeHandler");
const authController = require("../controllers/authController");

module.exports = function (app) {
    // R1
    app.post("/fafa-frigo/v1/entree", [authController.verifyToken], mouvemententreeHandler.addMouvementEntreeR1);
    app.post("/fafa-frigo/v1/sortie", [authController.verifyToken], mouvemententreeHandler.addMouvementSortieR1);
    app.get("/fafa-frigo/v1/entree", [authController.verifyToken], mouvemententreeHandler.findMouvementEntreeR1);
    app.put("/fafa-frigo/v1/entree", [authController.verifyToken], mouvemententreeHandler.updateMouvementEntreeR1);
    app.get("/fafa-frigo/v1/entree/all", [authController.verifyToken], mouvemententreeHandler.findAllMouvementEntree);
    app.get("/fafa-frigo/v1/codefacture", [authController.verifyToken], mouvemententreeHandler.findCodeFacture);
    app.get("/fafa-frigo/v1/entree/all/dispo", [authController.verifyToken], mouvemententreeHandler.findAllMouvementEntreeR1Dispo);
    app.delete("/fafa-frigo/v1/entree", [authController.verifyToken], mouvemententreeHandler.deleteMouvementEntreeR1);
    app.delete("/fafa-frigo/v1/sortie", [authController.verifyToken], mouvemententreeHandler.deleteMouvementSortieR1);
     
    // A faire
    app.get("/fafa-frigo/v1/caisse/mois", [authController.verifyToken], mouvemententreeHandler.findAllStatCaisseMois);
}