const { ipcMain } = require("electron");
const {
    createReceptionWithLignes,
    getReceptionWithLignes,
    getAllReceptionsWithLignes
} = require("../../../backend/services/ReceptionService");

const initializeReceptionHandlers = () => {

    ipcMain.handle("create-reception-with-lignes", async (event, { reception, lignes }) => {
        try {
            return await createReceptionWithLignes(reception, lignes);
        } catch (error) {
            console.error("❌ Erreur createReceptionWithLignes :", error);
            throw error;
        }
    });

    ipcMain.handle("get-reception-with-lignes", async (event, receptionId) => {
        try {
            return await getReceptionWithLignes(receptionId);
        } catch (error) {
            console.error("❌ Erreur getReceptionWithLignes :", error);
            throw error;
        }
    });

    ipcMain.handle("get-all-receptions-with-lignes", async () => {
        try {
            return await getAllReceptionsWithLignes();
        } catch (error) {
            console.error("❌ Erreur getAllReceptionsWithLignes :", error);
            throw error;
        }
    });

};

module.exports = { initializeReceptionHandlers };
