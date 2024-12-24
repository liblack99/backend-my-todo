const db = require("../config/db");

const getTodos = async (req, res) => {
  try {
    const results = await db.execute("SELECT * FROM todos WHERE user_id = ?", [
      req.userId,
    ]);

    if (results.rows.length === 0) {
      return res.status(404).send("No se encontraron tareas");
    }

    res.json(results.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error al obtener tareas");
  }
};

const createTodo = async (req, res) => {
  const {title, description} = req.body;

  try {
    const results = await db.execute(
      "INSERT INTO todos (title, description, user_id) VALUES (?, ?, ?)",
      [title, description, req.userId]
    );

    const newTodoId = results.lastInsertRowid;

    // Obtener la tarea recién creada
    const resultsTodo = await db.execute("SELECT * FROM todos WHERE id = ?", [
      newTodoId,
    ]);
    const newTodo = resultsTodo.rows[0]; // Accedemos a los resultados correctamente

    res.status(201).json(newTodo);
  } catch (err) {
    console.error("Error al crear tarea:", err);
    return res.status(500).send("Error al crear tarea");
  }
};

const updateTodoStatus = async (req, res) => {
  const {id, newStatus} = req.body;

  if (!id || !newStatus) {
    return res.status(400).send("Datos inválidos");
  }

  try {
    const results = await db.execute(
      "UPDATE todos SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [newStatus, id]
    );

    if (results.rowsAffected === 0) {
      return res.status(404).send("Tarea no encontrada");
    }

    res.status(200).send({message: "Estado actualizado correctamente"});
  } catch (err) {
    console.error("Error en la consulta SQL:", err);
    return res.status(500).send("Error al actualizar el estado de la tarea");
  }
};

const editTodo = async (req, res) => {
  const {id, title, description} = req.body;

  if (!id || !title || !description) {
    return res.status(400).send("Datos inválidos");
  }

  try {
    const results = await db.execute(
      "UPDATE todos SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?",
      [title, description, id, req.userId]
    );

    if (results.rowsAffected === 0) {
      return res
        .status(404)
        .send("Tarea no encontrada o no pertenece al usuario");
    }

    res.status(200).send({message: "Tarea actualizada correctamente"});
  } catch (err) {
    console.error("Error en la consulta SQL:", err);
    return res.status(500).send("Error al editar la tarea");
  }
};

const deleteTodo = async (req, res) => {
  const {id} = req.body;

  try {
    const results = await db.execute(
      "DELETE FROM todos WHERE id = ? AND user_id = ?",
      [id, req.userId]
    );

    if (results.rowsAffected === 0) {
      return res.status(404).send("Tarea no encontrada");
    }

    res.send("Tarea eliminada");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error al eliminar la tarea");
  }
};

module.exports = {getTodos, createTodo, updateTodoStatus, editTodo, deleteTodo};
