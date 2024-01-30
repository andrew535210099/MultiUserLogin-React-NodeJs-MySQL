import { Sequelize } from "sequelize";

const db = new Sequelize("db_auth", "root", "", {
  host: "localhost",  
  dialect: "mysql",
});

db.authenticate()
  .then(() => {
    console.log("Koneksi berhasil");
  })
  .catch(() => {
    console.log("Gagal terkoneksi");
  });

export default db;
