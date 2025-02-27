const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');

/**
 * Generate a unique ID
 * @returns {string} UUID
 */
const generateId = () => {
  return uuidv4();
};

/**
 * Hash a password
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {boolean} True if password matches
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.userId, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Format date to ISO string
 * @param {Date} date - Date object
 * @returns {string} ISO string
 */
const formatDate = (date = new Date()) => {
  return date.toISOString();
};

/**
 * Format currency
 * @param {number} amount - Amount
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Calculate total amount
 * @param {Array} items - Array of items with price and quantity
 * @returns {number} Total amount
 */
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

/**
 * Format error response
 * @param {Error} error - Error object
 * @returns {Object} Error response
 */
const formatErrorResponse = (error) => {
  return {
    success: false,
    message: error.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  };
};

/**
 * Format success response
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @returns {Object} Success response
 */
const formatSuccessResponse = (message, data) => {
  return {
    success: true,
    message,
    data,
  };
};

module.exports = {
  generateId,
  hashPassword,
  comparePassword,
  generateToken,
  formatDate,
  formatCurrency,
  calculateTotal,
  formatErrorResponse,
  formatSuccessResponse,
};
