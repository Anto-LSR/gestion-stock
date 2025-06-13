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

  const startUrl =
    process.env.ELECTRON_START_URL ||
    `file://${path.join(__dirname, "frontend/build/index.html")}`;

  mainWindow.loadURL(startUrl);

  mainWindow.on("closed", () => (mainWindow = null));
});

// Initialiser les handlers
initializeClientHandlers()
initializeArticleHandlers()
initializeCommandeHandlers();

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
