const db = require("../configs/db/dataBase");

class ReglementRepository {
  async delete(reglementId) {
    return await db.dBase.query("DELETE FROM reglements WHERE id = ?", [
      reglementId,
    ]);
  }

  async findById(id) {
    return (
      await db.dBase.query(
        `SELECT r.id,
        r.totalFacture as totalFacture
        FROM reglements r    
        WHERE r.id = ?
        AND r.deleted_at IS NULL
        GROUP BY r.id`,
        [id]
      )
    )[0];
  }

  async findAll() {
    return await db.dBase.query(
      `
                SELECT r.id, r.created_at AS createdAt, u.firstname, u.lastname, f.code as codeFacture, c.name as client, r.totalFacture as totalFacture 
                FROM reglements r 
                inner join factures f ON r.facture_id = f.id 
                inner join users u on r.created_by = u.id 
                inner join clients c on f.client_id = c.id 
                where r.deleted_at is null 
                and r.deleted_by is null 
                ORDER BY r.id DESC LIMIT 500
            `
    );
  }

  async countFindAllReglement() {
    return (
      await db.dBase.query(`
        SELECT CAST(count(sous_requete.id) AS VARCHAR(255)) AS reglementTotalNumber 
        FROM (
            SELECT r.id, r.created_at AS createdAt, u.firstname, u.lastname, f.code as codeFacture, c.name as client, r.totalFacture as totalFacture 
            FROM reglements r 
            inner join factures f ON r.facture_id = f.id 
            inner join users u on r.created_by = u.id 
            inner join clients c on f.client_id = c.id 
            where r.deleted_at is null 
            and r.deleted_by is null 
        ) as sous_requete
        `)
    )[0];
  }

  async countFindAllReglementMonth() {
    return (
      await db.dBase.query(`
        SELECT CAST(SUM(totalFacture)AS VARCHAR(255)) AS reglementMonthTotalNumber 
        FROM reglements
        WHERE YEAR(reglements.created_at) = YEAR(CURDATE())
        AND MONTH(reglements.created_at) = MONTH(CURDATE());
        `)
    )[0];
  }

  async countFindAllReglementDay() {
    return (
      await db.dBase.query(`
        SELECT CAST(SUM(totalFacture)AS VARCHAR(255)) AS reglementDayTotalNumber 
        FROM reglements
        WHERE YEAR(reglements.created_at) = YEAR(CURDATE())
        AND day (reglements.created_at) = day(CURDATE());
        `)
    )[0];
  }
}

module.exports = new ReglementRepository();
