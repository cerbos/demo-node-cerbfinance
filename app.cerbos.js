const express = require("express");
const { users, expenses } = require("./db");
const { GRPC } = require("@cerbos/grpc");

// Playground Demo PDP
const cerbos = new GRPC("demo-pdp.cerbos.cloud", {
  tls: true,
  playgroundInstance: "XhkOi82fFKk3YW60e2c806Yvm0trKEje",
});

// Local PDP
// const cerbos = new GRPC("localhost:3593", {
//   tls: false,
// });

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
    message: "CerbFinance is running",
  });
});

app.get("/expenses/:id", async (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });

  const decision = await cerbos.checkResource({
    principal: req.user,
    resource: {
      kind: "expense",
      ...expense,
    },
    actions: ["view", "view:approver"],
  });

  if (decision.isAllowed("view")) {
    const result = Object.assign({}, expense);
    if (!decision.isAllowed("view:approver")) {
      delete result.attributes.approvedBy;
    }
    return res.json(result);
  }
  return res.status(401).json({ error: "Unauthorized" });
});

app.patch("/expenses/:id", async (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });

  const decision = await cerbos.checkResource({
    principal: req.user,
    resource: {
      kind: "expense",
      ...expense,
    },
    actions: ["update"],
  });

  if (decision.isAllowed("update")) {
    // do the patch here
    return res.json(expense);
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/expenses/:id/approve", async (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });

  const decision = await cerbos.checkResource({
    principal: req.user,
    resource: {
      kind: "expense",
      ...expense,
    },
    actions: ["approve"],
  });

  if (decision.isAllowed("approve")) {
    // do the approve here
    return res.json(expense);
  }
  return res.status(401).json({ error: "Unauthorized" });
});

app.delete("/expenses/:id", async (req, res) => {
  const expense = expenses.find((expense) => expense.id === req.params.id);
  if (!expense) return res.status(404).json({ error: "Expense not found" });

  const decision = await cerbos.checkResource({
    principal: req.user,
    resource: {
      kind: "expense",
      ...expense,
    },
    actions: ["delete"],
  });

  if (decision.allAllowed("delete")) {
    // do the deletion here
    return res.json({
      message: "expense deleted",
    });
  }
  return res.status(401).json({ error: "Unauthorized" });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
