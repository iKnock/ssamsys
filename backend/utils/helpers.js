const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
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
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

module.exports = {
  generateId,
  hashPassword,
  comparePassword,
  generateToken
};
