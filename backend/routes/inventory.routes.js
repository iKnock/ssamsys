const express = require('express');
const { 
  getAllInventory, 
  getInventoryByProduct, 
  getLowStockInventory, 
  addInventory, 
  updateInventory, 
  adjustInventory 
} = require('../controllers/inventory.controller');
const { validate } = require('../middleware/validation.middleware');
const { verifyToken, isStockManager } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         inventoryId:
 *           type: string
 *           description: The auto-generated ID of the inventory item
 *         productId:
 *           type: string
 *           description: The product ID this inventory item belongs to
 *         quantity:
 *           type: number
 *           description: Current quantity in stock
 *         stockStatus:
 *           type: string
 *           enum: [normal, low, out]
 *           description: Current stock status
 *         batchNumber:
 *           type: string
 *           description: Batch number for this inventory
 *         purchaseDate:
 *           type: string
 *           format: date-time
 *           description: Date when the inventory was purchased
 *         expiryDate:
 *           type: string
 *           format: date-time
 *           description: Expiry date for the inventory (if applicable)
 *         lowStockThreshold:
 *           type: number
 *           description: Threshold for low stock alert
 *         location:
 *           type: string
 *           description: Storage location
 *         notes:
 *           type: string
 *           description: Additional notes
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the inventory record was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the inventory record was last updated
 */

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: stockStatus
 *         schema:
 *           type: string
 *           enum: [normal, low, out]
 *         description: Filter by stock status
 *     responses:
 *       200:
 *         description: List of inventory items
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', verifyToken, getAllInventory);

/**
 * @swagger
 * /api/inventory/low-stock:
 *   get:
 *     summary: Get inventory items with low stock
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of low stock inventory items
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/low-stock', verifyToken, getLowStockInventory);

/**
 * @swagger
 * /api/inventory/product/{productId}:
 *   get:
 *     summary: Get inventory by product ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Inventory details for the product
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/product/:productId', verifyToken, getInventoryByProduct);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Add inventory
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               batchNumber:
 *                 type: string
 *               purchaseDate:
 *                 type: string
 *                 format: date-time
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               lowStockThreshold:
 *                 type: number
 *               location:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inventory added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.post('/', verifyToken, isStockManager, addInventory);

/**
 * @swagger
 * /api/inventory/{inventoryId}:
 *   put:
 *     summary: Update inventory
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inventoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *               batchNumber:
 *                 type: string
 *               purchaseDate:
 *                 type: string
 *                 format: date-time
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               lowStockThreshold:
 *                 type: number
 *               location:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Inventory not found
 *       500:
 *         description: Internal server error
 */
router.put('/:inventoryId', verifyToken, isStockManager, updateInventory);

/**
 * @swagger
 * /api/inventory/{inventoryId}/adjust:
 *   post:
 *     summary: Adjust inventory quantity
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inventoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - adjustment
 *             properties:
 *               adjustment:
 *                 type: number
 *                 description: Positive or negative quantity adjustment
 *               reason:
 *                 type: string
 *                 description: Reason for adjustment
 *     responses:
 *       200:
 *         description: Inventory adjusted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Inventory not found
 *       500:
 *         description: Internal server error
 */
router.post('/:inventoryId/adjust', verifyToken, isStockManager, adjustInventory);

module.exports = router;
