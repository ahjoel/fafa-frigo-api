const {logger} = require("../utils/logger");
const reglementRepository = require("../repositories/reglementRepository");
const genericJsonResponse = require("../models/genericResponseModel");
const JsonValidator = require("ajv");
const jsonValidator = new JsonValidator();

function sendResponse(response, status, message, description, data, httpStatus) {
    httpStatus = httpStatus != null ? httpStatus : status;
    response.status(httpStatus).json(new genericJsonResponse(status, message, description, data));
}

// exports.updateReglement = async (request, response) => {
//     try {
//         const id = request.query.id;
//         if (!id) {
//             sendResponse(
//                 response,
//                 400,
//                 "FAILURE",
//                 "The id query param is required",
//                 null
//             );
//         }
//         const result = await reglementRepository.delete(request.authUserId, id);
//         if (!result.affectedRows) {
//             sendResponse(response, 404, "FAILURE", "Reglement not found", null);
//         } else {
//             sendResponse(
//                 response,
//                 200,
//                 "SUCCESS",
//                 "Request executed successfully",
//                 null
//             );
//         }
//     } catch (e) {
//         logger.error(request.correlationId + " ==> Error caught in [deleteReglement] ==> " + e.stack);
//         sendResponse(
//             response,
//             500,
//             "ERROR",
//             "An error occurred while processing the request",
//             null
//         );
//     }
// };

exports.deleteReglement = async (request, response) => {
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
        await reglementRepository.delete(id);
        sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            null
        );

    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [deleteReglement] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request deleteReglement",
            null
        );
    }
};

exports.findReglement = async (request, response) => {
    try {
        const facture = await factureRepository.findById(request.query.id);
        if (!model) {
            sendResponse(response, 404, "SUCCESS", "Facture not found", null);
        } else {
            sendResponse(
                response,
                200,
                "SUCCESS",
                "Request executed successfully",
                facture
            );
        }
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findFacture Facture not found] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request findFacture Facture not found",
            null
        );
    }
};

exports.findAll = async (request, response) => {
    try {
        const reglements = await reglementRepository.findAll();
        
        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                reglements: reglements
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAll Reglements] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request findAll Reglements",
            null
        );
    }
};

exports.findAllReglementSearchCodeOrDateReg = async (request, response) => {
    try {
        let reglements
        
        const code = request.query.codeFact + '';
        
        const dateReg = request.query.dateReg;
        
        const dt = `%` + dateReg + `%`;

        if (code && dateReg) {
            console.log('reg by code fact and date', code + ' et ' + dt);
            reglements = await reglementRepository.findReglementByCodeFactAndDateFact(dt, code);
        }else if (code && code != null) {
            console.log('reg by code fact', code);
            reglements = await reglementRepository.findReglementByCodeFact(code);
        } else {
            console.log('reg by date', dateReg);
            reglements = await reglementRepository.findReglementByDateFact(dt);
        }

        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                reglements: reglements
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllReglementSearchCodeOrDateReg reglements - Search] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request findAllReglementSearchCodeOrDateReg reglements Search",
            null
        );
    }
};

exports.findAllReglementMonth = async (request, response) => {
    try {
        const allReglementsCount = await reglementRepository.countFindAllReglementMonth();

        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                reglementMonthTotalNumber: allReglementsCount.reglementMonthTotalNumber
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllReglementMonth Reglements] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request findAllReglementMonth Reglements",
            null
        );
    }
};

exports.findAllReglementDay = async (request, response) => {
    try {
        const allReglementsCount = await reglementRepository.countFindAllReglementDay();

        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                reglementDayTotalNumber: allReglementsCount.reglementDayTotalNumber
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllReglementDay Reglements] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request findAllReglementDay Reglements",
            null
        );
    }
};
