const mysql = require(`mysql`);

class DBConnection {  
  static connect() {
    const db = mysql.createPool({
      host: `localhost`,
      user: `root`,
      password: ``,
      database: `unifood`,
      charset: `utf8mb4`,
    });
    return db;
  }
}

module.exports = { DBConnection };
