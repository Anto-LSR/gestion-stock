const { ipcMain } = require("electron");
const { addClient, updateClient, getClients, getAllClients, deleteClient, deactivateClient, activateClient, getClient } = require("../../../backend/services/ClientService");

// Fonction pour initialiser les handlers de clients
const initializeClientHandlers = () => {
  // Gérer l'ajout d'un client
  ipcMain.handle("add-client", async (event, client) => {
    try {
      const id = await addClient(client);
      return { success: true, id };
    } catch (error) {
      return { success: false, error };
    }
  });
  ipcMain.handle("update-client", async (event, client) => {
    try {
      await updateClient(client);
      return { success: true, id };
    } catch (error) {
      return { success: false, error };
    }
  });

  // Gérer la récupération des clients
  ipcMain.handle("get-clients", async () => {
    try {
      return await getClients();
    } catch (error) {
      return { success: false, error };
    }
  });

  ipcMain.handle("get-all-clients", async (event, getCanceledClients) => {
    try {
      return await getAllClients(getCanceledClients);
    } catch (error) {
      return { success: false, error };
    }
  });

  // Gérer la suppression d'un client
  ipcMain.handle("delete-client", async (event, id) => {
    try {
      await deleteClient(id);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  });

  ipcMain.handle("deactivate-client", async (event, id) => {
    try {
      await deactivateClient(id);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  })
  ipcMain.handle("activate-client", async (event, id) => {
    try {
      await activateClient(id);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  })

  ipcMain.handle("get-client", async (event, id) => {
    try {
      return await getClient(id);
    } catch (error) {
      return { success: false, error }
    }
  })

};


module.exports = { initializeClientHandlers };
