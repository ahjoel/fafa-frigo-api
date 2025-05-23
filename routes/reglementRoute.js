const reglementHandler = require("../apis/reglementHandler");
const authController = require("../controllers/authController");

module.exports = function (app) {
    app.get("/fafa-frigo/v1/reglements/all", [authController.verifyToken], reglementHandler.findAll);
    app.get("/fafa-frigo/v1/reglements/all/dash", [authController.verifyToken], reglementHandler.findAllDAshboard);
    app.get("/fafa-frigo/v1/reglements/search", [authController.verifyToken], reglementHandler.findAllReglementSearchCodeOrDateReg);
    app.get("/fafa-frigo/v1/reglements/month/count", [authController.verifyToken], reglementHandler.findAllReglementMonth);
    app.get("/fafa-frigo/v1/reglements/day/count", [authController.verifyToken], reglementHandler.findAllReglementDay);
    app.delete("/fafa-frigo/v1/reglements", [authController.verifyToken], reglementHandler.deleteReglement);
}