const { ipcMain } = require("electron");
const {
    getAllCommandesWithLignes,
    createCommandeWithLignes,
    updateCommandeWithLignes,
    getCommandeWithLignes,
    createCommande,
    updateCommande,
    getCommande,
    getAllCommandes,
    addCommandeLigne,
    getCommandeLignes,
    updateCommandeLigne,
    deleteCommandeLigne,
    getCommandesWithLignesByArticleId
} = require("../../../backend/services/CommandeService");

const initializeCommandeHandlers = () => {


    ipcMain.handle("get-all-commandes-with-lignes", async () => {
        try {
            return await getAllCommandesWithLignes()
        } catch (error) {
            console.error("❌ Erreur get-all-commande-with-lignes :", error);
            throw error;
        }
    })

    ipcMain.handle("get-commande-with-lignes", async (event, id) => {
        try {
            return await getCommandeWithLignes(id);
        } catch (error) {
            console.error("❌ Erreur get-commande-with-lignes :", error);
            throw error;
        }
    });
    
    ipcMain.handle("get-commande-with-lignes-by-article-id", async (event, id) => {
        try {
            return await getCommandesWithLignesByArticleId(id);
        } catch (error) {
            console.error("❌ Erreur get-commande-with-lignes :", error);
            throw error;
        }
    });

    ipcMain.handle("create-commande-with-lignes", async (event, { commande, lignes }) => {
        try {
            const id = await createCommandeWithLignes(commande, lignes);
            return { id };
        } catch (error) {
            console.error("❌ Erreur create-commande-with-lignes :", error);
            throw error;
        }
    });

    ipcMain.handle("update-commande-with-lignes", async (event, { id, commande, lignes }) => {
        try {
            await updateCommandeWithLignes(id, commande, lignes);
            return { success: true };
        } catch (error) {
            console.error("❌ Erreur update-commande-with-lignes :", error);
            throw error;
        }
    });

    // Créer une commande
    ipcMain.handle("create-commande", async (event, commande) => {
        try {
            const id = await createCommande(commande);
            return { success: true, id };
        } catch (error) {
            console.error("Erreur lors de la création de la commande :", error);
            return { success: false, error };
        }
    });

    // Mettre à jour une commande
    ipcMain.handle("update-commande", async (event, commande) => {
        try {
            await updateCommande(commande);
            return { success: true };
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la commande :", error);
            return { success: false, error };
        }
    });

    // Récupérer une commande par ID
    ipcMain.handle("get-commande", async (event, id) => {
        try {
            const commande = await getCommande(id);
            return commande;
        } catch (error) {
            console.error("Erreur lors de la récupération de la commande :", error);
            return { success: false, error };
        }
    });

    // Récupérer toutes les commandes
    ipcMain.handle("get-all-commandes", async () => {
        try {
            return await getAllCommandes();
        } catch (error) {
            console.error("Erreur lors de la récupération des commandes :", error);
            return { success: false, error };
        }
    });

    // Ajouter une ligne à une commande
    ipcMain.handle("add-commande-ligne", async (event, ligne) => {
        try {
            const id = await addCommandeLigne(ligne);
            return { success: true, id };
        } catch (error) {
            console.error("Erreur lors de l'ajout d'une ligne de commande :", error);
            return { success: false, error };
        }
    });

    // Récupérer les lignes d'une commande
    ipcMain.handle("get-commande-lignes", async (event, commandeId) => {
        try {
            return await getCommandeLignes(commandeId);
        } catch (error) {
            console.error("Erreur lors de la récupération des lignes de commande :", error);
            return { success: false, error };
        }
    });

    // Mettre à jour une ligne de commande
    ipcMain.handle("update-commande-ligne", async (event, ligne) => {
        try {
            await updateCommandeLigne(ligne);
            return { success: true };
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la ligne de commande :", error);
            return { success: false, error };
        }
    });

    // Supprimer une ligne de commande
    ipcMain.handle("delete-commande-ligne", async (event, id) => {
        try {
            await deleteCommandeLigne(id);
            return { success: true };
        } catch (error) {
            console.error("Erreur lors de la suppression de la ligne de commande :", error);
            return { success: false, error };
        }
    });
};

module.exports = { initializeCommandeHandlers };
