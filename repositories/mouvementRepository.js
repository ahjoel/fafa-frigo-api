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

  async saveSortie(mouvement) {
    return await db.dBase.query(
      "INSERT INTO mouvements (code, produit_id, facture_id, types, qte, pv, stock, created_by, created_at) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, now());",
      [
        mouvement.code,
        mouvement.produitId,
        mouvement.factureId,
        mouvement.types,
        mouvement.qte,
        mouvement.pv,
        mouvement.stock,
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

  async findById(id) {
    return (
      await db.dBase.query(
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
      GROUP BY m.id 
      ORDER BY m.id DESC
      LIMIT 500
            `
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
        CAST(MONTH(f.created_at) AS VARCHAR(255)) as num_mois,
        CAST(COUNT(f.id) AS VARCHAR(255)) as nb_id_deja
        FROM factures f 
        WHERE MONTH(f.created_at) = MONTH(CURRENT_DATE)
      `
    );
  }

  // async findAllEntreeRC(limit, offset) {
  //   return await db.dBase.query(
  //           `SELECT m.id,
  //                   m.code,
  //                   m.produit_id      AS produitId,
  //                   m.types,
  //                   m.qte,
  //                   m.stock,
  //                   m.created_at      AS createdAt,
  //                   m.created_by      AS createdBy,
  //                   m.updated_at      As updatedAt,
  //                   m.updated_by      AS updatedBy,
  //                   m.deleted_at      As deletedAt,
  //                   m.deleted_by      AS deletedBy,
  //                   p.name            AS produit,
  //                   mo.name           AS model
  //           FROM mouvements m
  //                   INNER JOIN produits p on m.produit_id = p.id
  //                   INNER JOIN models mo on p.model_id = mo.id
  //           WHERE m.deleted_at IS NULL
  //           AND m.stock= 'RC'
  //           AND m.types= 'ADD'
  //           GROUP BY m.id LIMIT ?
  //           OFFSET ?`,
  //     [limit, offset]
  //   );
  // }

  async findAllEntreeR1Dispo() {
    return await db.dBase.query(
      `
            SELECT p.id as id, p.name as produit, p.categorie as categorie,
              sum(case 
                      when m.created_at  < '2024-12-01'
                      then case m.types when 'OUT' then -1 else 1 end
                      else 0 
                  end * qte) AS st_init,
              sum(case
                      when m.created_at BETWEEN '2024-12-01' AND now()
                      AND m.types = 'ADD' then qte 
                      else 0 
              end) AS qt_e,
              sum(case 
                      when m.created_at BETWEEN '2024-12-01' AND now()
                      AND m.types = 'OUT' then qte 
                      else 0 
                  end) AS qt_s, 
              sum(case m.types when 'OUT' then -1 else 1 end * qte) AS st_dispo, p.stock_min as stockMinimal, p.pv as pv
            FROM mouvements m
            INNER JOIN produits p on m.produit_id = p.id 
            AND m.deleted_at IS NULL
            AND m.created_at <= now()
            GROUP BY p.id, p.name
            order by p.name 
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
      ["R1", produitId]
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
