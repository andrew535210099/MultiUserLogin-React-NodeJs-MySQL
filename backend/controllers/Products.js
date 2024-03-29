import Products from "../models/ProductModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

// Admin bisa liat product, tapi user hanya bisa liat product yang di create sendiri

export const getProducts = async (req, res) => {
  try {
    let response;
    // dapet request dari middleware
    if (req.role == "admin") {
      response = await Products.findAll({
        attributes: ["uuid", "name", "price"],
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Products.findAll({
        attributes: ["uuid", "name", "price"],
        // hanya bisa melihat yang dia input sendiri
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: Users,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id, // Menggunakan uuid dari params untuk mencari produk
        userId: req.userId, // Hanya mencari produk yang dimiliki oleh pengguna saat ini
      },
      include: [
        {
          model: Users,
          attributes: ["name", "email"],
        },
      ],
    });
    if (!product) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }
    res.status(200).json(product); // Mengembalikan produk yang ditemukan
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price } = req.body;
  try {
    await Products.create({
      name: name,
      price: price,
      // dapet userId dari middleware
      userId: req.userId,
    });
    res.status(201).json({ msg: "Product created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Failed to created product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }
    const { name, price } = req.body;
    // dapet request dari middleware
    if (req.role == "admin") {
      await Products.update(
        { name, price },
        {
          where: {
            id: product.id,
          },
        }
      );
    } else {
      if (req.userId !== product.userId) {
        return res.status(403).json({ msg: "Akses terlarang" });
      }
      await Products.update(
        { name, price },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Kenapa ya error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Products.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!product) {
      return res.status(404).json({ msg: "Data tidak ditemukan" });
    }
    const { name, price } = req.body;
    // dapet request dari middleware
    if (req.role == "admin") {
      await Products.destroy({
        where: {
          id: product.id,
        },
      });
    } else {
      if (req.userId !== product.userId) {
        return res.status(403).json({ msg: "Akses terlarang" });
      }
      await Products.destroy(
        { name, price },
        {
          where: {
            [Op.and]: [{ id: product.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Kenapa ya error" });
  }
};
