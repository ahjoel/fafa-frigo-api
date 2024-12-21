const {logger} = require("../utils/logger");
const mouvementRepository = require("../repositories/mouvementRepository");
const genericJsonResponse = require("../models/genericResponseModel");
const JsonValidator = require("ajv");
const jsonValidator = new JsonValidator();

function sendResponse(response, status, message, description, data, httpStatus) {
    httpStatus = httpStatus != null ? httpStatus : status;
    response.status(httpStatus).json(new genericJsonResponse(status, message, description, data));
}

exports.addMouvementEntreeR1 = async (request, response) => {
    try {
        const schema = require("../configs/JSONSchemas/addMouvement.json");
        // console.log("productObject ::", request.body);
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
        const entreeR1Object = {
            code: request.body.code,
            produitId: request.body.produitId,
            fournisseurId: request.body.fournisseurId,
            types: "ADD",
            qte: request.body.qte,
            createdBy: request.authUserId,
        };
        const result = await mouvementRepository.save(entreeR1Object);
        const savedEntreeR1 = await mouvementRepository.findById(result.insertId);
        sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            savedEntreeR1
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [addEntreeR1 Mouvements] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.addMouvementSortieR1 = async (request, response) => {
    try {
        const sortieR1Object = {
            code: "ADD_PROD_FACT",
            produitId: request.body.produitId,
            factureId: request.body.factureId,
            types: "OUT",
            qte: request.body.qte,
            createdBy: request.authUserId,
        };
        console.log("pdId :::", sortieR1Object.produitId);
        const mouvementsSortieProduitR1 = await mouvementRepository.findAllVerifierStockR1DispoProduit(sortieR1Object.produitId);
        const stockDispo = Number(mouvementsSortieProduitR1[0].st_dispo)
        const pv = Number(mouvementsSortieProduitR1[0].pv)
        const sortieR1ObjectUpdateWithPv = {
            code: "ADD_PROD_FACT",
            produitId: request.body.produitId,
            factureId: request.body.factureId,
            types: "OUT",
            qte: request.body.qte,
            pv: pv,
            createdBy: request.authUserId,
        };
        if (sortieR1Object.qte <= stockDispo) {
            const result = await mouvementRepository.saveSortie(sortieR1ObjectUpdateWithPv);
            const savedSortieR1 = await mouvementRepository.findById(result.insertId);
            sendResponse(
                response,
                200,
                "SUCCESS",
                "Request executed successfully",
                savedSortieR1
            );
        } else {
            return sendResponse(
                response,
                400,
                "FAILURE",
                "La quantité est supérieur au stock disponible",
                null
            );
        }
        const result = await mouvementRepository.save(entreeR1Object);
        const savedEntreeR1 = await mouvementRepository.findById(result.insertId);
        sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            savedEntreeR1
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [addMouvementSortieR1 Mouvements] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.updateMouvementEntreeR1 = async (request, response) => {
    try {
        const entreeR1Object = request.body;
        entreeR1Object.updatedBy = request.authUserId;

        const result = await mouvementRepository.update(entreeR1Object);
        if (!result.affectedRows) {
            sendResponse(response, 404, "FAILURE", "EntreeR1 not found", null);
        } else {
            console.log("ok");
            const updatedEntreeR1 = await mouvementRepository.findById(request.body.id);
            console.log("ok-1");
            sendResponse(
                response,
                200,
                "SUCCESS",
                "Request executed successfully",
                updatedEntreeR1
            );
        }
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [updateMouvementEntreeR1 MouvementEntreeR1] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findMouvementEntreeR1 = async (request, response) => {
    try {
        const mouvementEntreeR1 = await mouvementRepository.findById(request.query.id);
        if (!model) {
            sendResponse(response, 404, "SUCCESS", "MouvementEntreeR1 not found", null);
        } else {
            sendResponse(
                response,
                200,
                "SUCCESS",
                "Request executed successfully",
                mouvementEntreeR1
            );
        }
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findMouvementEntreeR1] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findAllMouvementEntree = async (request, response) => {
    try {

        const mouvementsEntree = await mouvementRepository.findAllEntree();
        
        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                mouvementsEntree: mouvementsEntree
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllMouvementEntree entreeNumber] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findAllMouvementStockStat = async (request, response) => {
    try {
        let situations

        const dateDeb = request.query.dd + 'T00:00:00';
        const dateFin = request.query.df + 'T23:59:59';

        const periodes = {
            dateDeb: dateDeb,
            dateFin: dateFin
        }

        if (dateDeb && dateFin) {
            situations = await mouvementRepository.findAllMouvementSituation(periodes);
        }
        
        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                situations: situations
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllMouvementStockStat situations] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findAllMouvementStockStatDuJour = async (request, response) => {
    try {
        let situations

        const dateDeb = request.query.dd;
        const dateFin = request.query.df;

        const periodes = {
            dateDeb: dateDeb,
            dateFin: dateFin
        }

        if (dateDeb && dateFin) {
            situations = await mouvementRepository.findAllMouvementSituation(periodes);
        }
        
        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                situations: situations
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllMouvementStockStat situations] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findAllEntreeSearchDateEnt = async (request, response) => {
    try {
        let entrees
        
        const dateEnt = request.query.dateEnt;
        
        const dt = `%` + dateEnt + `%`;

        if (dt) {
            console.log('entree by date', dt);
            entrees = await mouvementRepository.findAllEntreeSearchByDateEntree(dt);
        }

        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                mouvementsEntree: entrees
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllEntreeSearchDateEnt entrees - Search] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request findAllEntreeSearchDateEnt entrees Search",
            null
        );
    }
};

exports.findAllMouvementEntreeSearchWithQuery = async (request, response) => {
    try {
        const searchValue = request.query.search;

        if (searchValue === undefined || searchValue === null || searchValue === '') {
            return sendResponse(
                response,
                400,
                "FAILURE",
                "search attribute required",
                null
            );
        }

        const mouvementsEntree = await mouvementRepository.findAllEntreeSearch(searchValue);
        
        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                mouvementsEntree: mouvementsEntree
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllMouvementEntreeSearchWithQuery entreesData] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findCodeFacture = async (request, response) => {
    try {
        
        const codeFactureCount = await mouvementRepository.factureCode();

        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                infos: codeFactureCount
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findCodeFacture findCodeFacture] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findAllMouvementEntreeR1Dispo = async (request, response) => {
    try {
        const mouvementsEntreeR1Dispo = await mouvementRepository.findAllEntreeR1Dispo();
        
        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                mouvementsEntreeR1Dispo: mouvementsEntreeR1Dispo
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllMouvementEntreeR1Dispo entreeR1NumberDispo] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findAllMouvementFactureDetail = async (request, response) => {
    try {
        const factures = await mouvementRepository.findAllMouvementFactureDetail();
        
        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                factures: factures
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllMouvementFactureDetail facture Disponible Detail] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findAllMouvementFactureGros = async (request, response) => {
    try {
        const factures = await mouvementRepository.findAllMouvementFactureGros();
        
        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                factures: factures
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllMouvementFactureGros facture Disponible Gros] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

exports.findAllStatCaisseMois = async (request, response) => {
    try {
    
        const data = await mouvementRepository.findAllStatReglementParMois();
        const total = await mouvementRepository.findAllStatReglementParMoisTotal();

        return sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            {
                Grand_Total: total.Grand_Total,
                dataCaissMoi: data
            }
        );
    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [findAllMouvementEntreeR1Dispo entreeR1NumberDispo] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};

// exports.deleteMouvementEntreeR1 = async (request, response) => {
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
//         const result = await mouvementRepository.delete(request.authUserId, id);
//         if (!result.affectedRows) {
//             sendResponse(response, 404, "FAILURE", "MouvementEntreeR1 not found", null);
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
//         logger.error(request.correlationId + " ==> Error caught in [deleteMouvementEntreeR1] ==> " + e.stack);
//         sendResponse(
//             response,
//             500,
//             "ERROR",
//             "An error occurred while processing the request",
//             null
//         );
//     }
// };

exports.deleteMouvementEntreeR1 = async (request, response) => {
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
        await mouvementRepository.delete(id);
        sendResponse(
            response,
            200,
            "SUCCESS",
            "Request executed successfully",
            null
        );

    } catch (e) {
        logger.error(request.correlationId + " ==> Error caught in [deleteMouvementEntreeR1] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request deleteMouvementEntreeR1",
            null
        );
    }
};


exports.deleteMouvementSortieR1 = async (request, response) => {
    try {
        const id = Number(request.query.id);
        if (!id) {
            sendResponse(
                response,
                400,
                "FAILURE",
                "The id query param is required",
                null
            );
        }
        const result = await mouvementRepository.deleteMouvementSortie(id);
        if (!result.affectedRows) {
            sendResponse(response, 404, "FAILURE", "MouvementSortieR1 not found", null);
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
        logger.error(request.correlationId + " ==> Error caught in [deleteMouvementEntreeR1] ==> " + e.stack);
        sendResponse(
            response,
            500,
            "ERROR",
            "An error occurred while processing the request",
            null
        );
    }
};
