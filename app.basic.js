const express = require("express");
const { users, expenses } = require("./db");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const user = users.find((u) => u.id === req.headers["authorization"]);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  } else {
    req.user = user;
    next();
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "CerbFinance is running",
  });
});

app.get("/expenses", (req, res) => {
  res.json(expenses);
});

app.get("/expenses/:id", (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });
  res.json(expense);
});

app.patch("/expenses/:id", (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });
  // do the patch here
  res.json(expense);
});

app.post("/expenses/:id/approve", (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });
  // do the approve here
  res.json(expense);
});

app.delete("/expenses/:id", (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });
  // do the delete here
  res.json(expense);
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
