const path = require("path");
const fs = require("fs");
const { app } = require("electron");
const knexLib = require("knex");

let databasePath;

if (process.env.NODE_ENV === "development") {
  // En dev, base dans backend/database.sqlite
  databasePath = path.join(__dirname, "database.sqlite");
} else {
  // En prod : on copie la base dans userData/data
  const userDataPath = app.getPath("userData");
  const dbDir = path.join(userDataPath, "data");

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  databasePath = path.join(dbDir, "database.sqlite");

  // Copier la base par défaut si besoin
  const defaultDb = path.join(__dirname, "database.sqlite");
  if (!fs.existsSync(databasePath)) {
    fs.copyFileSync(defaultDb, databasePath);
  }
}

console.log("Base SQLite utilisée :", databasePath);

const knex = knexLib({
  client: "sqlite3",
  connection: {
    filename: databasePath,
  },
  useNullAsDefault: true,
});

module.exports = { knex };
