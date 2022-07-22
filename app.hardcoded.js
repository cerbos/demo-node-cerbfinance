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

app.get("/expenses/:id", (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });

  // Admins can do everything
  if (req.user.roles.includes("ADMIN")) {
    return res.json(expense);
  } else if (req.user.roles.includes("USER")) {
    // Users can see their own expense and who approved it if it has been approved
    if (expense.attributes.ownerId === req.user.id) {
      if (expense.attributes.status != "APPROVED") {
        delete expense.attributes.approvedBy;
      }
      return res.json(expense);
    }

    // Region managers can see expenses from their region
    if (
      req.user.roles.includes("MANAGER") &&
      expense.attributes.region === req.user.attributes.region
    ) {
      return res.json(expense);
    }

    // Anyone in FINANCE can see expenses
    if (req.user.department === "FINANCE") {
      return res.json(expense);
    }
  }

  return res.status(401).json({ error: "Unauthorized" });
});

app.patch("/expenses/:id", (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });

  const canPatch = false;
  // Admins can do everything
  if (req.user.roles.includes("ADMIN")) {
    canPatch = true;
  } else if (req.user.roles.includes("USER")) {
    // Users can only patch their own expense if OPEN
    if (
      expense.attributes.ownerId === req.user.id &&
      expense.attributes.status === "OPEN"
    ) {
      canPatch = true;
    }
  }
  if (canPatch) {
    // do the patch here
    return res.json(expense);
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/expenses/:id/approve", (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });

  const canApprove = false;

  // Admins can do everything
  if (req.user.roles.includes("ADMIN")) {
    canApprove = true;
  } else if (
    req.user.roles.includes("USER") &&
    req.user.attributes.department === "FINANCE" &&
    expense.attributes.ownerId != req.user.id
  ) {
    // Finance user <$1000
    if (expense.attributes.amount < 1000) {
      canApprove = true;
    } else if (req.user.roles.includes("MANAGER")) {
      canApprove = true;
    }
  }

  if (canApprove) {
    // do the approve here
    return res.json(expense);
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.delete("/expenses/:id", (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });

  const canDelete = false;

  // Admins can do everything
  if (req.user.roles.includes("ADMIN")) {
    canDelete = true;
  } else if (req.user.roles.includes("USER")) {
    // Finance Managers can delete
    if (
      req.user.roles.includes("MANAGER") &&
      req.user.attributes.department === "FINANCE"
    ) {
      canDelete = true;
    }

    // Owner can delete IF status is OPEN AND it was created in the last hour
    if (
      expense.attributes.ownerId === req.user.id &&
      expense.attributes.status === "OPEN"
    ) {
      const createdAt = new Date(expense.attributes.createdAt);
      const now = new Date();
      const diff = now.getTime() - createdAt.getTime();
      if (diff < 3600000) {
        canDelete = true;
      }
    }
  }

  if (canDelete) {
    // do the deletion here
    return res.json({
      message: "expense deleted",
    });
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
