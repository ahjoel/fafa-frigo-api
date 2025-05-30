const db = require("../configs/db/dataBase");

class MouvementRepository {
  async save(mouvement) {
    return await db.dBase.query(
      "INSERT INTO mouvements (code, produit_id, fournisseur_id, types, qte, created_by, created_at) VALUES ( ?, ?, ?, ?, ?, ?, now());",
      [
        mouvement.code,
        mouvement.produitId,
        mouvement.fournisseurId,
        mouvement.types,
        mouvement.qte,
        mouvement.createdBy,
      ]
    );
  }

  async saveInventaire(mouvement) {
    return await db.dBase.query(
      "INSERT INTO mouvements (inventaire, produit_id, types, qte, created_by, created_at) VALUES ( ?, ?, ?, ?, ?, now());",
      [
        mouvement.inventaire,
        mouvement.produitId,
        mouvement.types,
        mouvement.qte,
        mouvement.createdBy,
      ]
    );
  }

  async saveSortie(mouvement) {
    return await db.dBase.query(
      "INSERT INTO mouvements (code, produit_id, facture_id, types, qte, pv, created_by, created_at) VALUES ( ?, ?, ?, ?, ?, ?, ?, now());",
      [
        mouvement.code,
        mouvement.produitId,
        mouvement.factureId,
        mouvement.types,
        mouvement.qte,
        mouvement.pv,
        mouvement.createdBy,
      ]
    );
  }

  async update(mouvement) {
    return await db.dBase.query(
      `UPDATE mouvements
             SET code             = CASE WHEN ? IS NOT NULL THEN ? ELSE code END,
                 produit_id             = CASE WHEN ? IS NOT NULL THEN ? ELSE produit_id END,
                 fournisseur_id         = CASE WHEN ? IS NOT NULL THEN ? ELSE fournisseur_id END,
                 types             = CASE WHEN ? IS NOT NULL THEN ? ELSE types END,
                 qte             = CASE WHEN ? IS NOT NULL THEN ? ELSE qte END,
                 updated_by        = ?,
                 updated_at        = now()
             WHERE id = ?`,
      [
        mouvement.code,
        mouvement.code,
        mouvement.produitId,
        mouvement.produitId,
        mouvement.fournisseurId,
        mouvement.fournisseurId,
        mouvement.types,
        mouvement.types,
        mouvement.qte,
        mouvement.qte,
        mouvement.updatedBy,
        mouvement.id,
      ]
    );
  }

  async updateEntreeInventaire(mouvement) {
    return await db.dBase.query(
      `UPDATE mouvements
             SET
                 produit_id             = CASE WHEN ? IS NOT NULL THEN ? ELSE produit_id END,
                 types             = CASE WHEN ? IS NOT NULL THEN ? ELSE types END,
                 qte             = CASE WHEN ? IS NOT NULL THEN ? ELSE qte END,
                 updated_by        = ?,
                 updated_at        = now()
             WHERE id = ?`,
      [
        mouvement.produitId,
        mouvement.produitId,
        mouvement.types,
        mouvement.types,
        mouvement.qte,
        mouvement.qte,
        mouvement.updatedBy,
        mouvement.id,
      ]
    );
  }

  async findById(id) {
    return (
      await db.dBase.query(
        `SELECT m.id,
                m.code,
                m.produit_id      AS produitId,
                m.types,
                m.qte,
                m.created_at      AS createdAt,
                m.created_by      AS createdBy,
                m.updated_at      As updatedAt,
                m.updated_by      AS updatedBy,
                m.deleted_at      As deletedAt,
                m.deleted_by      AS deletedBy,
                p.name            AS produit,
                p.categorie       AS categorie
        FROM mouvements m    
        INNER JOIN produits p on m.produit_id = p.id
        WHERE m.id = ?
        AND m.deleted_at IS NULL
        GROUP BY m.id`,
        [id]
      )
    )[0];
  }

  async findByIdRC(id) {
    return (
      await db.dBase.query(
        `SELECT m.id,
                    m.code,
                    m.produit_id      AS produitId,
                    m.types,
                    m.qte,
                    m.stock,
                    m.created_at      AS createdAt,
                    m.created_by      AS createdBy,
                    m.updated_at      As updatedAt,
                    m.updated_by      AS updatedBy,
                    m.deleted_at      As deletedAt,
                    m.deleted_by      AS deletedBy,
                    p.name            AS produit,
                    mo.name           AS model,
                    f.name            AS fournisseur
            FROM mouvements m    
                    INNER JOIN produits p on m.produit_id = p.id
                    INNER JOIN models mo on p.model_id = mo.id
                    INNER JOIN fournisseurs f on p.fournisseur_id = f.id
            WHERE m.id = ?
            AND m.stock= 'RC'
            AND m.deleted_at IS NULL
            GROUP BY m.id`,
        [id]
      )
    )[0];
  }

  async findAllEntree() {
    return await db.dBase.query(
      `SELECT m.id,
              m.code,
              m.produit_id      AS produitId,
              m.fournisseur_id      AS fournisseurId,
              m.types,
              m.pv,
              m.qte,
              m.created_at      AS createdAt,
              m.created_by      AS createdBy,
              m.updated_at      As updatedAt,
              m.updated_by      AS updatedBy,
              m.deleted_at      As deletedAt,
              m.deleted_by      AS deletedBy,
              p.name            AS produit,
              p.mesure            AS mesure,
              p.categorie       AS model,
              f.name            AS fournisseur
      FROM mouvements m    
              INNER JOIN produits p on m.produit_id = p.id
              INNER JOIN fournisseurs f on m.fournisseur_id = f.id
      WHERE m.deleted_at IS NULL
      AND m.types= 'ADD'
      GROUP BY m.id 
      ORDER BY m.id DESC
            `
    );
  }

  async findAllEntreeInventaire() {
    return await db.dBase.query(
      `SELECT m.id,
              m.code,
              m.produit_id      AS produitId,
              m.types,
              m.pv,
              m.qte,
              m.created_at      AS createdAt,
              m.created_by      AS createdBy,
              m.updated_at      As updatedAt,
              m.updated_by      AS updatedBy,
              m.deleted_at      As deletedAt,
              m.deleted_by      AS deletedBy,
              p.name            AS produit,
              p.mesure            AS mesure,
              p.categorie       AS model
      FROM mouvements m    
              INNER JOIN produits p on m.produit_id = p.id
      WHERE m.deleted_at IS NULL
      AND m.inventaire IS NOT NULL
      GROUP BY m.id 
      ORDER BY m.id DESC
            `
    );
  }

  async findAllMouvementSituation(periodes) {
    return await db.dBase.query(
      `SELECT 
          p.id as id, 
          p.name as produit, 
          p.categorie as categorie, 
          p.mesure,
          ROUND(sum(case 
                  when m.created_at  < ?
                  then case m.types when 'OUT' then -1 else 1 end
                  else 0 
              end * qte), 2) AS st_init,
          ROUND(sum(case
                  when m.created_at BETWEEN ? AND ?
                  AND m.types = 'ADD' then qte 
                  else 0 
          end), 2) AS qt_e,
          ROUND(sum(case 
                  when m.created_at BETWEEN ? AND ?
                  AND m.types = 'OUT' then qte 
                  else 0 
              end), 2) AS qt_s, 
          ROUND(sum(case m.types when 'OUT' then -1 else 1 end * qte), 2) AS st_dispo, 
          ROUND(sum(case m.types when 'OUT' then -1 else 1 end * m.pv), 0) AS margeBene, 
          p.stock_min as stockMinimal
      FROM 
          mouvements m
      INNER JOIN 
          produits p on m.produit_id = p.id 
          AND m.deleted_at IS NULL
          AND m.created_at <= ?
      GROUP BY 
          p.id, p.name, p.categorie, p.mesure, p.stock_min
      ORDER BY 
          p.name

            `, [periodes.dateDeb, periodes.dateDeb, periodes.dateFin, periodes.dateDeb, periodes.dateFin, periodes.dateFin]
    );
  }

  async findAllMouvementSituationEntrees(periodes) {
    return await db.dBase.query(
      `SELECT 
          m.id,
          m.code,
          m.produit_id AS produitId,
          m.fournisseur_id AS fournisseurId,
          m.types,
          m.pv,
          m.qte,
          m.created_at AS createdAt,
          m.created_by AS createdBy,
          m.updated_at AS updatedAt,
          m.updated_by AS updatedBy,
          m.deleted_at AS deletedAt,
          m.deleted_by AS deletedBy,
          p.name AS produit,
          p.mesure AS mesure,
          p.categorie,
          f.name AS fournisseur,
          CONCAT(u.firstname, ' ', u.lastname) AS name
      FROM 
          mouvements m    
      INNER JOIN 
          produits p ON m.produit_id = p.id
      INNER JOIN 
          fournisseurs f ON m.fournisseur_id = f.id
      INNER JOIN 
          users u ON m.created_by = u.id 
      WHERE 
          m.deleted_at IS NULL
          AND m.types = 'ADD'
          AND m.created_at BETWEEN ? AND ?
      GROUP BY 
          m.id
      ORDER BY 
          p.name ASC
            `, [periodes.dateDeb, periodes.dateFin]
    );
  }

  async findAllMouvementSituationSorties(periodes) {
    return await db.dBase.query(
      `SELECT 
          m.id,
          f.code,
          m.produit_id AS produitId,
          m.types,
          m.pv,
          m.qte,
          f.created_at AS createdAt,
          m.created_by AS createdBy,
          m.updated_at AS updatedAt,
          m.updated_by AS updatedBy,
          m.deleted_at AS deletedAt,
          m.deleted_by AS deletedBy,
          p.name AS produit,
          p.mesure AS mesure,
          p.categorie,
          CONCAT(u.firstname, ' ', u.lastname) AS name
      FROM 
          mouvements m    
      INNER JOIN 
          produits p ON m.produit_id = p.id
      INNER JOIN 
          factures f ON m.facture_id = f.id
      INNER JOIN 
          users u ON m.created_by = u.id 
      WHERE 
          m.deleted_at IS NULL
          AND m.types = 'OUT'
          AND m.created_at BETWEEN ? AND ?
      GROUP BY 
          m.id
      ORDER BY 
          p.name ASC
            `, [periodes.dateDeb, periodes.dateFin]
    );
  }

  async findAllRecettePeriode(periodes) {
    return await db.dBase.query(
      `SELECT 
          f2.id as id, 
          f2.code as code, 
          c1.name as client, 
          f2.client_id as client_id, 
          f2.created_at AS createdAt, 
          f2.tax as taxe, 
          cast(count(m.produit_id) as char(50)) as nbproduit, 
          ROUND(sum(m.pv * m.qte), 0) AS totalfacture,
          ROUND(sum(p2.pa * m.qte), 0) AS margeBene,
          CASE 
              WHEN r.facture_id IS NOT NULL AND r.deleted_at IS NULL AND r.deleted_by IS NULL THEN 'payée' 
              ELSE 'impayée' 
          END AS statut
      FROM 
          mouvements m
      INNER JOIN 
          factures f2 on m.facture_id = f2.id 
      INNER JOIN 
          produits p2 on m.produit_id = p2.id
      INNER JOIN 
          clients c1 ON f2.client_id = c1.id
      LEFT JOIN  
          reglements r ON f2.id = r.facture_id
          AND m.deleted_at IS NULL
      WHERE 
          f2.created_at BETWEEN ? AND ?
      GROUP BY 
          f2.id, f2.code, c1.name, f2.client_id, f2.created_at, f2.tax, r.facture_id, r.deleted_at, r.deleted_by
      ORDER BY 
          f2.id ASC
            `, [periodes.dateDeb, periodes.dateFin]
    );
  }

  async findAllEntreeSearchByDateEntree(dt) {
    return await db.dBase.query(
      `SELECT m.id,
              m.code,
              m.produit_id      AS produitId,
              m.fournisseur_id      AS fournisseurId,
              m.types,
              m.qte,
              m.created_at      AS createdAt,
              m.created_by      AS createdBy,
              m.updated_at      As updatedAt,
              m.updated_by      AS updatedBy,
              m.deleted_at      As deletedAt,
              m.deleted_by      AS deletedBy,
              p.name            AS produit,
              p.mesure            AS mesure,
              p.categorie       AS model,
              f.name            AS fournisseur
      FROM mouvements m    
              INNER JOIN produits p on m.produit_id = p.id
              INNER JOIN fournisseurs f on m.fournisseur_id = f.id
      WHERE m.deleted_at IS NULL
      AND m.types= 'ADD'
      AND m.created_at like ?
            `, [dt]
    );
  }

  async findAllEntreeSearch(searchValue) {
    return await db.dBase.query(
      `SELECT m.id,
              m.code,
              m.produit_id      AS produitId,
              m.fournisseur_id      AS fournisseurId,
              m.types,
              m.qte,
              m.created_at      AS createdAt,
              m.created_by      AS createdBy,
              m.updated_at      As updatedAt,
              m.updated_by      AS updatedBy,
              m.deleted_at      As deletedAt,
              m.deleted_by      AS deletedBy,
              p.name            AS produit,
              p.categorie       AS model,
              f.name            AS fournisseur
      FROM mouvements m    
              INNER JOIN produits p on m.produit_id = p.id
              INNER JOIN fournisseurs f on m.fournisseur_id = f.id
      WHERE m.deleted_at IS NULL
      AND m.types= 'ADD'
      AND m.created_at = ? 
      OR p.name = ?
      OR m.code = ?
            `,[searchValue]
    );
  }

  async findAllEntreeRC(limit, offset) {
    return await db.dBase.query(
      `SELECT m.id,
                    m.code,
                    m.produit_id      AS produitId,
                    m.types,
                    m.qte,
                    m.stock,
                    m.created_at      AS createdAt,
                    m.created_by      AS createdBy,
                    m.updated_at      As updatedAt,
                    m.updated_by      AS updatedBy,
                    m.deleted_at      As deletedAt,
                    m.deleted_by      AS deletedBy,
                    p.name            AS produit,
                    mo.name           AS model,
                    f.name            AS fournisseur
            FROM mouvements m    
                    INNER JOIN produits p on m.produit_id = p.id
                    INNER JOIN models mo on p.model_id = mo.id
                    INNER JOIN fournisseurs f on p.fournisseur_id = f.id
            WHERE m.deleted_at IS NULL
            AND m.stock= 'RC'
            AND m.types= 'ADD'
            GROUP BY m.id 
            ORDER BY m.id DESC
            LIMIT ?
            OFFSET ?`,
      [limit, offset]
    );
  }

  async factureCode() {
    return await db.dBase.query(
      `
        SELECT 
            CAST(COUNT(f.id) AS CHAR) AS nb_id_deja
        FROM 
            factures f
        WHERE 
            MONTH(f.created_at) = MONTH(CURDATE()) 
            AND YEAR(f.created_at) = YEAR(CURDATE());
      `
    );
  }


  async findAllEntreeR1Dispo() {
    return await db.dBase.query(
      `
            SELECT p.id as id, p.name as produit, p.categorie as categorie, p.mesure,
              ROUND(sum(case 
                      when m.created_at  < '2024-12-01'
                      then case m.types when 'OUT' then -1 else 1 end
                      else 0 
                  end * qte), 2) AS st_init,
              ROUND(sum(case
                      when m.created_at BETWEEN '2024-12-01' AND now()
                      AND m.types = 'ADD' then qte 
                      else 0 
              end), 2) AS qt_e,
              ROUND(sum(case 
                      when m.created_at BETWEEN '2024-12-01' AND now()
                      AND m.types = 'OUT' then qte 
                      else 0 
                  end), 2) AS qt_s, 
              ROUND(sum(case m.types when 'OUT' then -1 else 1 end * qte), 2) AS st_dispo, p.stock_min as stockMinimal, p.pv as pv
            FROM mouvements m
            INNER JOIN produits p on m.produit_id = p.id 
            AND m.deleted_at IS NULL
            AND m.created_at <= now()
            GROUP BY p.id, p.name
            order by p.name 
          `
    );
  }

  async findAllMouvementFactureDetail() {
    return await db.dBase.query(
      `
            SELECT m.id AS id,
                   f.code AS code,
                  f.created_at AS createdAt,
                  p.name AS produit, 
                  p.categorie AS categorie, 
                  p.mesure,
                  p.pv AS pv,
                  c.name as client
          FROM mouvements m
          INNER JOIN produits p ON m.produit_id = p.id 
          INNER JOIN factures f ON m.facture_id = f.id 
          inner join clients c on f.client_id = c.id 
          WHERE p.mesure = 'KG'
            AND m.deleted_at IS NULL
            AND m.created_at <= NOW()
          GROUP BY m.id, p.name, p.categorie, p.mesure, p.pv, f.code, f.created_at
          ORDER BY f.code desc
          limit 500
          `
    );
  }

  async findAllMouvementFactureGros() {
    return await db.dBase.query(
      `
          SELECT m.id AS id,
            f.code AS code,
            f.created_at AS createdAt,
            p.name AS produit, 
            p.categorie AS categorie, 
            p.mesure,
            m.qte,
            p.pv AS pv,
            c.name as client
        FROM mouvements m
        INNER JOIN produits p ON m.produit_id = p.id 
        INNER JOIN factures f ON m.facture_id = f.id 
        inner join clients c on f.client_id = c.id 
        WHERE p.mesure = 'CRT'
          AND m.deleted_at IS NULL
          AND m.created_at <= NOW()
        GROUP BY m.id, p.name, p.categorie, p.mesure, p.pv, f.code, f.created_at
        ORDER BY f.code desc
        limit 500
          `
    );
  }

  async findAllEntreeRCDispo(limit, offset) {
    return await db.dBase.query(
      `
            SELECT p.id as id, p.name as produit, m2.name as model, f.name as fournisseur,
              sum(case 
                      when m.created_at  < '2024-05-19'
                      then case m.types when 'OUT' then -1 else 1 end
                      else 0 
                  end * qte) AS st_init,
              sum(case
                      when m.created_at BETWEEN '2024-05-19' AND now()
                      AND m.types = 'ADD' then qte 
                      else 0 
              end) AS qt_e,
              sum(case 
                      when m.created_at BETWEEN '2024-05-19' AND now()
                      AND m.types = 'OUT' then qte 
                      else 0 
                  end) AS qt_s, 
              sum(case m.types when 'OUT' then -1 else 1 end * qte) AS st_dispo, p.stock_min as stockMinimal, p.pv as pv
            FROM mouvements m
            inner join produits p on m.produit_id = p.id 
            INNER JOIN models m2 on p.model_id = m2.id
            INNER JOIN fournisseurs f on p.fournisseur_id = f.id
            AND m.deleted_at IS NULL
            AND m.stock= 'RC'
            AND m.created_at <= now()
            GROUP BY p.id 
            order by p.name 
            LIMIT ? OFFSET ?
          `,
      [limit, offset]
    );
  }

  async findAllVerifierStockR1DispoProduit(produitId) {
    return await db.dBase.query(
      `
            SELECT p.id as id, p.name as produit,
              sum(case 
                      when m.created_at  < '2024-05-19'
                      then case m.types when 'OUT' then -1 else 1 end
                      else 0 
                  end * qte) AS st_init,
              sum(case
                      when m.created_at BETWEEN '2024-05-19' AND now()
                      AND m.types = 'ADD' then qte 
                      else 0 
              end) AS qt_e,
              sum(case 
                      when m.created_at BETWEEN '2024-05-19' AND now()
                      AND m.types = 'OUT' then qte 
                      else 0 
                  end) AS qt_s, 
              sum(case m.types when 'OUT' then -1 else 1 end * qte) AS st_dispo, p.stock_min as stockMinimal, p.pv as pv
            FROM mouvements m
            inner join produits p on m.produit_id = p.id 
            AND m.deleted_at IS NULL
            AND m.created_at <= now()
            WHERE p.id= ?
          `,
      [produitId]
    );
  }

  async findAllVerifierStockRCDispoProduit(produitId) {
    return await db.dBase.query(
      `
            SELECT p.id as id, p.name as produit, m2.name as model, f.name as fournisseur,
              sum(case 
                      when m.created_at  < '2024-05-19'
                      then case m.types when 'OUT' then -1 else 1 end
                      else 0 
                  end * qte) AS st_init,
              sum(case
                      when m.created_at BETWEEN '2024-05-19' AND now()
                      AND m.types = 'ADD' then qte 
                      else 0 
              end) AS qt_e,
              sum(case 
                      when m.created_at BETWEEN '2024-05-19' AND now()
                      AND m.types = 'OUT' then qte 
                      else 0 
                  end) AS qt_s, 
              sum(case m.types when 'OUT' then -1 else 1 end * qte) AS st_dispo, p.stock_min as stockMinimal, p.pv as pv
            FROM mouvements m
            inner join produits p on m.produit_id = p.id 
            INNER JOIN models m2 on p.model_id = m2.id
            INNER JOIN fournisseurs f on p.fournisseur_id = f.id
            AND m.deleted_at IS NULL
            AND m.stock= ?
            AND m.created_at <= now()
            WHERE p.id= ?
          `,
      ["RC", produitId]
    );
  }

  async findAllStatReglementParMois() {
    return await db.dBase.query(
      `
            SELECT
            CAST(ROW_NUMBER() OVER () AS VARCHAR(255)) AS id,
            CONCAT(
                CASE MONTH(r.created_at)
                    WHEN 1 THEN 'Janvier'
                    WHEN 2 THEN 'Février'
                    WHEN 3 THEN 'Mars'
                    WHEN 4 THEN 'Avril'
                    WHEN 5 THEN 'Mai'
                    WHEN 6 THEN 'Juin'
                    WHEN 7 THEN 'Juillet'
                    WHEN 8 THEN 'Août'
                    WHEN 9 THEN 'Septembre'
                    WHEN 10 THEN 'Octobre'
                    WHEN 11 THEN 'Novembre'
                    WHEN 12 THEN 'Décembre'
                END,
                ' ',
                YEAR(r.created_at)
            ) AS Mois_Annee,
            SUM(r.totalFacture) AS MontantTotal
        FROM
            reglements r
        GROUP BY
            YEAR(r.created_at), MONTH(r.created_at)
        ORDER BY
            YEAR(r.created_at), MONTH(r.created_at)
          `
    );
  }

  async findAllStatReglementParMoisTotal() {
    return (await db.dBase.query(
      `
        SELECT SUM(MontantTotal) AS Grand_Total
        FROM (
        SELECT
            CONCAT(
                CASE MONTH(r.created_at)
                    WHEN 1 THEN 'Janvier'
                    WHEN 2 THEN 'Février'
                    WHEN 3 THEN 'Mars'
                    WHEN 4 THEN 'Avril'
                    WHEN 5 THEN 'Mai'
                    WHEN 6 THEN 'Juin'
                    WHEN 7 THEN 'Juillet'
                    WHEN 8 THEN 'Août'
                    WHEN 9 THEN 'Septembre'
                    WHEN 10 THEN 'Octobre'
                    WHEN 11 THEN 'Novembre'
                    WHEN 12 THEN 'Décembre'
                END,
                ' ',
                YEAR(r.created_at)
            ) AS Mois_Annee,
            SUM(r.totalFacture) AS MontantTotal
        FROM
            reglements r
        GROUP BY
            YEAR(r.created_at), MONTH(r.created_at)
        ORDER BY
            YEAR(r.created_at), MONTH(r.created_at)
            ) AS sous_requete
          `)
    )[0];
  }

  async countFindAllEntreeR1Dispo() {
    return (
      await db.dBase.query(`
        SELECT CAST(count(sous_requete.produitId) AS VARCHAR(255)) AS entreeR1DispoNumber 
        FROM
        (SELECT p.id as produitId, p.name as produit, m2.name as model, f.name as fournisseur,
          sum(case 
                  when m.created_at  < '2024-05-19'
                  then case m.types when 'OUT' then -1 else 1 end
                  else 0 
              end * qte) AS st_init,
          sum(case
                  when m.created_at BETWEEN '2024-05-19' AND now() 
                  AND m.types = 'ADD' then qte 
                  else 0 
          end) AS qt_e,
          sum(case 
                  when m.created_at BETWEEN '2024-05-19' AND now() 
                  AND m.types = 'OUT' then qte 
                  else 0 
              end) AS qt_s, 
          sum(case m.types when 'OUT' then -1 else 1 end * qte) AS st_dispo, p.stock_min as stockMinimal
        FROM mouvements m
        inner join produits p on m.produit_id = p.id 
        INNER JOIN models m2 on p.model_id = m2.id
        INNER JOIN fournisseurs f on p.fournisseur_id = f.id
        AND m.deleted_at IS NULL
        AND m.stock= 'R1'
        AND m.created_at <= now()
        GROUP BY p.id
        order by p.name)
        as sous_requete
        `)
    )[0];
  }

  async countFindAllEntreeRCDispo() {
    return (
      await db.dBase.query(`
        SELECT CAST(count(sous_requete.produitId) AS VARCHAR(255)) AS entreeRCDispoNumber 
        FROM
        (SELECT p.id as produitId, p.name as produit, m2.name as model, f.name as fournisseur,
          sum(case 
                  when m.created_at  < '2024-05-19'
                  then case m.types when 'OUT' then -1 else 1 end
                  else 0 
              end * qte) AS st_init,
          sum(case
                  when m.created_at BETWEEN '2024-05-19' AND now() 
                  AND m.types = 'ADD' then qte 
                  else 0 
          end) AS qt_e,
          sum(case 
                  when m.created_at BETWEEN '2024-05-19' AND now() 
                  AND m.types = 'OUT' then qte 
                  else 0 
              end) AS qt_s, 
          sum(case m.types when 'OUT' then -1 else 1 end * qte) AS st_dispo, p.stock_min as stockMinimal
        FROM mouvements m
        inner join produits p on m.produit_id = p.id 
        INNER JOIN models m2 on p.model_id = m2.id
        INNER JOIN fournisseurs f on p.fournisseur_id = f.id
        AND m.deleted_at IS NULL
        AND m.stock= 'RC'
        AND m.created_at <= now()
        GROUP BY p.id
        order by p.name)
        as sous_requete
        `)
    )[0];
  }

  async countFindAllEntreeR1() {
    return (
      await db.dBase
        .query(`SELECT CAST(count(id) AS VARCHAR(255)) AS entreeR1Number
                                                  FROM mouvements
                                                  WHERE deleted_by is null AND types='ADD' AND stock='R1'`)
    )[0];
  }

  async countFindAllEntreeRC() {
    return (
      await db.dBase
        .query(`SELECT CAST(count(id) AS VARCHAR(255)) AS entreeRCNumber
                                                  FROM mouvements
                                                  WHERE deleted_by is null AND types='ADD' AND stock='RC'`)
    )[0];
  }

  async countFindAllEntreeRC() {
    return (
      await db.dBase
        .query(`SELECT CAST(count(id) AS VARCHAR(255)) AS entreeRCNumber
                                                  FROM mouvements
                                                  WHERE deleted_by is null AND types='ADD' AND stock='RC'`)
    )[0];
  }

  // async delete(authUserId, produitId) {
  //   return await db.dBase.query(
  //     "UPDATE mouvements SET deleted_at = now(), deleted_by = ? WHERE id = ?",
  //     [authUserId, produitId]
  //   );
  // }

  async delete(produitId) {
    return await db.dBase.query("DELETE FROM mouvements WHERE id = ?", [
      produitId,
    ]);
  }

  async deleteMouvementSortie(mouvementId) {
    return await db.dBase.query("DELETE FROM mouvements WHERE id = ?", [
      mouvementId,
    ]);
  }
}

module.exports = new MouvementRepository();
