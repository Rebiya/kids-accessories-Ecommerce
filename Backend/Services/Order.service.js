const db = require("../Config/db.config");

async function createOrder(orderData) {
  const { user_id, basket, amount, created, stripe_payment_id } = orderData;

  const sql = `
    INSERT INTO Orders (user_id, basket, amount, created, stripe_payment_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  const result = await db.query(sql, [
    user_id,
    JSON.stringify(basket), // Ensure basket is stored as valid JSON
    amount,
    created,
    stripe_payment_id,
  ]);

  return { id: result.insertId, ...orderData };
}

async function getAllOrders() {
  const sql = `SELECT * FROM Orders`;
  return await db.query(sql);
}

async function getOrderById(id) {
  const sql = `SELECT * FROM Orders WHERE id = ?`;
  const rows = await db.query(sql, [id]);
  return rows[0];
}

//get orders by user id
async function getOrdersByUserId(userId) {
  const sql = `SELECT * FROM Orders WHERE user_id = ?`;
  const rows = await db.query(sql, [userId]);
  return rows;
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
};
