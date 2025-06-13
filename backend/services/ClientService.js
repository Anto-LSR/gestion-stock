const { knex } = require("../db"); // Importation de l'instance knex

const addClient = async (clientData) => {
  try {
    console.log(clientData);
    
    const [id] = await knex("clients").insert(clientData);
    return id;
  } catch (err) {
    console.error("❌ Erreur lors de l'ajout du client :", err);
    throw err;
  }
};

const updateClient = async (clientData) => {
  try {
    const { id, ...updateData } = clientData;
    const rowsUpdated = await knex("clients").where({ id }).update(updateData);
    if (rowsUpdated === 0) throw new Error(`Client avec ID ${id} non trouvé.`);
    return rowsUpdated;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du client :", error);
    throw error;
  }
};

const deleteClient = async (id) => {
  try {
    await knex("clients").where("id", id).del();
    console.log(`Client avec ID ${id} supprimé.`);
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du client :", error);
  }
};

const deactivateClient = async (id) => {
  try {
    await knex("clients").where("id", id).update({ is_active: false });
    console.log(`Client avec ID ${id} désactivé.`);
  } catch (error) {
    console.error("❌ Erreur lors de la désactivation du client :", error);
  }
};

const activateClient = async (id) => {
  try {
    await knex("clients").where("id", id).update({ is_active: true });
    console.log(`Client avec ID ${id} activé.`);
  } catch (error) {
    console.error("❌ Erreur lors de l'activation du client :", error);
  }
};

const getClients = async () => {
  try {
    return await knex("clients").select("*").where("is_active", true);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des clients :", err);
    throw err;
  }
};

const getClient = async (id) => {
  try {
    return await knex("clients").select("*").where("id", id).first();
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du client :", err);
    throw err;
  }
};

const getAllClients = async (getCanceledClients) => {
  try {
    const query = knex("clients").select("*");
    if (!getCanceledClients) {
      query.where("is_active", true);
    }
    return await query;
  } catch (err) {
    console.error("❌ Erreur lors de la récupération de tous les clients :", err);
    throw err;
  }
};


module.exports = {
  addClient,
  updateClient,
  deleteClient,
  deactivateClient,
  activateClient,
  getClients,
  getAllClients,
  getClient,
};
