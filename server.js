require("dotenv").config(); // Cargar variables de entorno
const express = require("express");
const cors = require("cors"); // Importar cors
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");
const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
