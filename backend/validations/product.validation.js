const { body, param } = require('express-validator');

/**
 * Validation schema for creating a product
 */
const createProductValidation = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isString().withMessage('Product name must be a string')
    .trim(),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim(),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .isString().withMessage('Category must be a string')
    .trim(),
  
  body('size')
    .notEmpty().withMessage('Size is required')
    .isString().withMessage('Size must be a string')
    .trim(),
  
  body('color')
    .notEmpty().withMessage('Color is required')
    .isString().withMessage('Color must be a string')
    .trim(),
  
  body('ageGroup')
    .notEmpty().withMessage('Age group is required')
    .isString().withMessage('Age group must be a string')
    .trim(),
  
  body('gender')
    .optional()
    .isIn(['boy', 'girl', 'unisex']).withMessage('Gender must be boy, girl, or unisex'),
  
  body('costPrice')
    .notEmpty().withMessage('Cost price is required')
    .isNumeric().withMessage('Cost price must be a number')
    .isFloat({ min: 0 }).withMessage('Cost price must be a positive number'),
  
  body('sellingPrice')
    .notEmpty().withMessage('Selling price is required')
    .isNumeric().withMessage('Selling price must be a number')
    .isFloat({ min: 0 }).withMessage('Selling price must be a positive number')
    .custom((value, { req }) => {
      if (parseFloat(value) < parseFloat(req.body.costPrice)) {
        throw new Error('Selling price must be greater than or equal to cost price');
      }
      return true;
    }),
  
  body('supplierId')
    .notEmpty().withMessage('Supplier ID is required')
    .isUUID().withMessage('Invalid Supplier ID format'),
  
  body('barcode')
    .optional()
    .isString().withMessage('Barcode must be a string')
    .trim(),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),
  
  body('images.*')
    .optional()
    .isURL().withMessage('Image must be a valid URL'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isString().withMessage('Tag must be a string')
    .trim(),
];

/**
 * Validation schema for updating a product
 */
const updateProductValidation = [
  param('productId')
    .notEmpty().withMessage('Product ID is required')
    .isUUID().withMessage('Invalid Product ID format'),
  
  body('name')
    .optional()
    .isString().withMessage('Product name must be a string')
    .trim(),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .trim(),
  
  body('category')
    .optional()
    .isString().withMessage('Category must be a string')
    .trim(),
  
  body('size')
    .optional()
    .isString().withMessage('Size must be a string')
    .trim(),
  
  body('color')
    .optional()
    .isString().withMessage('Color must be a string')
    .trim(),
  
  body('ageGroup')
    .optional()
    .isString().withMessage('Age group must be a string')
    .trim(),
  
  body('gender')
    .optional()
    .isIn(['boy', 'girl', 'unisex']).withMessage('Gender must be boy, girl, or unisex'),
  
  body('costPrice')
    .optional()
    .isNumeric().withMessage('Cost price must be a number')
    .isFloat({ min: 0 }).withMessage('Cost price must be a positive number'),
  
  body('sellingPrice')
    .optional()
    .isNumeric().withMessage('Selling price must be a number')
    .isFloat({ min: 0 }).withMessage('Selling price must be a positive number'),
  
  body('supplierId')
    .optional()
    .isUUID().withMessage('Invalid Supplier ID format'),
  
  body('barcode')
    .optional()
    .isString().withMessage('Barcode must be a string')
    .trim(),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),
  
  body('images.*')
    .optional()
    .isURL().withMessage('Image must be a valid URL'),
  
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isString().withMessage('Tag must be a string')
    .trim(),
  
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
];

/**
 * Validation schema for getting a product by ID
 */
const getProductByIdValidation = [
  param('productId')
    .notEmpty().withMessage('Product ID is required')
    .isUUID().withMessage('Invalid Product ID format'),
];

/**
 * Validation schema for getting products by category
 */
const getProductsByCategoryValidation = [
  param('category')
    .notEmpty().withMessage('Category is required')
    .isString().withMessage('Category must be a string')
    .trim(),
];

/**
 * Validation schema for getting products by supplier
 */
const getProductsBySupplierValidation = [
  param('supplierId')
    .notEmpty().withMessage('Supplier ID is required')
    .isUUID().withMessage('Invalid Supplier ID format'),
];

module.exports = {
  createProductValidation,
  updateProductValidation,
  getProductByIdValidation,
  getProductsByCategoryValidation,
  getProductsBySupplierValidation,
};
