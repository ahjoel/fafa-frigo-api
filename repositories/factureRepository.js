const db = require("../configs/db/claudexBars");

class FactureRepository {

    async save(facture) {
        return await db.claudexBarsDB.query(
            "INSERT INTO factures(code, client_id, tax, created_by, created_at) VALUES(?, ?, ?, ?, now())",
            [facture.code, facture.client_id, facture.tax, facture.createdBy]
        );
    }

    async saveLigneFacture(facture) {
        return await db.claudexBarsDB.query(
            "INSERT INTO mouvements(facture_id, produit_id, qte, pv, stock, types, created_by, created_at) VALUES(?, ?, ?, ?, ?, ?, ?, now())",
            [facture.facture_id, facture.productId, facture.qte, facture.pv, facture.stock, facture.types, facture.createdBy]
        );
    }

    async findById(id) {
        return (await db.claudexBarsDB.query(
            "SELECT id, code, client_id, tax, created_at AS createdAt, created_by AS createdBy, updated_at As updatedAt, updated_by AS updatedBy FROM factures WHERE id = ?",
            [id]
        ))[0];
    }

    async findByIdReglement(id) {
        return (await db.claudexBarsDB.query(
            "SELECT id, facture_id, totalFacture, created_at AS createdAt, created_by AS createdBy, updated_at As updatedAt, updated_by AS updatedBy FROM reglements WHERE id = ?",
            [id]
        ))[0];
    }

    async findLigneFactureById(id) {
        return (await db.claudexBarsDB.query(
            "SELECT id, code, facture_id, produit_id, created_at AS createdAt, created_by AS createdBy, updated_at As updatedAt, updated_by AS updatedBy FROM mouvements WHERE id = ?",
            [id]
        ))[0];
    }

    async update(facture) {
        return await db.claudexBarsDB.query(
            "UPDATE factures " +
            "SET" +
            "    code = CASE WHEN ? IS NOT NULL THEN ? ELSE code END," +
            "    client_id = CASE WHEN ? IS NOT NULL THEN ? ELSE client_id END," +
            "    tax = CASE WHEN ? IS NOT NULL THEN ? ELSE tax END," +
            "    updated_at = now()," +
            "    updated_by = ? " +
            "WHERE" +
            "    id = ?",
            [facture.code, facture.code, facture.client_id, facture.client_id, facture.tax, facture.tax, facture.updatedBy, facture.id]
        );
    }

    async findAll(limit, offset) {
        return await db.claudexBarsDB.query(
            "SELECT id, code, client_id, created_at AS createdAt, created_by AS createdBy, updated_at As updatedAt, updated_by AS updatedBy FROM factures ORDER BY id DESC LIMIT ? OFFSET ?",[limit, offset]
        );
    }
    
    async findAllFacturesR1(limit, offset) {
        return await db.claudexBarsDB.query(
            `
            SELECT f2.id as id, f2.code as code, c1.name as client,f2.client_id as client_id, f2.created_at AS createdAt, f2.tax as taxe, m.stock as stock, cast(count(m.produit_id) as varchar(50)) as nbproduit, sum(m.pv * m.qte) AS totalfacture,
            CASE WHEN r.facture_id IS NOT NULL AND r.deleted_at IS NULL and r.deleted_by IS NULL THEN 'payée' ELSE 'impayée' END AS statut
            FROM mouvements m
            inner join factures f2 on m.facture_id = f2.id 
            INNER JOIN produits p2 on m.produit_id = p2.id
            INNER JOIN clients c1 ON f2.client_id = c1.id
            LEFT JOIN  reglements r ON f2.id = r.facture_id
            AND m.deleted_at IS NULL
            GROUP BY f2.id 
            order by f2.id desc
            LIMIT ? OFFSET ?`,[limit, offset]
        );
    }

    // async findAllFacturesRC(stock, limit, offset) {
    //     return await db.claudexBarsDB.query(
    //         `
    //         // INUTILISE
    //         SELECT f2.id as id, f2.code as code, f2.client as client, f2.created_at AS createdAt, f2.tax as taxe, cast(count(m.produit_id) as varchar(50)) as nbproduit, sum(m.pv * m.qte) AS totalfacture,
    //         CASE WHEN r.facture_id IS NOT NULL AND r.deleted_at IS NULL and r.deleted_by IS NULL THEN 'payée' ELSE 'impayée' END AS statut
    //         FROM mouvements m
    //         inner join factures f2 on m.facture_id = f2.id 
    //         INNER JOIN produits p2 on m.produit_id = p2.id
    //         LEFT JOIN  reglements r ON f2.id = r.facture_id
    //         AND m.deleted_at IS NULL
    //         AND m.stock= ?
    //         GROUP BY f2.id 
    //         order by f2.id desc 
    //         LIMIT ? OFFSET ?`,[stock, limit, offset]
    //     );
    // }

    async findAllDetailFacturesR1(code) {
        return await db.claudexBarsDB.query(
            `
            SELECT m.id, f2.code, m.facture_id as factureId, c1.name as client, f2.created_at, f2.tax, p2.name as produit, p2.id as produitId, m2.name as modele, f.name as fournisseur, m.qte, m.pv 
            FROM mouvements m
            inner join factures f2 on m.facture_id = f2.id 
            INNER JOIN produits p2 on m.produit_id = p2.id
            INNER JOIN fournisseurs f on p2.fournisseur_id = f.id
            INNER JOIN models m2 on p2.model_id = m2.id
            INNER JOIN clients c1 ON f2.client_id = c1.id
            AND m.deleted_at IS NULL
            where f2.code= ?
            `,[code]
        );
    }

    // async findAllDetailFacturesRC(stock, code) {
    //     return await db.claudexBarsDB.query(
    //         `
    //         // INUTILISE
    //         SELECT m.id, f2.code, m.facture_id as factureId, f2.client, f2.created_at, f2.tax, p2.name as produit, p2.id as produitId, m2.name as modele, f.name as fournisseur, m.qte, m.pv 
    //         FROM mouvements m
    //         inner join factures f2 on m.facture_id = f2.id 
    //         INNER JOIN produits p2 on m.produit_id = p2.id
    //         INNER JOIN fournisseurs f on p2.fournisseur_id = f.id
    //         INNER JOIN models m2 on p2.model_id = m2.id
    //         AND m.deleted_at IS NULL
    //         AND m.stock= ?
    //         where f2.code= ?
    //         `,[stock, code]
    //     );
    // }

    async countFindAllFactureR1() {
        return (await db.claudexBarsDB.query(`
        SELECT CAST(count(sous_requete.id) AS VARCHAR(255)) AS factureTotalR1Number 
        FROM (
            SELECT f2.id as id, f2.code as code, c1.name as client, f2.created_at AS createdAt, f2.tax as taxe, count(m.produit_id) as NbProduit, sum(m.pv * m.qte) AS totalFacture,
            CASE WHEN r.facture_id IS NOT NULL THEN 'payée' ELSE 'impayée' END AS statut
            FROM mouvements m
            inner join factures f2 on m.facture_id = f2.id 
            INNER JOIN produits p2 on m.produit_id = p2.id
            INNER JOIN clients c1 ON f2.client_id = c1.id
            LEFT JOIN 
                reglements r ON f2.id = r.facture_id
            AND m.deleted_at IS NULL
            GROUP BY f2.id 
            order by f2.id desc
        ) as sous_requete
        `))[0];
    }

    async countFindAllFactureImpayee() {
        return (await db.claudexBarsDB.query(`
        SELECT CAST(count(sous_requete.id) AS VARCHAR(255)) AS factureTotalImpayeNumber 
        FROM (
            SELECT f2.id as id,
                CASE WHEN r.facture_id IS NOT NULL THEN 'payée' ELSE 'impayée' END AS statut
            FROM mouvements m
            INNER JOIN factures f2 ON m.facture_id = f2.id 
            INNER JOIN produits p2 ON m.produit_id = p2.id
            LEFT JOIN reglements r ON f2.id = r.facture_id
            WHERE m.deleted_at IS NULL
            GROUP BY f2.id 
            HAVING statut = 'impayée'
            ORDER BY f2.id DESC
        ) as sous_requete;
        `))[0];
    }

    async countFindAllFactureRC() {
        return (await db.claudexBarsDB.query(`
            // INUTILISE
        SELECT CAST(count(sous_requete.id) AS VARCHAR(255)) AS factureTotalRCNumber 
        FROM (
            SELECT f2.id as id, f2.code as code, f2.client as client, f2.created_at AS createdAt, f2.tax as taxe, count(m.produit_id) as NbProduit, sum(m.pv * m.qte) AS totalFacture,
            CASE WHEN r.facture_id IS NOT NULL THEN 'payée' ELSE 'impayée' END AS statut
            FROM mouvements m
            inner join factures f2 on m.facture_id = f2.id 
            INNER JOIN produits p2 on m.produit_id = p2.id
            LEFT JOIN 
                reglements r ON f2.id = r.facture_id
            AND m.deleted_at IS NULL
            AND m.stock= 'RC'
            GROUP BY f2.id 
            order by f2.id desc
        ) as sous_requete
        `))[0];
    }

    async countFindAllFacture() {
        return (await db.claudexBarsDB.query(`SELECT CAST(count(id) AS VARCHAR(255)) AS facturesNumber
                                                  FROM factures `))[0];
    }

    async delete(factureId) {
        return await db.claudexBarsDB.query(
            "DELETE FROM factures WHERE id = ?", [factureId]
        );
    }

    async regler(facture) {
        return await db.claudexBarsDB.query(
            "INSERT INTO reglements(facture_id, totalFacture, created_by, created_at) VALUES(?, ?, ?, now())",
            [facture.facture_id, facture.total, facture.createdBy]
        );
    }

    async statistitqueParProducteurR1(date) {
        return await db.claudexBarsDB.query(
            `
            SELECT f.id as id,
                f.name AS producteur,
                SUM(m.qte) AS quantite,
                SUM(m.qte * p.pv) AS montant_vendu,
                m.types AS statut,
                m.stock as stock
            FROM
                mouvements m
            JOIN
                produits p ON m.produit_id = p.id
            JOIN
                fournisseurs f ON p.fournisseur_id = f.id
            WHERE
                m.created_at BETWEEN ? AND ?
            AND
                m.stock= ?
            AND
                m.types= ?
            AND 
                m.deleted_at IS null
            GROUP BY
                f.name
            ORDER BY
                f.name
            `,
            [date.date_debut, date.date_fin, "R1", "OUT" ]
        );
    }

    async statistitqueListeStockGeneralVenteR1(date) {
        return await db.claudexBarsDB.query(
            `
            SELECT CAST(ROW_NUMBER() OVER (ORDER BY produits.name) AS VARCHAR(255)) AS id, produits.name AS produit, models.name AS model, fournisseurs.name AS fournisseur,
            sum(case 
                when mouvements.created_at < ?
                then case mouvements.types when 'OUT' then -1 else 1 end
                else 0 
            END * mouvements.qte) AS qte_stock,
            sum(case
                when mouvements.created_at BETWEEN ? AND ?
                AND mouvements.types = 'ADD' then mouvements.qte
                else 0 
            end) AS qte_stock_entree,
            sum(case 
                when mouvements.created_at BETWEEN ? AND ?
                AND mouvements.types = 'OUT' then mouvements.qte
                else 0 
            end) AS qte_stock_vendu, 
            sum(case mouvements.types when 'OUT' then -1 else 1 end * mouvements.qte) AS qte_stock_restant, produits.stock_min AS seuil
            FROM mouvements,produits,models, fournisseurs
            WHERE mouvements.produit_id=produits.id 
            AND produits.model_id=models.id
            AND produits.fournisseur_id=fournisseurs.id
            AND mouvements.created_at <= ?
            AND mouvements.stock= ?
            GROUP BY produits.id
            ORDER BY produits.name
            `,
            [date.date_debut, date.date_debut, date.date_fin, date.date_debut, date.date_fin, date.date_fin, "R1"]
        );
    }

    async statistitqueParProducteurRC(date) {
        return await db.claudexBarsDB.query(
            `
            SELECT f.id as id,
                f.name AS producteur,
                SUM(m.qte) AS quantite,
                SUM(m.qte * p.pv) AS montant_vendu,
                m.types AS statut,
                m.stock as stock
            FROM
                mouvements m
            JOIN
                produits p ON m.produit_id = p.id
            JOIN
                fournisseurs f ON p.fournisseur_id = f.id
            WHERE
                m.created_at BETWEEN ? AND ?
            AND
                m.stock= ?
            AND
                m.types= ?
            AND 
                m.deleted_at IS null
            GROUP BY
                f.name
            ORDER BY
                f.name;
            `,
            [date.date_debut, date.date_fin, "RC", "OUT" ]
        );
    }

    async statistitqueListeStockGeneralVenteRC(date) {
        return await db.claudexBarsDB.query(
            `
            SELECT CAST(ROW_NUMBER() OVER (ORDER BY produits.name) AS VARCHAR(255)) AS id, produits.name AS produit, models.name AS model, fournisseurs.name AS fournisseur,
            sum(case 
                when mouvements.created_at < ?
                then case mouvements.types when 'OUT' then -1 else 1 end
                else 0 
            END * mouvements.qte) AS qte_stock,
            sum(case
                when mouvements.created_at BETWEEN ? AND ?
                AND mouvements.types = 'ADD' then mouvements.qte
                else 0 
            end) AS qte_stock_entree,
            sum(case 
                when mouvements.created_at BETWEEN ? AND ?
                AND mouvements.types = 'OUT' then mouvements.qte
                else 0 
            end) AS qte_stock_vendu, 
            sum(case mouvements.types when 'OUT' then -1 else 1 end * mouvements.qte) AS qte_stock_restant, produits.stock_min AS seuil
            FROM mouvements,produits,models, fournisseurs
            WHERE mouvements.produit_id=produits.id 
            AND produits.model_id=models.id
            AND produits.fournisseur_id=fournisseurs.id
            AND mouvements.created_at <= ?
            AND mouvements.stock= ?
            GROUP BY produits.id
            ORDER BY produits.name
            `,
            [date.date_debut, date.date_debut, date.date_fin, date.date_debut, date.date_fin, date.date_fin, "RC"]
        );
    }

    async statistitqueArchivageFactureR1(date) {
        return await db.claudexBarsDB.query(
            `
            SELECT CAST(ROW_NUMBER() OVER (ORDER BY f2.id) AS VARCHAR(255)) AS id, f2.code as code, c1.name as client, f2.created_at AS date_creation, f2.tax as taxe, m.stock, cast(count(m.produit_id) as varchar(50)) as nbproduit, sum(m.pv * m.qte) AS totalfacture,
            CASE WHEN r.facture_id IS NOT NULL AND r.deleted_at IS NULL and r.deleted_by IS NULL THEN 'payée' ELSE 'impayée' END AS statut
            FROM mouvements m
            inner join factures f2 on m.facture_id = f2.id 
            INNER JOIN produits p2 on m.produit_id = p2.id
            INNER JOIN clients c1 ON f2.client_id = c1.id
            LEFT JOIN  reglements r ON f2.id = r.facture_id
            AND m.deleted_at IS NULL
            WHERE m.stock= ?
            AND m.created_at BETWEEN ? AND ?
            GROUP BY f2.id
            order by f2.id
            `,
            ["R1", date.date_debut, date.date_fin]
        );
    }

    async statistitqueArchivageFactureRC(date) {
        return await db.claudexBarsDB.query(
            `
            SELECT CAST(ROW_NUMBER() OVER (ORDER BY f2.id) AS VARCHAR(255)) AS id, f2.code as code, c1.name as client, f2.created_at AS date_creation, f2.tax as taxe, m.stock, cast(count(m.produit_id) as varchar(50)) as nbproduit, sum(m.pv * m.qte) AS totalfacture,
            CASE WHEN r.facture_id IS NOT NULL AND r.deleted_at IS NULL and r.deleted_by IS NULL THEN 'payée' ELSE 'impayée' END AS statut
            FROM mouvements m
            inner join factures f2 on m.facture_id = f2.id 
            INNER JOIN produits p2 on m.produit_id = p2.id
            INNER JOIN clients c1 ON f2.client_id = c1.id
            LEFT JOIN  reglements r ON f2.id = r.facture_id
            AND m.deleted_at IS NULL
            WHERE m.stock= ?
            AND m.created_at BETWEEN ? AND ?
            GROUP BY f2.id
            order by f2.id
            `,
            ["RC", date.date_debut, date.date_fin]
        );
    }


}

module.exports = new FactureRepository();