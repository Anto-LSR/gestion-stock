const { ipcMain } = require("electron");
const {
  addArticle,
  updateArticle,
  getArticles,
  getAllArticles,
  deleteArticle,
  publishArticle,
  unpublishArticle,
  getArticle,
  decrementStockReel,
  getAllTarifs,
  getTarifsByArticle,
  addTarif,
  deleteTarif,
} = require("../../../backend/services/ArticleService");

const initializeArticleHandlers = () => {
  // Gérer l'ajout d'un article
  ipcMain.handle("add-article", async (event, article) => {
    try {
      article.is_active = true;
      const id = await addArticle(article);
      return { success: true, id };
    } catch (error) {
      return { success: false, error };
    }
  });

  // Gérer la mise à jour d'un article
  ipcMain.handle("update-article", async (event, article) => {
    try {
      await updateArticle(article);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  });

  // Gérer la récupération des articles publiés
  ipcMain.handle("get-articles", async () => {
    try {
      return await getArticles();
    } catch (error) {
      return { success: false, error };
    }
  });

  // Gérer la récupération de tous les articles
  ipcMain.handle("get-all-articles", async () => {
    try {
      return await getAllArticles();
    } catch (error) {
      return { success: false, error };
    }
  });

  // Gérer la suppression d'un article
  ipcMain.handle("delete-article", async (event, id) => {
    try {
      await deleteArticle(id);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  });

  // Gérer la publication d'un article
  ipcMain.handle("publish-article", async (event, id) => {
    try {
      await publishArticle(id);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  });

  // Gérer la dépublication d'un article
  ipcMain.handle("unpublish-article", async (event, id) => {
    try {
      await unpublishArticle(id);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  });

  // Gérer la récupération d'un article par ID
  ipcMain.handle("get-article", async (event, id) => {
    try {
      return await getArticle(id);
    } catch (error) {
      return { success: false, error };
    }
  });

  // Stock

  ipcMain.handle("decrement-stock-reel", async (event, id, qt) => {
    try {
      await decrementStockReel(id, qt);
    } catch (error) {
      return { success: false, error };
    }
  });
};

// Tarif
ipcMain.handle("get-tarifs-by-article", async (event, id) => {
  try {
    return await getTarifsByArticle(id);
  } catch (error) {
    return { success: false, error };
  }
});

ipcMain.handle("get-all-tarifs", async (event) => {
  try {
    return await getAllTarifs();
  } catch (error) {
    return { success: false, error };
  }
});

ipcMain.handle("add-tarif", async (event, tarif) => {
  try {
    await addTarif(tarif);
  } catch (error) {
    return { success: false, error };
  }
});

ipcMain.handle("delete-tarif", async (event, tarif) => {
  try {
    await deleteTarif(tarif);
  } catch (error) {
    return { success: false, error };
  }
});

module.exports = { initializeArticleHandlers };
