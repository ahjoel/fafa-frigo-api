const fournisseurHandler = require("../apis/fournisseurHandler");
const authController = require("../controllers/authController");

module.exports = function (app) {
    app.post("/fafa-frigo/v1/fournisseurs", [authController.verifyToken], fournisseurHandler.addFournisseur);
    app.get("/fafa-frigo/v1/fournisseurs", [authController.verifyToken], fournisseurHandler.findFournisseur);
    app.put("/fafa-frigo/v1/fournisseurs", [authController.verifyToken], fournisseurHandler.updateFournisseur);
    app.get("/fafa-frigo/v1/fournisseurs/all", [authController.verifyToken], fournisseurHandler.findAll);
    app.delete("/fafa-frigo/v1/fournisseurs", [authController.verifyToken], fournisseurHandler.deleteFournisseur);
}