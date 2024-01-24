import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);
    const response = await Users.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: "error get users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword) {
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  }
  const hashPassword = await argon2.hash(password);
  try {
    await Users.create({
      name: name,
      email: email,
      password: password,
      role: role,
    });
    res.status(201).json({ msg: "Register berhasil" });
  } catch (error) {
    return res.status(400).json({ msg: "Error nih" });
  }
};

export const updateUser = (req, res) => {};

export const deleteUser = (req, res) => {};
