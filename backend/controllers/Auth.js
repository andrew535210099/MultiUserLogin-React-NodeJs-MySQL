// Membuat fungsi login dan signup
import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const login = async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    return res.status(404).json({ msg: "User tidak ditemukan" });
  }
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) {
    return res.status(400).json({ msg: "Wrong Password" });
  }
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const email = user.email;
  const role = user.role;
  res.status(200).json({ uuid, name, email, role });
};

export const Me = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Mohon login ke akun anda" });
    }

    const user = await Users.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.session.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Send the user data as a response
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const logOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).json({ msg: "Tidak dapat LogOut" });
    }
    res.status(200).json({ msg: "Anda telah logout" });
  });
};
