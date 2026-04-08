const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

openDb = async () => {
  try {
    const db = await open({
    filename: "./src/database/cuidadoIntegral.db",
    driver: sqlite3.Database
    })
    await db.exec("PRAGMA foreign_keys = ON;");
    // o codigo da linha 11 faz com que o sqlite ative minhas FOREIGN KEY
    await db.exec("PRAGMA foreign_keys = ON;");
    return db
    
  } catch (error) {
    console.log(`Não foi possivel cria banco ${error}`)
  };
  
}

module.exports = {openDb}
