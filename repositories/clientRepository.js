const db = require("../configs/db/dataBase");

class ClientRepository {

    async save(client) {
        return await db.dBase.query(
            "INSERT INTO clients(name, contact, adresse, created_by, created_at) VALUES(?, ?, ?, ?, now())",
            [client.name, client.contact, client.adresse, client.createdBy]
        );
    }

    async findById(id) {
        return (await db.dBase.query(
            "SELECT id, name, adresse, contact, created_at AS createdAt, created_by AS createdBy, updated_at As updatedAt, updated_by AS updatedBy, deleted_at As deletedAt, deleted_by AS deletedBy FROM clients WHERE deleted_at IS NULL AND id = ?",
            [id]
        ))[0];
    }

    async update(client) {
        return await db.dBase.query(
            "UPDATE clients " +
            "SET" +
            "    name = CASE WHEN ? IS NOT NULL THEN ? ELSE name END," +
            "    contact = CASE WHEN ? IS NOT NULL THEN ? ELSE contact END," +
            "    adresse = CASE WHEN ? IS NOT NULL THEN ? ELSE adresse END," +
            "    updated_at = now()," +
            "    updated_by = ? " +
            "WHERE" +
            "    id = ?",
            [client.name, client.name, client.contact, client.contact, client.adresse, client.adresse, client.updatedBy, client.id]
        );
    }

    async findAll() {
        return await db.dBase.query(
            "SELECT id, name, adresse, contact, created_at AS createdAt, created_by AS createdBy, updated_at As updatedAt, updated_by AS updatedBy, deleted_at As deletedAt, deleted_by AS deletedBy FROM clients WHERE deleted_at IS NULL ORDER BY id DESC"
        );
    }


    async delete(authUserId, clientId) {
        return await db.dBase.query(
            "UPDATE clients SET deleted_at = now(), deleted_by = ? WHERE id = ?", [authUserId, clientId]
        );
    }
}

module.exports = new ClientRepository();