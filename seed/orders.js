db.dropDatabase();

const orders = [
  {
    customerName: "Vincent Vega",
    customerPhoneNumber: "+17654532001",
    status: "Ready",
    notificationStatus: "None",
    customerEmail: "test@example.com",
  },
  {
    customerName: "Mia Wallace",
    customerPhoneNumber: "+17654532002",
    status: "Ready",
    notificationStatus: "None",
    customerEmail: "test@example.com",
  },
];

db.orders.insert(orders);
