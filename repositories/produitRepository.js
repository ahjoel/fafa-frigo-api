const db = require("../configs/db/dataBase");

class ProduitRepository {
  async save(produit) {
    return await db.dBase.query(
      "INSERT INTO produits (code, name, mesure, categorie, pv, stock_min, created_by, created_at) VALUES ( ?, ?, ?, ?, ?, ?, ?, now());",
      [
        produit.code,
        produit.name,
        produit.mesure,
        produit.categorie,
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

  async countFindAllProduit() {
    return (
      await db.dBase
        .query(`SELECT CAST(count(id) AS VARCHAR(255)) AS produitNumber
                                                  FROM produits
                                                  WHERE deleted_by is null AND stock='R1' `)
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
