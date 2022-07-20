const express = require("express");
const { users, expenses } = require("../common/db");

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const user = users.find((u) => u.id === req.headers["authorization"]);
  if (!user) {
    res.status(401).send("Unauthorized");
  } else {
    req.user = user;
    next();
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "Cerbforce is running",
  });
});

app.get("/expenses", (req, res) => {
  res.json(expenses);
});

app.get("/expenses/:id", (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).send("Expense not found");
  res.json(expense);
});

app.post("/expenses/:id/approve", (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).send("Expense not found");
  expense.attr.status = "APPROVED";
  expense.attr.approvedBy = req.user.id;
  res.json(expense);
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
