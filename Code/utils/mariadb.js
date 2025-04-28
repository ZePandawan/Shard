const { host, user, password, database, connectionLimit } = require("../../Config/db.json");
const mariadb = require("mariadb");

// Configuration de la connexion à la base de données
const pool = mariadb.createPool({
    host: host,
    user: user,
    password: password,
    database: database,
    connectionLimit: connectionLimit
});

/**
 * Se connecter à la base de données.
 * @returns {Promise<import('mariadb').Connection>} La connexion à la base de données.
 * @throws {Error} Si la connexion échoue.
 */
async function connectToDatabase(){
    let conn;
    try{
        conn = await pool.getConnection();
        console.log('Connected to the database!');
        return conn;
    }catch(err){
        console.error('[DB ERROR] Error connecting to the databse:', err);
        throw err;
    }
}

/**
 * Se déconnecter de la base de données.
 * @param {import('mariadb').Connection} conn - La connexion à fermer.
 */
async function disconnectFromDatabase(conn){
    if(conn){
        await conn.end();
        console.log('Disconnected from the database!')
    }
}

/**
 * Créer une nouvelle ligne dans la table spécifiée.
 * @param {import('mariadb').Connection} conn - La connexion à la base de données.
 * @param {string} table - Le nom de la table.
 * @param {Object} data - Les données à insérer.
 * @returns {Promise<import('mariadb').QueryResult>} Le résultat de la requête.
 * @throws {Error} Si l'insertion échoue.
 */
async function createRow(conn, table, data){
    try{
        const keys = Object.keys(data).join(', ');
        const values = Object.values(data).map(value => `'${value}'`).join(', ');
        const query = `INSERT INTO ${table} (${keys}) VALUES (${values})`;
        const res = await conn.query(query);
        console.log("Row created: ", res);
        return res;
    } catch(err){
        console.error("[DB ERROR] Error creating row:", err);
        throw err;
    }
}

/**
 * Mettre à jour une ligne dans la table spécifiée.
 * @param {import('mariadb').Connection} conn - La connexion à la base de données.
 * @param {string} table - Le nom de la table.
 * @param {Object} data - Les données à mettre à jour.
 * @param {string} condition - La condition pour la mise à jour.
 * @returns {Promise<import('mariadb').QueryResult>} Le résultat de la requête.
 * @throws {Error} Si la mise à jour échoue.
 */
async function updateRow(conn, table, data, condition){
    try {
        const setClause = Object.keys(data).map(key => `${key} = '${data[key]}'`).join(', ');
        const query = `UPDATE ${table} SET ${setClause} WHERE ${condition}`;
        const res = await conn.query(query);
        console.log('Row updated:', res);
        return res;
    } catch (err) {
        console.error('[DB ERROR] Error updating row:', err);
        throw err;
    }
}

/**
 * Supprimer une ligne dans la table spécifiée.
 * @param {import('mariadb').Connection} conn - La connexion à la base de données.
 * @param {string} table - Le nom de la table.
 * @param {string} condition - La condition pour la suppression.
 * @returns {Promise<import('mariadb').QueryResult>} Le résultat de la requête.
 * @throws {Error} Si la suppression échoue.
 */
async function deleteRow(conn, table, condition){
    try {
        const query = `DELETE FROM ${table} WHERE ${condition}`;
        const res = await conn.query(query);
        console.log("Row deleted:", res);
        return res;
    } catch (err) {
        console.error('[DB ERROR] Error deleting row:', err);
        throw err;
    }
}

/**
 * Créer une nouvelle table dans la base de données.
 * @param {import('mariadb').Connection} conn - La connexion à la base de données.
 * @param {string} tableName - Le nom de la table.
 * @param {Object} columns - Les colonnes de la table avec leurs types.
 * @returns {Promise<import('mariadb').QueryResult>} Le résultat de la requête.
 * @throws {Error} Si la création de la table échoue.
 */
async function createTable(conn, tableName, columns) {
    try {
        const columnDefinitions = Object.entries(columns)
            .map(([name, type]) => `${name} ${type}`)
            .join(', ');
        const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnDefinitions})`;
        const res = await conn.query(query);
        console.log('Table created:', res);
        return res;
    } catch (err) {
        console.error('[DB ERROR] Error creating table:', err);
        throw err;
    }
}

module.exports = {
    connectToDatabase,
    disconnectFromDatabase,
    createRow,
    updateRow,
    deleteRow,
    createTable
};