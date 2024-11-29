const clientHandler = require("../apis/clientHandler");
const authController = require("../controllers/authController");

module.exports = function (app) {
    app.post("/fafa-frigo/v1/clients", [authController.verifyToken], clientHandler.addClient);
    app.get("/fafa-frigo/v1/clients", [authController.verifyToken], clientHandler.findClient);
    app.put("/fafa-frigo/v1/clients", [authController.verifyToken], clientHandler.updateClient);
    app.get("/fafa-frigo/v1/clients/all", [authController.verifyToken], clientHandler.findAll);
    app.delete("/fafa-frigo/v1/clients", [authController.verifyToken], clientHandler.deleteClient);
}