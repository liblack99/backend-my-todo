const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const registerUser = async (req, res) => {
  const {username, email, password} = req.body;

  try {
    const results = await db.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (results.rows.length > 0) {
      return res
        .status(400)
        .send("El usuario o el correo ya están registrados");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await db.execute(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    return res.status(201).send("Usuario registrado exitosamente");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error al registrar el usuario");
  }
};

const loginUser = async (req, res) => {
  const {username, password} = req.body;

  try {
    const results = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (results.rows.length === 0) {
      return res.status(400).send("Usuario no encontrado");
    }

    const user = results.rows[0];

    if (!bcrypt.compareSync(password, user.password_hash)) {
      return res.status(400).send("Contraseña incorrecta");
    }

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET);

    const {password_hash, ...userWithoutPassword} = user;

    return res.json({token, user: userWithoutPassword});
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error en la autenticación");
  }
};

const getUser = async (req, res) => {
  const {userId} = req;

  if (!userId) {
    return res.status(400).send("El token no contiene userId");
  }

  try {
    // Consultar la base de datos para obtener la información del usuario
    const results = await db.execute("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (results.length === 0) {
      return res.status(404).send("Usuario no encontrado");
    }

    // Excluir el password_hash o cualquier información sensible del usuario
    const user = results.rows[0];
    const {password_hash, ...userWithoutPassword} = user;

    // Devolver la información del usuario
    return res.json(userWithoutPassword);
  } catch (err) {
    console.error("Error al obtener el usuario:", err);
    return res.status(500).send("Error al obtener la información del usuario");
  }
};
module.exports = {registerUser, loginUser, getUser};
