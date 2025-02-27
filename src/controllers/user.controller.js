const { TABLES } = require('../config/config');
const { 
  generateId, 
  hashPassword, 
  comparePassword, 
  formatDate,
  formatErrorResponse,
  formatSuccessResponse 
} = require('../utils/helpers');
const { 
  getItem, 
  putItem, 
  updateItem, 
  deleteItem, 
  scanItems,
  queryItems 
} = require('../utils/dynamodb');

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const getAllUsers = async (req, res) => {
  try {
    // Get query parameters
    const { role, isActive } = req.query;
    
    let users = [];
    
    // If role is provided, query by role
    if (role) {
      users = await queryItems(
        TABLES.USERS,
        'RoleIndex',
        '#role = :role',
        { '#role': 'role' },
        { ':role': role }
      );
    } else {
      // Otherwise, scan all users
      users = await scanItems(TABLES.USERS);
    }
    
    // Filter by isActive if provided
    if (isActive !== undefined) {
      const activeStatus = isActive === 'true';
      users = users.filter(user => user.isActive === activeStatus);
    }
    
    // Remove passwords from response
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    return res.status(200).json(
      formatSuccessResponse('Users retrieved successfully', usersWithoutPasswords)
    );
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Get a user by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user from database
    const user = await getItem(TABLES.USERS, { userId });
    
    if (!user) {
      return res.status(404).json(
        formatErrorResponse(new Error('User not found'))
      );
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    return res.status(200).json(
      formatSuccessResponse('User retrieved successfully', userWithoutPassword)
    );
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, address } = req.body;
    
    // Check if email already exists
    const existingUsers = await queryItems(
      TABLES.USERS,
      'EmailIndex',
      '#email = :email',
      { '#email': 'email' },
      { ':email': email }
    );
    
    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json(
        formatErrorResponse(new Error('Email already exists'))
      );
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const userId = generateId();
    const newUser = {
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      phone: phone || null,
      address: address || null,
      isActive: true,
      createdAt: formatDate(),
      updatedAt: formatDate(),
    };
    
    // Save user to database
    await putItem(TABLES.USERS, newUser);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    return res.status(201).json(
      formatSuccessResponse('User created successfully', userWithoutPassword)
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Update a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, email, role, phone, address, isActive } = req.body;
    
    // Check if user exists
    const existingUser = await getItem(TABLES.USERS, { userId });
    
    if (!existingUser) {
      return res.status(404).json(
        formatErrorResponse(new Error('User not found'))
      );
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== existingUser.email) {
      const existingUsers = await queryItems(
        TABLES.USERS,
        'EmailIndex',
        '#email = :email',
        { '#email': 'email' },
        { ':email': email }
      );
      
      if (existingUsers && existingUsers.length > 0) {
        return res.status(409).json(
          formatErrorResponse(new Error('Email already exists'))
        );
      }
    }
    
    // Update user
    const updates = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(email && { email }),
      ...(role && { role }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
      ...(isActive !== undefined && { isActive }),
      updatedAt: formatDate(),
    };
    
    // Update user in database
    const updatedUser = await updateItem(TABLES.USERS, { userId }, updates);
    
    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    
    return res.status(200).json(
      formatSuccessResponse('User updated successfully', userWithoutPassword)
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Delete a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user exists
    const existingUser = await getItem(TABLES.USERS, { userId });
    
    if (!existingUser) {
      return res.status(404).json(
        formatErrorResponse(new Error('User not found'))
      );
    }
    
    // Delete user from database
    const deletedUser = await deleteItem(TABLES.USERS, { userId });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = deletedUser;
    
    return res.status(200).json(
      formatSuccessResponse('User deleted successfully', userWithoutPassword)
    );
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Change user password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const changePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    // Check if user exists
    const existingUser = await getItem(TABLES.USERS, { userId });
    
    if (!existingUser) {
      return res.status(404).json(
        formatErrorResponse(new Error('User not found'))
      );
    }
    
    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, existingUser.password);
    
    if (!isPasswordValid) {
      return res.status(401).json(
        formatErrorResponse(new Error('Current password is incorrect'))
      );
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update password
    const updates = {
      password: hashedPassword,
      updatedAt: formatDate(),
    };
    
    // Update user in database
    await updateItem(TABLES.USERS, { userId }, updates);
    
    return res.status(200).json(
      formatSuccessResponse('Password changed successfully')
    );
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
