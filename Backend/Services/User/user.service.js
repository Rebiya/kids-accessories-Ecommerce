const db = require("../../Config/db.config");

// Get all users
async function getAllUsers() {
  const query = `SELECT * FROM users INNER JOIN roles ON users.role_id = roles.role_id`;
  return await db.query(query);
}

// Create user
async function createUser(user) {
  const query = `
    INSERT INTO Users 
    (first_name, last_name, email, phone_number, password, role_id) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    user.first_name,
    user.last_name,
    user.email,
    user.phone_number || null,
    user.password,
    user.role_id || 1,
  ];

  return await db.query(query, values);
}

// Get user by UUID
async function getUserByUuid(uuid) {
  const query = `SELECT * FROM Users WHERE uuid = ?`;
  const rows = await db.query(query, [uuid]);
  return rows.length ? rows[0] : null;
}

// Update user by UUID
async function updateUserByUuid(uuid, userData) {
  if (!uuid) {
    throw new Error("UUID is required for updating a user.");
  }

  const existingUser = await getUserByUuid(uuid);
  if (!existingUser) {
    throw new Error("User not found.");
  }

  const updatedData = {
    first_name: userData.first_name ?? existingUser.first_name,
    last_name: userData.last_name ?? existingUser.last_name,
    email: userData.email ?? existingUser.email,
    phone_number: userData.phone_number ?? existingUser.phone_number,
    role_id: userData.role_id ?? existingUser.role_id,
  };

  const query = `
    UPDATE Users 
    SET first_name = ?, 
        last_name = ?, 
        email = ?, 
        phone_number = ?, 
        role_id = ?
    WHERE uuid = ?`;

  const values = [
    updatedData.first_name,
    updatedData.last_name,
    updatedData.email,
    updatedData.phone_number,
    updatedData.role_id,
    uuid,
  ];

  return await db.query(query, values);
}

// Delete user by UUID
async function deleteUserByUuid(uuid) {
  const query = `DELETE FROM Users WHERE uuid = ?`;
  return await db.query(query, [uuid]);
}

// Get user by email
async function getUserByEmail(email) {
  try {
    const trimmedEmail = email.trim().toLowerCase();
    const query = `SELECT * FROM Users WHERE LOWER(TRIM(email)) = ?`;
    const rows = await db.query(query, [trimmedEmail]);
    return rows.length ? rows[0] : null;
  } catch (error) {
    return null;
  }
}

// Check if user exists
const checkIfUserExists = async (email) => {
  try {
    if (!email) return false;
    const trimmedEmail = email.trim().toLowerCase();
    const query = "SELECT * FROM Users WHERE LOWER(TRIM(email)) = ?";
    const rows = await db.query(query, [trimmedEmail]);
    return rows.length > 0;
  } catch (error) {
    return false;
  }
};

// Get users by role
const getUsersByRole = async (roleId) => {
  const sql = `SELECT ID, email, first_name, last_name, phone_number, role_id, uuid 
               FROM Users WHERE role_id = ?`;
  return await db.query(sql, [roleId]);
};

module.exports = {
  getAllUsers,
  createUser,
  getUserByUuid,
  updateUserByUuid,
  deleteUserByUuid,
  getUserByEmail,
  checkIfUserExists,
  getUsersByRole,
};
