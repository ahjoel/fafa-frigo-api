const db = require("../configs/db/dataBase");

class FournisseurRepository {

    async save(fournisseur) {
        return await db.dBase.query(
            "INSERT INTO fournisseurs(name, description, created_by, created_at) VALUES(?, ?, ?, now())",
            [fournisseur.name, fournisseur.description, fournisseur.createdBy]
        );
    }

    async findById(id) {
        return (await db.dBase.query(
            "SELECT id, name, description, created_at AS createdAt, created_by AS createdBy, updated_at As updatedAt, updated_by AS updatedBy, deleted_at As deletedAt, deleted_by AS deletedBy FROM fournisseurs WHERE deleted_at IS NULL AND id = ?",
            [id]
        ))[0];
    }

    async update(fournisseur) {
        return await db.dBase.query(
            "UPDATE fournisseurs " +
            "SET" +
            "    name = CASE WHEN ? IS NOT NULL THEN ? ELSE name END," +
            "    description = CASE WHEN ? IS NOT NULL THEN ? ELSE description END," +
            "    updated_at = now()," +
            "    updated_by = ? " +
            "WHERE" +
            "    id = ?",
            [fournisseur.name, fournisseur.name, fournisseur.description, fournisseur.description, fournisseur.updatedBy, fournisseur.id]
        );
    }

    async findAll() {
        return await db.dBase.query(
            "SELECT id, name, description, created_at AS createdAt, created_by AS createdBy, updated_at As updatedAt, updated_by AS updatedBy, deleted_at As deletedAt, deleted_by AS deletedBy FROM fournisseurs WHERE deleted_at IS NULL ORDER BY id DESC"
        );
    }

    async delete(authUserId, fournisseurId) {
        return await db.dBase.query(
            "UPDATE fournisseurs SET deleted_at = now(), deleted_by = ? WHERE id = ?", [authUserId, fournisseurId]
        );
    }
}

module.exports = new FournisseurRepository();