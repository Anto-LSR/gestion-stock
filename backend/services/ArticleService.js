const { knex } = require("../db"); // Importation de l'instance knex

const addArticle = async (articleData) => {
  try {
    const tarif = {
      pu: articleData.prix,
      date: new Date()
    };
    delete articleData.prix;
    // Insérer l'article et récupérer son ID
    const [id] = await knex("articles").insert(articleData);
    console.log(articleData);

    // Construire le tarif avec l'ID généré
    tarif.id_article = id;

    // Insérer le tarif
    await knex("article_tarifs").insert(tarif);

    return id;
  } catch (err) {
    console.error("❌ Erreur lors de l'ajout de l'article :", err);
    throw err;
  }
};


const updateArticle = async (articleData) => {
  try {
    const { id, ...updateData } = articleData;
    const rowsUpdated = await knex("articles").where({ id }).update(updateData);
    if (rowsUpdated === 0) throw new Error(`Article avec ID ${id} non trouvé.`);
    return rowsUpdated;
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour de l'article :", error);
    throw error;
  }
};

const deleteArticle = async (id) => {
  try {
    await knex("articles").where("id", id).del();
    console.log(`Article avec ID ${id} supprimé.`);
  } catch (error) {
    console.error("❌ Erreur lors de la suppression de l'article :", error);
  }
};

const publishArticle = async (id) => {
  try {
    await knex("articles").where("id", id).update({ is_active: true });
    console.log(`Article avec ID ${id} publié.`);
  } catch (error) {
    console.error("❌ Erreur lors de la publication de l'article :", error);
  }
};

const unpublishArticle = async (id) => {
  try {
    await knex("articles").where("id", id).update({ is_active: false });
    console.log(`Article avec ID ${id} dépublié.`);
  } catch (error) {
    console.error("❌ Erreur lors de la dépublication de l'article :", error);
  }
};

const getArticles = async () => {
  try {
    return await knex("articles").select("*").where("is_active", true);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des articles :", err);
    throw err;
  }
};

const getArticle = async (id) => {
  try {
    return await knex("articles").select("*").where("id", id).first();
  } catch (err) {
    console.error("❌ Erreur lors de la récupération de l'article :", err);
    throw err;
  }
};

const getAllArticles = async () => {
  try {
    return await knex("articles").select("*");
  } catch (err) {
    console.error("❌ Erreur lors de la récupération de tous les articles :", err);
    throw err;
  }
};

// stock

const decrementStockReel = async (articleId, quantityToSubtract) => {
  try {
    const article = await knex("articles").where({ id: articleId }).first();

    if (!article) {
      throw new Error(`Article avec l'ID ${articleId} non trouvé.`);
    }

    if (article.stock_reel < quantityToSubtract) {
      throw new Error(
        `Stock insuffisant : stock actuel = ${article.stock_reel}, demandé = ${quantityToSubtract}`
      );
    }

    await knex("articles")
      .where({ id: articleId })
      .decrement("stock_reel", quantityToSubtract);

    console.log(`✅ Stock réel de l'article ${articleId} diminué de ${quantityToSubtract}.`);
  } catch (err) {
    console.error("❌ Erreur lors de la diminution du stock réel :", err.message);
    throw err;
  }
};


// Gestion Tarifs
const addTarif = async (tarifData) => {
  try {
    const [id] = await knex("article_tarifs").insert(tarifData);
    return id;
  } catch (err) {
    console.error("❌ Erreur lors de l'ajout du tarif :", err);
    throw err;
  }
};

const deleteTarif = async (id) => {
  try {
    await knex("article_tarifs").where("id", id).del();
    console.log(`Tarif avec ID ${id} supprimé.`);
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du tarif :", error);
  }
};

const getTarifsByArticle = async (id_article) => {
  try {
    return await knex("article_tarifs").select("*").where("id_article", id_article);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération des tarifs :", err);
    throw err;
  }
};

const getAllTarifs = async () => {
  try {
    return await knex("article_tarifs").select("*");
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des tarifs :", error);
  }
}

module.exports = {
  addArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  unpublishArticle,
  getArticles,
  getAllArticles,
  getArticle,
  decrementStockReel,
  //tarifs
  addTarif,
  deleteTarif,
  getAllTarifs,
  getTarifsByArticle
};
