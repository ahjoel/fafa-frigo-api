const mouvemententreeHandler = require("../apis/mouvementEntreeHandler");
const authController = require("../controllers/authController");

module.exports = function (app) {
    app.post("/fafa-frigo/v1/entree", [authController.verifyToken], mouvemententreeHandler.addMouvementEntreeR1);
    app.post("/fafa-frigo/v1/sortie", [authController.verifyToken], mouvemententreeHandler.addMouvementSortieR1);
    app.get("/fafa-frigo/v1/entree", [authController.verifyToken], mouvemententreeHandler.findMouvementEntreeR1);
    app.put("/fafa-frigo/v1/entree", [authController.verifyToken], mouvemententreeHandler.updateMouvementEntreeR1);
    app.get("/fafa-frigo/v1/entree/all", [authController.verifyToken], mouvemententreeHandler.findAllMouvementEntree);
    app.get("/fafa-frigo/v1/inventaire/all", [authController.verifyToken], mouvemententreeHandler.findAllMouvementInventaire);
    app.post("/fafa-frigo/v1/inventaire/add", [authController.verifyToken], mouvemententreeHandler.addMouvementEntreeInventaire);
    app.put("/fafa-frigo/v1/inventaire/add/update", [authController.verifyToken], mouvemententreeHandler.updateMouvementEntreeInventaire);
    app.get("/fafa-frigo/v1/entree/search", [authController.verifyToken], mouvemententreeHandler.findAllEntreeSearchDateEnt);
    app.post("/fafa-frigo/v1/entree/all", [authController.verifyToken], mouvemententreeHandler.findAllMouvementEntreeSearchWithQuery);
    app.get("/fafa-frigo/v1/codefacture", [authController.verifyToken], mouvemententreeHandler.findCodeFacture);
    app.get("/fafa-frigo/v1/entree/all/dispo", [authController.verifyToken], mouvemententreeHandler.findAllMouvementEntreeR1Dispo);
    app.get("/fafa-frigo/v1/entree/all/facture/detail", [authController.verifyToken], mouvemententreeHandler.findAllMouvementFactureDetail);
    app.get("/fafa-frigo/v1/entree/all/facture/gros", [authController.verifyToken], mouvemententreeHandler.findAllMouvementFactureGros);
    app.delete("/fafa-frigo/v1/entree", [authController.verifyToken], mouvemententreeHandler.deleteMouvementEntreeR1);
    app.delete("/fafa-frigo/v1/inventaire", [authController.verifyToken], mouvemententreeHandler.deleteMouvementEntreeR1);
    app.delete("/fafa-frigo/v1/sortie", [authController.verifyToken], mouvemententreeHandler.deleteMouvementSortieR1);
    
    app.get("/fafa-frigo/v1/entree/stat/stock/entree", [authController.verifyToken], mouvemententreeHandler.findAllMouvementStockEntreeStat);
    app.get("/fafa-frigo/v1/entree/stat/stock/sortie", [authController.verifyToken], mouvemententreeHandler.findAllMouvementStockSortieStat);
    app.get("/fafa-frigo/v1/entree/stat/stock", [authController.verifyToken], mouvemententreeHandler.findAllMouvementStockStat);
    app.get("/fafa-frigo/v1/entree/stat/recette", [authController.verifyToken], mouvemententreeHandler.findAllRecettePeriode);

    // A faire
    app.get("/fafa-frigo/v1/caisse/mois", [authController.verifyToken], mouvemententreeHandler.findAllStatCaisseMois);
}