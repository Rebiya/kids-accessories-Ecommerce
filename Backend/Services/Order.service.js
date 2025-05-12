const db = require("../Config/db.config");

async function createOrder(orderData) {
  const { user_id, basket, amount, created, stripe_payment_id } = orderData;

  const insertPromises = basket.map((product) => {
    const sql = `
      INSERT INTO Orders (user_id, product_id, amount, created, stripe_payment_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    return db.query(sql, [
      user_id,
      product.ID, // product ID from your basket item
      amount,
      created,
      stripe_payment_id,
    ]);
  });

  await Promise.all(insertPromises);

  return { message: "Order successfully created" };
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
  const sql = `
    SELECT 
      o.id AS order_id,
      o.amount,
      o.created,
      o.stripe_payment_id,
      p.id AS product_id,
      p.title,
      p.description,
      p.image,
      p.price,
      p.category_id,
      p.rating_rate,
      p.rating_count
    FROM Orders o
    JOIN Products p ON o.product_id = p.ID
    WHERE o.user_id = ?
    ORDER BY o.created DESC
  `;

  const rows = await db.query(sql, [userId]);

  // Group by order_id if needed (optional depending on your frontend)
  return rows;
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
};
