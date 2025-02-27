const { TABLES } = require('../config/config');
const { 
  generateId, 
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
 * Get all inventory items
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const getAllInventory = async (req, res) => {
  try {
    // Get query parameters
    const { stockStatus } = req.query;
    
    let inventory = [];
    
    // If stockStatus is provided, query by stockStatus
    if (stockStatus) {
      inventory = await queryItems(
        TABLES.INVENTORY,
        'StockStatusIndex',
        '#stockStatus = :stockStatus',
        { '#stockStatus': 'stockStatus' },
        { ':stockStatus': stockStatus }
      );
    } else {
      // Otherwise, scan all inventory
      inventory = await scanItems(TABLES.INVENTORY);
    }
    
    return res.status(200).json(
      formatSuccessResponse('Inventory retrieved successfully', inventory)
    );
  } catch (error) {
    console.error('Error getting inventory:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Get inventory by product ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const getInventoryByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check if product exists
    const product = await getItem(TABLES.PRODUCTS, { productId });
    
    if (!product) {
      return res.status(404).json(
        formatErrorResponse(new Error('Product not found'))
      );
    }
    
    // Query inventory by product
    const inventory = await queryItems(
      TABLES.INVENTORY,
      'ProductIndex',
      '#productId = :productId',
      { '#productId': 'productId' },
      { ':productId': productId }
    );
    
    return res.status(200).json(
      formatSuccessResponse('Inventory retrieved successfully', inventory)
    );
  } catch (error) {
    console.error('Error getting inventory by product:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Get low stock inventory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const getLowStockInventory = async (req, res) => {
  try {
    // Query inventory with low stock status
    const inventory = await queryItems(
      TABLES.INVENTORY,
      'StockStatusIndex',
      '#stockStatus = :stockStatus',
      { '#stockStatus': 'stockStatus' },
      { ':stockStatus': 'low' }
    );
    
    return res.status(200).json(
      formatSuccessResponse('Low stock inventory retrieved successfully', inventory)
    );
  } catch (error) {
    console.error('Error getting low stock inventory:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Add inventory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const addInventory = async (req, res) => {
  try {
    const { 
      productId, 
      quantity, 
      batchNumber, 
      purchaseDate, 
      expiryDate, 
      lowStockThreshold, 
      location, 
      notes 
    } = req.body;
    
    // Check if product exists
    const product = await getItem(TABLES.PRODUCTS, { productId });
    
    if (!product) {
      return res.status(404).json(
        formatErrorResponse(new Error('Product not found'))
      );
    }
    
    // Check if inventory already exists for this product
    const existingInventory = await queryItems(
      TABLES.INVENTORY,
      'ProductIndex',
      '#productId = :productId',
      { '#productId': 'productId' },
      { ':productId': productId }
    );
    
    let inventoryId;
    let newInventory;
    
    if (existingInventory && existingInventory.length > 0) {
      // Update existing inventory
      inventoryId = existingInventory[0].inventoryId;
      const currentQuantity = existingInventory[0].quantity;
      const newQuantity = currentQuantity + quantity;
      
      // Determine stock status
      const threshold = lowStockThreshold || existingInventory[0].lowStockThreshold;
      let stockStatus = 'normal';
      if (newQuantity <= 0) {
        stockStatus = 'out';
      } else if (newQuantity <= threshold) {
        stockStatus = 'low';
      }
      
      // Update inventory
      const updates = {
        quantity: newQuantity,
        stockStatus,
        ...(batchNumber && { batchNumber }),
        ...(purchaseDate && { purchaseDate }),
        ...(expiryDate && { expiryDate }),
        ...(lowStockThreshold && { lowStockThreshold }),
        ...(location && { location }),
        ...(notes && { notes }),
        updatedAt: formatDate(),
      };
      
      newInventory = await updateItem(TABLES.INVENTORY, { inventoryId }, updates);
    } else {
      // Create new inventory
      inventoryId = generateId();
      
      // Determine stock status
      const threshold = lowStockThreshold || 10; // Default threshold
      let stockStatus = 'normal';
      if (quantity <= 0) {
        stockStatus = 'out';
      } else if (quantity <= threshold) {
        stockStatus = 'low';
      }
      
      newInventory = {
        inventoryId,
        productId,
        quantity,
        stockStatus,
        batchNumber: batchNumber || null,
        purchaseDate: purchaseDate || formatDate(),
        expiryDate: expiryDate || null,
        lowStockThreshold: lowStockThreshold || 10,
        location: location || null,
        notes: notes || null,
        createdAt: formatDate(),
        updatedAt: formatDate(),
      };
      
      // Save inventory to database
      await putItem(TABLES.INVENTORY, newInventory);
    }
    
    return res.status(201).json(
      formatSuccessResponse('Inventory added successfully', newInventory)
    );
  } catch (error) {
    console.error('Error adding inventory:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Update inventory
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const updateInventory = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { 
      quantity, 
      batchNumber, 
      purchaseDate, 
      expiryDate, 
      lowStockThreshold, 
      location, 
      notes 
    } = req.body;
    
    // Check if inventory exists
    const existingInventory = await getItem(TABLES.INVENTORY, { inventoryId });
    
    if (!existingInventory) {
      return res.status(404).json(
        formatErrorResponse(new Error('Inventory not found'))
      );
    }
    
    // Determine stock status if quantity or threshold is changing
    let stockStatus = existingInventory.stockStatus;
    if (quantity !== undefined || lowStockThreshold !== undefined) {
      const newQuantity = quantity !== undefined ? quantity : existingInventory.quantity;
      const newThreshold = lowStockThreshold !== undefined ? lowStockThreshold : existingInventory.lowStockThreshold;
      
      if (newQuantity <= 0) {
        stockStatus = 'out';
      } else if (newQuantity <= newThreshold) {
        stockStatus = 'low';
      } else {
        stockStatus = 'normal';
      }
    }
    
    // Update inventory
    const updates = {
      ...(quantity !== undefined && { quantity }),
      ...(stockStatus && { stockStatus }),
      ...(batchNumber !== undefined && { batchNumber }),
      ...(purchaseDate && { purchaseDate }),
      ...(expiryDate !== undefined && { expiryDate }),
      ...(lowStockThreshold !== undefined && { lowStockThreshold }),
      ...(location !== undefined && { location }),
      ...(notes !== undefined && { notes }),
      updatedAt: formatDate(),
    };
    
    // Update inventory in database
    const updatedInventory = await updateItem(TABLES.INVENTORY, { inventoryId }, updates);
    
    return res.status(200).json(
      formatSuccessResponse('Inventory updated successfully', updatedInventory)
    );
  } catch (error) {
    console.error('Error updating inventory:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Adjust inventory quantity
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const adjustInventory = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const { adjustment, reason } = req.body;
    
    // Check if inventory exists
    const existingInventory = await getItem(TABLES.INVENTORY, { inventoryId });
    
    if (!existingInventory) {
      return res.status(404).json(
        formatErrorResponse(new Error('Inventory not found'))
      );
    }
    
    // Calculate new quantity
    const newQuantity = existingInventory.quantity + adjustment;
    
    // Determine stock status
    let stockStatus = 'normal';
    if (newQuantity <= 0) {
      stockStatus = 'out';
    } else if (newQuantity <= existingInventory.lowStockThreshold) {
      stockStatus = 'low';
    }
    
    // Update inventory
    const updates = {
      quantity: newQuantity,
      stockStatus,
      notes: reason ? `${existingInventory.notes ? existingInventory.notes + '; ' : ''}${reason} (${adjustment > 0 ? '+' : ''}${adjustment})` : existingInventory.notes,
      updatedAt: formatDate(),
    };
    
    // Update inventory in database
    const updatedInventory = await updateItem(TABLES.INVENTORY, { inventoryId }, updates);
    
    return res.status(200).json(
      formatSuccessResponse('Inventory adjusted successfully', updatedInventory)
    );
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

module.exports = {
  getAllInventory,
  getInventoryByProduct,
  getLowStockInventory,
  addInventory,
  updateInventory,
  adjustInventory,
};
