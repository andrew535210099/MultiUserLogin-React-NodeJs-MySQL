import { Sequelize } from "sequelize";

const db = new Sequelize("auth_db", "root", "", {
  host: "localhost",
  port: 3300,
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
