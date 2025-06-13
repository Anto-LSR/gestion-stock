const { app, BrowserWindow, ipcMain, screen } = require("electron");
const path = require("path");
const { knex } = require("../../backend/db");
const { initializeClientHandlers } = require("./handlers/ClientHandlers");
const { initializeArticleHandlers } = require("./handlers/ArticleHandlers");
const { initializeCommandeHandlers } = require("./handlers/CommandeHandlers");

let mainWindow;

app.whenReady().then(() => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    icon: path.join(__dirname, 'assets', 'gooseIco.icns'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (process.env.ELECTRON_START_URL) {
    // En dev : on charge l'URL localhost
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    // En prod : on charge le fichier local avec loadFile
    mainWindow.loadFile(path.join(__dirname, "../../frontend/build/index.html"));
  }

  mainWindow.on("closed", () => (mainWindow = null));
});

// Initialiser les handlers
initializeClientHandlers();
initializeArticleHandlers();
initializeCommandeHandlers();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
