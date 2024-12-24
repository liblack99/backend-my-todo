const express = require("express");
const {
  getTodos,
  createTodo,
  updateTodoStatus,
  editTodo,
  deleteTodo,
} = require("../controllers/todoController");
const authenticateToken = require("../middlewares/authenticateToken");

const router = express.Router();

router.get("/", authenticateToken, getTodos);
router.post("/create", authenticateToken, createTodo);
router.patch("/status", authenticateToken, updateTodoStatus);
router.patch("/edit", authenticateToken, editTodo);
router.delete("/", authenticateToken, deleteTodo);

module.exports = router;
