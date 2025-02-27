const { body, param } = require('express-validator');

/**
 * Validation schema for creating a user
 */
const createUserValidation = [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string')
    .trim(),
  
  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string')
    .trim(),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['admin', 'cashier', 'stockManager']).withMessage('Invalid role'),
  
  body('phone')
    .optional()
    .isMobilePhone().withMessage('Invalid phone number format'),
  
  body('address')
    .optional()
    .isString().withMessage('Address must be a string')
    .trim(),
];

/**
 * Validation schema for updating a user
 */
const updateUserValidation = [
  param('userId')
    .notEmpty().withMessage('User ID is required')
    .isUUID().withMessage('Invalid User ID format'),
  
  body('firstName')
    .optional()
    .isString().withMessage('First name must be a string')
    .trim(),
  
  body('lastName')
    .optional()
    .isString().withMessage('Last name must be a string')
    .trim(),
  
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('role')
    .optional()
    .isIn(['admin', 'cashier', 'stockManager']).withMessage('Invalid role'),
  
  body('phone')
    .optional()
    .isMobilePhone().withMessage('Invalid phone number format'),
  
  body('address')
    .optional()
    .isString().withMessage('Address must be a string')
    .trim(),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

/**
 * Validation schema for changing user password
 */
const changePasswordValidation = [
  param('userId')
    .notEmpty().withMessage('User ID is required')
    .isUUID().withMessage('Invalid User ID format'),
  
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    }),
];

/**
 * Validation schema for getting a user by ID
 */
const getUserByIdValidation = [
  param('userId')
    .notEmpty().withMessage('User ID is required')
    .isUUID().withMessage('Invalid User ID format'),
];

module.exports = {
  createUserValidation,
  updateUserValidation,
  changePasswordValidation,
  getUserByIdValidation,
};
