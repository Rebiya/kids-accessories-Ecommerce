const db = require("../Config/db.config");


async function createOrder(orderData) {
  try {
    // Parse basket if it's a string
    const parsedBasket = typeof orderData.basket === 'string' 
      ? JSON.parse(orderData.basket)
      : orderData.basket;

    const { user_id, created, stripe_payment_id } = orderData;
    const basket = Array.isArray(parsedBasket) ? parsedBasket : [parsedBasket];

    // Validation
    if (!user_id || typeof user_id !== 'string' || user_id.length !== 36) {
      throw new Error('Invalid user_id format');
    }

    if (!Array.isArray(basket) || basket.length === 0) {
      throw new Error('Basket must be a non-empty array');
    }

    // Process each product
    const insertPromises = basket.map(product => {
      if (!product.product_id && !product.ID) {
        throw new Error('Product ID missing');
      }
      
      const productId = product.product_id || product.ID;
      const price = product.price || (product.quantity * product.unitPrice) || 0;

      return db.query(
        `INSERT INTO Orders (user_id, product_id, amount, created, stripe_payment_id)
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, productId, price, created, stripe_payment_id]
      );
    });

    await Promise.all(insertPromises);
    
    return { 
      success: true,
      message: "Order created successfully"
    };
  } catch (error) {
    console.error('Order creation failed:', {
      error: error.message,
      inputData: orderData
    });
    throw error;
  }
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
