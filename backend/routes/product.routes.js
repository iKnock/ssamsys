const express = require('express');
const { 
  getAllProducts, 
  getProductById, 
  getProductsByCategory, 
  getProductsBySupplier, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/product.controller');
const { 
  createProductValidation, 
  updateProductValidation, 
  getProductByIdValidation, 
  getProductsByCategoryValidation, 
  getProductsBySupplierValidation 
} = require('../validations/product.validation');
const { validate } = require('../middleware/validation.middleware');
const { verifyToken, isAdmin, isStockManager } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter products by active status
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', verifyToken, getAllProducts);

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/:productId', verifyToken, getProductByIdValidation, validate, getProductById);

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Product category
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/category/:category', verifyToken, getProductsByCategoryValidation, validate, getProductsByCategory);

/**
 * @swagger
 * /api/products/supplier/{supplierId}:
 *   get:
 *     summary: Get products by supplier
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: supplierId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Supplier ID
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/supplier/:supplierId', verifyToken, getProductsBySupplierValidation, validate, getProductsBySupplier);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - size
 *               - color
 *               - ageGroup
 *               - costPrice
 *               - sellingPrice
 *               - supplierId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               size:
 *                 type: string
 *               color:
 *                 type: string
 *               ageGroup:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [boy, girl, unisex]
 *               costPrice:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               sellingPrice:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               supplierId:
 *                 type: string
 *                 format: uuid
 *               barcode:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Supplier not found
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, isStockManager, createProductValidation, validate, createProduct);

/**
 * @swagger
 * /api/products/{productId}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               size:
 *                 type: string
 *               color:
 *                 type: string
 *               ageGroup:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [boy, girl, unisex]
 *               costPrice:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               sellingPrice:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               supplierId:
 *                 type: string
 *                 format: uuid
 *               barcode:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put('/:productId', verifyToken, isStockManager, updateProductValidation, validate, updateProduct);

/**
 * @swagger
 * /api/products/{productId}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:productId', verifyToken, isAdmin, getProductByIdValidation, validate, deleteProduct);

module.exports = router;
