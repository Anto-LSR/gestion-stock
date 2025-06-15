const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  // Clients
  addClient: (client) => ipcRenderer.invoke("add-client", client),
  getClients: () => ipcRenderer.invoke("get-clients"),
  deleteClient: (id) => ipcRenderer.invoke("delete-client", id),
  deactivateClient: (id) => ipcRenderer.invoke("deactivate-client", id),
  activateClient: (id) => ipcRenderer.invoke("activate-client", id),
  getAllClients: (getCanceledClients) => ipcRenderer.invoke("get-all-clients", getCanceledClients),
  getClient: (id) => ipcRenderer.invoke("get-client", id),
  updateClient: (client) => ipcRenderer.invoke("update-client", client),

  // Articles
  addArticle: (article) => ipcRenderer.invoke("add-article", article),
  getArticles: () => ipcRenderer.invoke("get-articles"),
  deleteArticle: (id) => ipcRenderer.invoke("delete-article", id),
  unpublishArticle: (id) => ipcRenderer.invoke("unpublish-article", id),
  publishArticle: (id) => ipcRenderer.invoke("publish-article", id),
  getAllArticles: () => ipcRenderer.invoke("get-all-articles"),
  getArticle: (id) => ipcRenderer.invoke("get-article", id),
  updateArticle: (article) => ipcRenderer.invoke("update-article", article),

  // Tarifs
  getTarifsByArticle: (id) => ipcRenderer.invoke("get-tarifs-by-article", id),
  getAllTarifs: () => ipcRenderer.invoke(("get-all-tarifs")),
  addTarif: (tarif) => ipcRenderer.invoke("add-tarif", tarif),
  deleteTarif: (tarif) => ipcRenderer.invoke("delete-tarif", tarif),


  // Stock
  decrementStockReel: (article, qt) => ipcRenderer.invoke("decrement-stock-reel", article, qt),

  // Commandes
  getCommandeWithLignes: (id) => ipcRenderer.invoke("get-commande-with-lignes", id),
  createCommandeWithLignes: (commande, lignes) => ipcRenderer.invoke("create-commande-with-lignes", commande, lignes),
  updateCommandeWithLignes: (commande, lignes) => ipcRenderer.invoke("update-commande-with-lignes", commande, lignes),
  createCommande: (commande) => ipcRenderer.invoke("create-commande", commande),
  getCommande: (id) => ipcRenderer.invoke("get-commande", id),
  updateCommande: (commande) => ipcRenderer.invoke("update-commande", commande),
  getAllCommandes: () => ipcRenderer.invoke("get-all-commandes"),

  // Lignes de commande
  addCommandeLigne: (ligne) => ipcRenderer.invoke("add-commande-ligne", ligne),
  getCommandeLignes: (commandeId) => ipcRenderer.invoke("get-commande-lignes", commandeId),
  updateCommandeLigne: (ligne) => ipcRenderer.invoke("update-commande-ligne", ligne),
  deleteCommandeLigne: (id) => ipcRenderer.invoke("delete-commande-ligne", id),
  getAllCommandesWithLignes: () => ipcRenderer.invoke("get-all-commandes-with-lignes"),

  // Receptions
  createReceptionWithLignes: (reception, lignes) => ipcRenderer.invoke("create-reception-with-lignes", reception, lignes),
  getReceptionWithLignes: (id) => ipcRenderer.invoke("get-reception-with-lignes", id),
  getAllReceptionsWithLignes: () => ipcRenderer.invoke("get-all-receptions-with-lignes")
});
