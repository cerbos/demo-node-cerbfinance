const users = [
  {
    id: "sally",
    roles: ["USER"],
    attr: {
      department: "SALES",
      region: "EMEA",
    },
  },
  {
    id: "sajit",
    roles: ["ADMIN"],
    attr: {
      department: "IT",
    },
  },
  {
    id: "joe",
    roles: ["USER"],
    attr: {
      department: "FINANCE",
      region: "EMEA",
    },
  },
  {
    id: "brock",
    roles: ["USER", "MANAGER"],
    attr: {
      department: "SALES",
      region: "NA",
    },
  },
  {
    id: "john",
    roles: ["USER", "MANAGER"],
    attr: {
      department: "SALES",
      region: "EMEA",
    },
  },
  {
    id: "zeena",
    roles: ["USER"],
    attr: {
      department: "SALES",
      region: "NA",
    },
  },
];

const expenses = [
  {
    id: "expense1",
    attr: {
      ownerId: "sally",
      createdAt: "2021-10-01T10:00:00.021-05:00",
      vendor: "Flux Water Gear",
      region: "EMEA",
      amount: 2421.12,
      status: "OPEN",
    },
  },
  {
    id: "expense2",
    attr: {
      ownerId: "sally",
      createdAt: "2021-10-01T10:00:00.021-05:00",
      vendor: "Vortex Solar",
      region: "EMEA",
      amount: 2421.12,
      status: "APPROVED",
      approvedBy: "joe",
    },
  },
];

module.exports = {
  users,
  expenses,
};
