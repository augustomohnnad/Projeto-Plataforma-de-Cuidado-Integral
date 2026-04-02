const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

openDb = async () => {
  try {
    const db = await open({
    filename: "./src/database/cuidadoIntegral.db",
    driver: sqlite3.Database
    })
    
    return db
    
  } catch (error) {
    console.log(`Não foi possivel cria banco ${error}`)
  };
  
}

module.exports = {openDb}
