const db = require("../Config/db.config");

// Get all Users
async function getAllUsers() {
  const query = `
    SELECT 
      Users.ID AS ID, 
      Users.email, 
      Users.phone_number, 
      Users.first_name, 
      Users.last_name,
      Users.role_id,
      Users.created_at,
      Role.name AS role_name
    FROM Users 
    INNER JOIN Role ON Users.role_id = Role.ID
  `;

  // Run query without destructuring so you get the full result
  const result = await db.query(query);

  // Depending on your db lib, result might be [rows, fields] or just rows
  // Let's handle both:

  let rows;

  if (Array.isArray(result)) {
    // If result is like [rows, fields], take first element
    rows = Array.isArray(result[0]) ? result[0] : result;
  } else {
    rows = [];
  }

  // Ensure rows is always an array
  if (!Array.isArray(rows)) rows = [];

  return rows;
}

// Create User
async function createUser(User) {
  const query = `
    INSERT INTO Users 
    (first_name, last_name, email, phone_number, password, role_id) 
    VALUES (?, ?, ?, ?, ?, ?)`;

  const values = [
    User.first_name,
    User.last_name,
    User.email,
    User.phone_number || null,
    User.password,
    User.role_id || 1,
  ];

  return await db.query(query, values);
}

// Get User by ID
async function getUserByID(ID) {
  const query = `SELECT * FROM Users WHERE ID = ?`;
  const rows = await db.query(query, [ID]);
  return rows.length ? rows[0] : null;
}

// Update User by ID
async function updateUserByID(ID, UserData) {
  if (!ID) {
    throw new Error("ID is required for updating a User.");
  }

  const existingUser = await getUserByID(ID);
  if (!existingUser) {
    throw new Error("User not found.");
  }

  const updatedData = {
    first_name: UserData.first_name ?? existingUser.first_name,
    last_name: UserData.last_name ?? existingUser.last_name,
    email: UserData.email ?? existingUser.email,
    phone_number: UserData.phone_number ?? existingUser.phone_number,
    role_id: UserData.role_id ?? existingUser.role_id,
  };

  const query = `
    UPDATE Users 
    SET first_name = ?, 
        last_name = ?, 
        email = ?, 
        phone_number = ?, 
        role_id = ?
    WHERE ID = ?`;

  const values = [
    updatedData.first_name,
    updatedData.last_name,
    updatedData.email,
    updatedData.phone_number,
    updatedData.role_id,
    ID,
  ];

  const updateResult = await db.query(query, values);
console.log(updateResult.affectedRows);
  if (updateResult.affectedRows === 0) {
    throw new Error("Error updating user");
  }

  return { status: "success", message: "User updated successfully" };
}


// Delete User by ID
async function deleteUserByID(ID) {
  const query = `DELETE FROM Users WHERE ID = ?`;
  return await db.query(query, [ID]);
}

// Get User by email
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

// Check if User exists
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

// Get Users by role
const getUsersByRole = async (roleId) => {
  const sql = `SELECT ID, email, first_name, last_name, phone_number, role_id, ID 
               FROM Users WHERE role_id = ?`;
  return await db.query(sql, [roleId]);
};

module.exports = {
  getAllUsers,
  createUser,
  getUserByID,
  updateUserByID,
  deleteUserByID,
  getUserByEmail,
  checkIfUserExists,
  getUsersByRole,
};
