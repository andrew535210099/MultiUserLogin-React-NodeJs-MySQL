import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/database.js";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
dotenv.config();

const app = express();

async () => {
  await db.sync();
};

app.use(
  session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookies: {
      secure: "auto",
      // kalau https true kalau http false
    },
  })
);
// Middleware
app.use(
  cors({
    // supaya bisa bertukar data seperti cookies
    credentials: true,
    // domain untuk mengizinkan akses API kita bisa berupa array
    origin: "http://localhost:3000",
  })
);

// supaya bisa menerima dalam format json
app.use(express.json());

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running...");
});
