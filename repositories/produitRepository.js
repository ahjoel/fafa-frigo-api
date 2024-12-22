const db = require("../configs/db/dataBase");

class ProduitRepository {
  async save(produit) {
    return await db.dBase.query(
      "INSERT INTO produits (code, name, mesure, categorie, pa, pv, stock_min, created_by, created_at) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, now());",
      [
        produit.code,
        produit.name,
        produit.mesure,
        produit.categorie,
        produit.pa,
        produit.pv,
        produit.stock_min,
        produit.createdBy,
      ]
    );
  }

  async update(produit) {
    return await db.dBase.query(
      `UPDATE produits
             SET code             = CASE WHEN ? IS NOT NULL THEN ? ELSE code END,
                 name             = CASE WHEN ? IS NOT NULL THEN ? ELSE name END,
                 mesure             = CASE WHEN ? IS NOT NULL THEN ? ELSE mesure END,
                 categorie             = CASE WHEN ? IS NOT NULL THEN ? ELSE categorie END,
                 pa         = CASE WHEN ? IS NOT NULL THEN ? ELSE pa END,
                 pv         = CASE WHEN ? IS NOT NULL THEN ? ELSE pv END,
                 stock_min          = CASE WHEN ? IS NOT NULL THEN ? ELSE stock_min END,
                 updated_by        = ?,
                 updated_at        = now()
             WHERE id = ?`,
      [
        produit.code,
        produit.code,
        produit.name,
        produit.name,
        produit.mesure,
        produit.mesure,
        produit.categorie,
        produit.categorie,
        produit.pa,
        produit.pa,
        produit.pv,
        produit.pv,
        produit.stock_min,
        produit.stock_min,
        produit.updatedBy,
        produit.id
      ]
    );
  }

  async findById(id) {
    return (
      await db.dBase.query(
            `SELECT p.id,
                    p.code,
                    p.name,
                    p.categorie,
                    p.mesure,
                    p.pv,
                    p.stock_min,
                    p.created_at      AS createdAt,
                    p.created_by      AS createdBy,
                    p.updated_at      As updatedAt,
                    p.updated_by      AS updatedBy,
                    p.deleted_at      As deletedAt,
                    p.deleted_by      AS deletedBy
            FROM produits p    
            WHERE p.id = ?
            AND p.deleted_at IS NULL
            GROUP BY p.id`,
        [id]
      )
    )[0];
  }

  async findAll() {
    return await db.dBase.query(
            `SELECT p.id,
                    p.code,
                    p.name,
                    p.categorie,
                    p.mesure,
                    p.pa,
                    p.pv,
                    p.stock_min,
                    p.created_at      AS createdAt,
                    p.created_by      AS createdBy,
                    p.updated_at      As updatedAt,
                    p.updated_by      AS updatedBy,
                    p.deleted_at      As deletedAt,
                    p.deleted_by      AS deletedBy
            FROM produits p    
            WHERE p.deleted_at IS NULL
            GROUP BY p.id 
            ORDER BY p.id DESC`,
    );
  }

  async countFindAllProduitKg() {
    return (
      await db.dBase
        .query(`SELECT CAST(count(id) AS CHAR(255)) AS produitNumberKg
                                                  FROM produits
                                                  WHERE deleted_by is null AND mesure = 'KG' `)
    )[0];
  }

  async countFindAllProduitCrt() {
    return (
      await db.dBase
        .query(`SELECT CAST(count(id) AS CHAR(255)) AS produitNumberCrt
                                                  FROM produits
                                                  WHERE deleted_by is null AND mesure = 'CRT' `)
    )[0];
  }

  async countFindAllFactureOfDay() {
    return (
      await db.dBase
        .query(`
          SELECT 
              CAST(COUNT(distinct f2.id) AS CHAR(255))  AS nb_factures_du_jour
          FROM 
              factures f2
          INNER JOIN 
              mouvements m ON m.facture_id = f2.id
          INNER JOIN 
              clients c1 ON f2.client_id = c1.id
          LEFT JOIN  
              reglements r ON f2.id = r.facture_id AND m.deleted_at IS NULL
          WHERE 
              DATE(f2.created_at) = CURDATE() 
          AND m.deleted_at IS NULL
        `)
    )[0];
  }

  async countFindAllReglementOfDay() {
    return (
      await db.dBase
        .query(`
            SELECT 
                CAST(COUNT(r.id) AS CHAR(255)) AS reglements_du_jour
            FROM 
                reglements r
            INNER JOIN 
                factures f ON r.facture_id = f.id
            INNER JOIN 
                users u ON r.created_by = u.id
            INNER JOIN 
                clients c ON f.client_id = c.id
            WHERE 
                r.deleted_at IS NULL
                AND r.deleted_by IS NULL
                AND DATE(r.created_at) = CURDATE()
        `)
    )[0];
  }

  async countFindAllProduitRc() {
    return (
      await db.dBase
        .query(`SELECT CAST(count(id) AS VARCHAR(255)) AS produitNumber
                                                  FROM produits
                                                  WHERE deleted_by is null AND stock='RC' `)
    )[0];
  }

  async delete(authUserId, produitId) {
    return await db.dBase.query(
      "UPDATE produits SET deleted_at = now(), deleted_by = ? WHERE id = ?",
      [authUserId, produitId]
    );
  }
}

module.exports = new ProduitRepository();
