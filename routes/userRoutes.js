const userHandler = require("../apis/userHandler");
const authController = require("../controllers/authController");

module.exports = function (app) {
    app.post("/fafa-frigo/v1/sign/in", userHandler.signIn);
    app.get("/fafa-frigo/v1/users", [authController.verifyToken], userHandler.findUser);
    app.get("/fafa-frigo/v1/users/all", [authController.verifyToken], userHandler.findAll);
    app.post("/fafa-frigo/v1/users", [authController.verifyToken], userHandler.addUser);
    app.put("/fafa-frigo/v1/users", [authController.verifyToken], userHandler.updateUser);
    app.delete("/fafa-frigo/v1/users", [authController.verifyToken], userHandler.deleteUser);
}