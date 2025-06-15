const { knex } = require("../db");

const createCommandeWithLignes = async (commande, lignes) => {
  try {
    return await knex.transaction(async (trx) => {
      // Vérifie stock dispo et prépare maj
      for (const ligne of lignes) {
        const article = await trx("articles")
          .where({ id: ligne.article_id })
          .first();
        const stockDispo = article.stock_reel - article.stock_reserve;
        if (stockDispo < ligne.qt) {
          throw new Error(
            `Stock insuffisant pour l'article ${
              article.designation || ligne.article_id
            }`
          );
        }

        await trx("articles")
          .where({ id: ligne.article_id })
          .update({ stock_reserve: article.stock_reserve + ligne.qt });
      }

      const [id] = await trx("commandes").insert(commande);
      const lignesToInsert = lignes.map((ligne) => ({
        commande_id: id,
        article_id: ligne.article_id,
        qt: ligne.qt,
        prix_unitaire: ligne.prix_unitaire,
      }));
      await trx("commande_lignes").insert(lignesToInsert);
      return id;
    });
  } catch (err) {
    console.error(
      "❌ Erreur lors de la création de la commande avec lignes :",
      err
    );
    throw err;
  }
};

const updateCommandeWithLignes = async (id, commande, lignes) => {
  try {
    return await knex.transaction(async (trx) => {
      // 1. Récupérer les anciennes lignes
      const anciennesLignes = await trx("commande_lignes").where({
        commande_id: id,
      });

      // 2. Réduire stock_reserve selon anciennes lignes
      for (const ligne of anciennesLignes) {
        const article = await trx("articles")
          .where({ id: ligne.article_id })
          .first();
        await trx("articles")
          .where({ id: ligne.article_id })
          .update({ stock_reserve: article.stock_reserve - ligne.qt });
      }

      // 3. Vérifier le stock dispo pour les nouvelles lignes
      for (const ligne of lignes) {
        const article = await trx("articles")
          .where({ id: ligne.article_id })
          .first();
        const stockDispo = article.stock_reel - article.stock_reserve;
        if (stockDispo < ligne.qt) {
          throw new Error(
            `Stock insuffisant pour l'article ${
              article.designation || ligne.article_id
            }`
          );
        }

        // 4. Réaugmenter le stock_reserve
        await trx("articles")
          .where({ id: ligne.article_id })
          .update({ stock_reserve: article.stock_reserve + ligne.qt });
      }

      // 5. Mettre à jour commande + lignes
      await trx("commandes").where({ id }).update(commande);
      await trx("commande_lignes").where({ commande_id: id }).del();

      const lignesToInsert = lignes.map((ligne) => ({
        commande_id: id,
        article_id: ligne.article_id,
        qt: ligne.qt,
        prix_unitaire: ligne.prix_unitaire,
      }));

      await trx("commande_lignes").insert(lignesToInsert);
    });
  } catch (err) {
    console.error(
      "❌ Erreur lors de la mise à jour de la commande avec lignes :",
      err
    );
    throw err;
  }
};

// ➕ Créer une commande
const createCommande = async (commandeData) => {
  try {
    const [id] = await knex("commandes").insert(commandeData);
    return id;
  } catch (err) {
    console.error("❌ Erreur lors de la création de la commande :", err);
    throw err;
  }
};

// 🔁 Mettre à jour une commande
const updateCommande = async (commandeData) => {
  const trx = await knex.transaction();
  try {
    const { id, livree, ...updateData } = commandeData;

    // 1. Récupérer la commande actuelle
    const currentCommande = await trx("commandes").where({ id }).first();
    if (!currentCommande)
      throw new Error(`Commande avec ID ${id} non trouvée.`);

    // 2. Si livree a changé, mettre à jour les stocks
    if (livree !== undefined && livree !== currentCommande.livree) {
      const lignes = await trx("commande_lignes").where({ commande_id: id });

      for (const ligne of lignes) {
        const qte = ligne.qt;
        const articleId = ligne.article_id;

        if (livree) {
          // Livraison confirmée : décrémenter stock_reel, décrémenter stock_reserve
          await trx("articles")
            .where({ id: articleId })
            .decrement("stock_reel", qte)
            .decrement("stock_reserve", qte);
        } else {
          // Livraison annulée : réincrémenter stock_reel, réincrémenter stock_reserve
          await trx("articles")
            .where({ id: articleId })
            .increment("stock_reel", qte)
            .increment("stock_reserve", qte);
        }
      }
    }

    // 3. Mise à jour de la commande
    await trx("commandes")
      .where({ id })
      .update({ ...updateData, livree });

    await trx.commit();
    return true;
  } catch (error) {
    await trx.rollback();
    console.error("❌ Erreur lors de la mise à jour de la commande :", error);
    throw error;
  }
};

// 📄 Récupérer une commande
const getCommande = async (id) => {
  try {
    return await knex("commandes").where({ id }).first();
  } catch (error) {
    console.error("❌ Erreur lors de la récupération de la commande :", error);
    throw error;
  }
};

// 📑 Récupérer toutes les commandes
const getAllCommandes = async () => {
  try {
    return await knex("commandes").select("*");
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération de toutes les commandes :",
      error
    );
    throw error;
  }
};

// ➕ Ajouter une ligne à une commande
const addCommandeLigne = async (ligneData) => {
  try {
    const [id] = await knex("commande_lignes").insert(ligneData);
    return id;
  } catch (error) {
    console.error("❌ Erreur lors de l'ajout d'une ligne de commande :", error);
    throw error;
  }
};

// 📄 Récupérer les lignes d'une commande
const getCommandeLignes = async (commandeId) => {
  try {
    return await knex("commande_lignes")
      .where({ commande_id: commandeId })
      .select("*");
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération des lignes de commande :",
      error
    );
    throw error;
  }
};

// ✏️ Mettre à jour une ligne de commande
const updateCommandeLigne = async (ligneData) => {
  try {
    const { id, ...updateData } = ligneData;
    const rowsUpdated = await knex("commande_lignes")
      .where({ id })
      .update(updateData);
    if (rowsUpdated === 0)
      throw new Error(`Ligne de commande avec ID ${id} non trouvée.`);
    return rowsUpdated;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la mise à jour de la ligne de commande :",
      error
    );
    throw error;
  }
};

// ❌ Supprimer une ligne de commande
const deleteCommandeLigne = async (id) => {
  try {
    await knex("commande_lignes").where({ id }).del();
    console.log(`Ligne de commande avec ID ${id} supprimée.`);
  } catch (error) {
    console.error(
      "❌ Erreur lors de la suppression de la ligne de commande :",
      error
    );
    throw error;
  }
};

const getCommandeWithLignes = async (id) => {
  try {
    const commande = await knex("commandes").where({ id }).first();
    if (!commande) throw new Error("Commande introuvable");

    const lignes = await knex("commande_lignes").where({ commande_id: id });

    return { commande, lignes };
  } catch (err) {
    console.error("❌ Erreur lors du chargement de la commande :", err);
    throw err;
  }
};

const getCommandesWithLignesByArticleId = async (id) => {
  try { 
    // Récupérer toutes les lignes contenant cet article
    const lignes = await knex("commande_lignes").select("*").where({
      article_id: id,
    });

    if (lignes.length === 0) return [];

    // Récupérer les IDs uniques des commandes associées
    const commandeIds = [...new Set(lignes.map((ligne) => ligne.commande_id))];

    // Récupérer les commandes correspondantes
    const commandes = await knex("commandes").whereIn("id", commandeIds);

    // Regrouper les lignes par commande_id
    const lignesParCommande = {};
    lignes.forEach((ligne) => {
      if (!lignesParCommande[ligne.commande_id]) {
        lignesParCommande[ligne.commande_id] = [];
      }
      lignesParCommande[ligne.commande_id].push(ligne);
    });

    // Combiner commandes et leurs lignes
    const result = commandes.map((commande) => ({
      commande,
      lignes: lignesParCommande[commande.id] || [],
    }));

    return result;
  } catch (err) {
    console.error(
      "❌ Erreur lors du chargement des commandes par article :",
      err
    );
    throw err;
  }
};

const getAllCommandesWithLignes = async () => {
  try {
    // Récupère toutes les commandes
    const commandes = await knex("commandes").select("*");

    // Récupère toutes les lignes associées
    const lignes = await knex("commande_lignes").select("*");

    // Regroupe les lignes par commande_id
    const lignesParCommande = lignes.reduce((acc, ligne) => {
      if (!acc[ligne.commande_id]) acc[ligne.commande_id] = [];
      acc[ligne.commande_id].push(ligne);
      return acc;
    }, {});

    // Associe les lignes et calcule le total pour chaque commande
    const commandesAvecLignesEtTotal = commandes.map((commande) => {
      const lignes = lignesParCommande[commande.id] || [];
      const total = lignes.reduce((sum, l) => sum + l.qt * l.prix_unitaire, 0);
      return {
        ...commande,
        lignes,
        total,
      };
    });

    return commandesAvecLignesEtTotal;
  } catch (error) {
    console.error(
      "❌ Erreur lors de la récupération de toutes les commandes avec lignes :",
      error
    );
    throw error;
  }
};

module.exports = {
  getCommandeWithLignes,
  createCommandeWithLignes,
  updateCommandeWithLignes,
  createCommande,
  updateCommande,
  getCommande,
  getAllCommandes,
  addCommandeLigne,
  getCommandeLignes,
  updateCommandeLigne,
  deleteCommandeLigne,
  getAllCommandesWithLignes,
  getCommandesWithLignesByArticleId,
};
