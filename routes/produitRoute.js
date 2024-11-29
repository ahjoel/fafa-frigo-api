const produitHandler = require("../apis/produitHandler");
const authController = require("../controllers/authController");

module.exports = function (app) {
    app.post("/fafa-frigo/v1/produits", [authController.verifyToken], produitHandler.addProduit);
    app.get("/fafa-frigo/v1/produits", [authController.verifyToken], produitHandler.findProduit);
    app.put("/fafa-frigo/v1/produits", [authController.verifyToken], produitHandler.updateProduit);
    app.get("/fafa-frigo/v1/produits/all", [authController.verifyToken], produitHandler.findAll);
    app.get("/fafa-frigo/v1/produits/count", [authController.verifyToken], produitHandler.findCountProducts);
    app.delete("/fafa-frigo/v1/produits", [authController.verifyToken], produitHandler.deleteProduit);
}