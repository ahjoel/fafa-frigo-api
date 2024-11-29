const {logger} = require("../utils/logger");
const clientRepository = require("../repositories/clientRepository");
const genericJsonResponse = require("../models/genericResponseModel");
const JsonValidator = require("ajv");
const jsonValidator = new JsonValidator();

function sendResponse(response, status, message, description, data, httpStatus) {
    httpStatus = httpStatus != null ? httpStatus : status;
    response.status(httpStatus).json(new genericJsonResponse(status, message, description, data));
}

exports.addClient = async (request, response) => {
    try {
        const schema = require("../configs/JSONSchemas/addClient.json");
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
        const clientObject = {
            name: request.body.name,
            contact: request.body.contact,
            adresse: request.body.adresse,
            createdBy: request.authUserId,
        };
        const result = await clientRepository.save(clientObject);
        const savedModel = await clientRepository.findById(result.insertId);
        sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            savedModel
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [addClient Client] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.updateClient = async (request, response) => {
    try {
        const clientObject = request.body;
        clientObject.updatedBy = request.authUserId;

        const result = await clientRepository.update(clientObject);
        if (!result.affectedRows) {
            sendResponse(response, 404, "FAILURE", "Client not found", null);
        } else {
            const updatedClient = await clientRepository.findById(request.body.id);
            sendResponse(
                response,
                200,
                "SUCCESS",
                "Request executed successfully",
                updatedClient
            );
        }
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [updateClient Client] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findClient = async (request, response) => {
    try {
        const client = await clientRepository.findById(request.query.id);
        if (!client) {
            sendResponse(response, 404, "SUCCESS", "Client not found", null);
        } else {
            sendResponse(
                response,
                200,
                "SUCCESS",
                "Request executed successfully",
                client
            );
        }
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findClient] ==> " + e.stack);
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
        const clients = await clientRepository.findAll();

        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                clients: clients
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAll Clients] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.deleteClient = async (request, response) => {
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
        const result = await clientRepository.delete(request.authUserId, id);
        if (!result.affectedRows) {
            sendResponse(response, 404, "FAILURE", "Client not found", null);
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
        logger.error(request.correlationId + " ==> Error caught in [deleteClient] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};
