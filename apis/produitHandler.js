const {logger} = require("../utils/logger");
const produitRepository = require("../repositories/produitRepository");
const genericJsonResponse = require("../models/genericResponseModel");
const JsonValidator = require("ajv");
const jsonValidator = new JsonValidator();

function sendResponse(response, status, message, description, data, httpStatus) {
    httpStatus = httpStatus != null ? httpStatus : status;
    response.status(httpStatus).json(new genericJsonResponse(status, message, description, data));
}

exports.addProduit = async (request, response) => {
    try {
        const schema = require("../configs/JSONSchemas/addProduit.json");
       
        const valid = jsonValidator.validate(schema, request.body);
        if (!valid) {
            return sendResponse(
                response,
                400,
                "FAILURE",
                jsonValidator.errors[0].message,
                null
            );
        }
        const produitObject = {
            code: request.body.code,
            name: request.body.name,
            mesure: request.body.mesure,
            categorie: request.body.categorie,
            pa: request.body.pa,
            pv: request.body.pv,
            stock_min: request.body.stock_min,
            createdBy: request.authUserId,
        };
     
        const result = await produitRepository.save(produitObject);
        const savedProduit = await produitRepository.findById(result.insertId);
        sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            savedProduit
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [addProduit Produits] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};


exports.updateProduit = async (request, response) => {
    try {
        const produitObject = request.body;
        produitObject.updatedBy = request.authUserId;

        const result = await produitRepository.update(produitObject);
        if (!result.affectedRows) {
            sendResponse(response, 404, "FAILURE", "Produit not found", null);
        } else {
            const updatedProduit = await produitRepository.findById(request.body.id);
            sendResponse(
                response,
                200,
                "SUCCESS",
                "Request executed successfully",
                updatedProduit
            );
        }
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [updateProduit Produit] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};


exports.findProduit = async (request, response) => {
    try {
        const produit = await produitRepository.findById(request.query.id);
        if (!model) {
            sendResponse(response, 404, "SUCCESS", "Produit not found", null);
        } else {
            sendResponse(
                response,
                200,
                "SUCCESS",
                "Request executed successfully",
                produit
            );
        }
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findProduit] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};


exports.findAll = async (request, response) => {
    try {
        const produits = await produitRepository.findAll();

        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                produits: produits
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAll Produits] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};


exports.findCountProducts = async (request, response) => {
    try {
        const allProduitsCountKg = await produitRepository.countFindAllProduitKg();
        const allProduitsCountCrt = await produitRepository.countFindAllProduitCrt();
        const allFacturesOfDayCount = await produitRepository.countFindAllFactureOfDay();
        const allReglementOfDayCount = await produitRepository.countFindAllReglementOfDay();

        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                produitNumberKg: allProduitsCountKg.produitNumberKg,
                produitNumberCrt: allProduitsCountCrt.produitNumberCrt,
                factureNumbers: allFacturesOfDayCount.nb_factures_du_jour,
                reglementNumbers: allReglementOfDayCount.reglements_du_jour,
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findCountProducts Produits] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findCountProductsRc = async (request, response) => {
    try {
        const allProduitsCount = await produitRepository.countFindAllProduitRc();

        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                produitNumber: allProduitsCount.produitNumber,
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findCountProductsRc Produits] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.deleteProduit = async (request, response) => {
    try {
        const id = request.query.id;
        if (!id) {
            sendResponse(
                response,
                400,
                "FAILURE",
                "The id query param is required",
                null
            );
        }
        const result = await produitRepository.delete(request.authUserId, id);
        if (!result.affectedRows) {
            sendResponse(response, 404, "FAILURE", "Produit not found", null);
        } else {
            sendResponse(
                response,
                200,
                "SUCCESS",
                "Request executed successfully",
                null
            );
        }
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [deleteProduit] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.deleteProduitRc = async (request, response) => {
    try {
        const id = request.query.id;
        if (!id) {
            sendResponse(
                response,
                400,
                "FAILURE",
                "The id query param is required",
                null
            );
        }
        const result = await produitRepository.delete(request.authUserId, id);
        if (!result.affectedRows) {
            sendResponse(response, 404, "FAILURE", "Produit not found", null);
        } else {
            sendResponse(
                response,
                200,
                "SUCCESS",
                "Request executed successfully",
                null
            );
        }
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [deleteProduit] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};
