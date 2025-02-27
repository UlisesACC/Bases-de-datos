require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  
app.use(express.static("public"));  

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

//1. Obtener todas las mascotas (para listarlas en Bajas y Cambios)
app.get("/mascotas", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM mascota ORDER BY idmascota");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//2. Registrar una nueva mascota (Alta)
app.post("/mascotas", async (req, res) => {
  const { idmascota, ruac, nombre, raza, tamanio, genero, collar, descripcion, chip } = req.body;

  // Convertir "collar" a booleano (true/false)
  const tieneCollar = collar === "true";

  try {
    await pool.query(
      "INSERT INTO mascota (idmascota, ruac, nombre, raza, tamanio, genero, collar, descripcion, chip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [idmascota, ruac, nombre, raza, tamanio, genero, tieneCollar, descripcion, chip]
    );
    res.json({ message: "✅ Mascota registrada con éxito" });
  } catch (err) {
    console.error("❌ Error al registrar mascota:", err);
    res.status(500).json({ error: err.message });
  }
});

//3. Modificar una mascota (Cambio)
app.put("/mascotas/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, raza, tamanio, genero, collar, descripcion, chip } = req.body;

  // Convertir "collar" a booleano (true/false)
  const tieneCollar = collar === "true";

  try {
    const result = await pool.query(
      "UPDATE mascota SET nombre=$1, raza=$2, tamanio=$3, genero=$4, collar=$5, descripcion=$6, chip=$7 WHERE idmascota=$8",
      [nombre, raza, tamanio, genero, tieneCollar, descripcion, chip, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "❌ Mascota no encontrada" });
    }
    res.json({ message: "✅ Mascota actualizada con éxito" });
  } catch (err) {
    console.error("❌ Error al modificar mascota:", err);
    res.status(500).json({ error: err.message });
  }
});

// 4.Eliminar una mascota (Baja)
app.delete("/mascotas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM mascota WHERE idmascota = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "❌ Mascota no encontrada" });
    }
    res.json({ message: "✅ Mascota eliminada con éxito" });
  } catch (err) {
    console.error("❌ Error al eliminar mascota:", err);
    res.status(500).json({ error: err.message });
  }
});

//5. Servir la Página Principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//Iniciar el Servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
