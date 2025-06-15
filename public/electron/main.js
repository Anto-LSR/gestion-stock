const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const { knex } = require("../../backend/db");
const { initializeClientHandlers } = require("./handlers/ClientHandlers");
const { initializeArticleHandlers } = require("./handlers/ArticleHandlers");
const { initializeCommandeHandlers } = require("./handlers/CommandeHandlers");
const { initializeReceptionHandlers } = require("./handlers/ReceptionHandlers");

let mainWindow;

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, 'assets', 'logovin.png'));
  }
  mainWindow = new BrowserWindow({
    width,
    height,
    title: "Gestion Vin",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.setTitle("Mon super app");


  if (process.env.ELECTRON_START_URL) {
    // En dev : on charge l'URL localhost
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    // En prod : on charge le fichier local avec loadFile
    mainWindow.loadFile(path.join(__dirname, "../../frontend/build/index.html"));
  }

  mainWindow.on("closed", () => (mainWindow = null));
});
console.log('Icon path:', path.join(__dirname, 'assets', 'logovin.icns'));



// Initialiser les handlers
initializeClientHandlers();
initializeArticleHandlers();
initializeCommandeHandlers();
initializeReceptionHandlers();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
