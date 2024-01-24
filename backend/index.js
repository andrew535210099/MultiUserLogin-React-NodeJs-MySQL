import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
dotenv.config();

const PORT = process.env.APP_PORT || 4000;

const app = express();

// Untuk generate tabelnya kalau masih kosong
const generateTables = async () => {
  await db.sync();
};

generateTables();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("Reached / route");
  res.send("Hello, World!");
});

app.use(UserRoute);
app.use(ProductRoute);

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
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

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
