import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
dotenv.config();

const PORT = process.env.APP_PORT || 4000;

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

// Untuk generate tabelnya kalau masih kosong
const generateTables = async () => {
  await db.sync();
};

generateTables();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
      // kalau https true kalau http false
    },
  })
);

app.use(
  cors({
    // supaya bisa bertukar data seperti cookies
    credentials: true,
    // domain untuk mengizinkan akses API kita bisa berupa array
    origin: "http://localhost:3000",
  })
);

app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);

// store.sync();

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
