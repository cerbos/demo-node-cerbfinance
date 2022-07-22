const users = [
  {
    id: "sally",
    roles: ["USER"],
    attributes: {
      department: "SALES",
      region: "EMEA",
    },
  },
  {
    id: "sajit",
    roles: ["ADMIN"],
    attributes: {
      department: "IT",
    },
  },
  {
    id: "joe",
    roles: ["USER"],
    attributes: {
      department: "FINANCE",
      region: "EMEA",
    },
  },
  {
    id: "jamie",
    roles: ["USER", "MANAGER"],
    attributes: {
      department: "FINANCE",
      region: "EMEA",
    },
  },
  {
    id: "brock",
    roles: ["USER", "MANAGER"],
    attributes: {
      department: "SALES",
      region: "NA",
    },
  },
  {
    id: "john",
    roles: ["USER", "MANAGER"],
    attributes: {
      department: "SALES",
      region: "EMEA",
    },
  },
  {
    id: "zeena",
    roles: ["USER"],
    attributes: {
      department: "SALES",
      region: "NA",
    },
  },
];

const fiveMinutesAgo = new Date();
fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

const twoHoursAgo = new Date();
twoHoursAgo.setHours(twoHoursAgo.getHours() - 2);

const twoMonthsAgo = new Date();
twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

const expenses = [
  {
    id: "expense1",
    attributes: {
      ownerId: "sally",
      createdAt: twoMonthsAgo.toISOString(),
      vendor: "Flux Water Gear",
      region: "EMEA",
      amount: 500,
      status: "OPEN",
    },
  },
  {
    id: "expense2",
    attributes: {
      ownerId: "sally",
      createdAt: twoHoursAgo.toISOString(),
      vendor: "Vortex Solar",
      region: "EMEA",
      amount: 2500,
      status: "APPROVED",
      approvedBy: "joe",
    },
  },
  {
    id: "expense3",
    attributes: {
      ownerId: "sally",
      createdAt: fiveMinutesAgo.toISOString(),
      vendor: "Global Airlines",
      region: "EMEA",
      amount: 12000,
      status: "OPEN",
    },
  },
  {
    id: "expense4",
    attributes: {
      ownerId: "joe",
      createdAt: "2021-10-01T10:00:00.021-05:00",
      vendor: "Vortex Solar",
      region: "EMEA",
      amount: 2421,
      status: "OPEN",
    },
  },
  {
    id: "expense5",
    attributes: {
      ownerId: "sally",
      createdAt: twoHoursAgo.toISOString(),
      vendor: "Vortex Solar",
      region: "EMEA",
      amount: 2500,
      status: "REJECTED",
      approvedBy: "joe",
    },
  },
];

module.exports = {
  users,
  expenses,
};
