// Memproteksi endpoint user
import Users from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ msg: "Mohon login ke akun anda" });
    }

    const user = await Users.findOne({
      where: {
        uuid: req.session.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Send the user data as a response
    req.userId = user.id;
    req.role = user.role;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const adminOnly = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: {
        uuid: req.session.userId,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ msg: "Akses terlarang" });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Ya?" });
  }
};
