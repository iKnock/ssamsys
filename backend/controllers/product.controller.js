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
 * Get all products
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const getAllProducts = async (req, res) => {
  try {
    // Get query parameters
    const { category, isActive } = req.query;
    
    let products = [];
    
    // If category is provided, query by category
    if (category) {
      products = await queryItems(
        TABLES.PRODUCTS,
        'CategoryIndex',
        '#category = :category',
        { '#category': 'category' },
        { ':category': category }
      );
    } else {
      // Otherwise, scan all products
      products = await scanItems(TABLES.PRODUCTS);
    }
    
    // Filter by isActive if provided
    if (isActive !== undefined) {
      const activeStatus = isActive === 'true';
      products = products.filter(product => product.isActive === activeStatus);
    }
    
    return res.status(200).json(
      formatSuccessResponse('Products retrieved successfully', products)
    );
  } catch (error) {
    console.error('Error getting products:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Get a product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Get product from database
    const product = await getItem(TABLES.PRODUCTS, { productId });
    
    if (!product) {
      return res.status(404).json(
        formatErrorResponse(new Error('Product not found'))
      );
    }
    
    return res.status(200).json(
      formatSuccessResponse('Product retrieved successfully', product)
    );
  } catch (error) {
    console.error('Error getting product:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Get products by category
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Query products by category
    const products = await queryItems(
      TABLES.PRODUCTS,
      'CategoryIndex',
      '#category = :category',
      { '#category': 'category' },
      { ':category': category }
    );
    
    return res.status(200).json(
      formatSuccessResponse('Products retrieved successfully', products)
    );
  } catch (error) {
    console.error('Error getting products by category:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Get products by supplier
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const getProductsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params;
    
    // Query products by supplier
    const products = await queryItems(
      TABLES.PRODUCTS,
      'SupplierIndex',
      '#supplierId = :supplierId',
      { '#supplierId': 'supplierId' },
      { ':supplierId': supplierId }
    );
    
    return res.status(200).json(
      formatSuccessResponse('Products retrieved successfully', products)
    );
  } catch (error) {
    console.error('Error getting products by supplier:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Create a new product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      category, 
      size, 
      color, 
      ageGroup, 
      gender, 
      costPrice, 
      sellingPrice, 
      supplierId, 
      barcode, 
      images, 
      tags 
    } = req.body;
    
    // Check if supplier exists
    const supplier = await getItem(TABLES.SUPPLIERS, { supplierId });
    
    if (!supplier) {
      return res.status(404).json(
        formatErrorResponse(new Error('Supplier not found'))
      );
    }
    
    // Create new product
    const productId = generateId();
    const newProduct = {
      productId,
      name,
      description: description || null,
      category,
      size,
      color,
      ageGroup,
      gender: gender || 'unisex',
      costPrice: parseFloat(costPrice),
      sellingPrice: parseFloat(sellingPrice),
      supplierId,
      barcode: barcode || null,
      images: images || [],
      tags: tags || [],
      isActive: true,
      createdAt: formatDate(),
      updatedAt: formatDate(),
    };
    
    // Save product to database
    await putItem(TABLES.PRODUCTS, newProduct);
    
    return res.status(201).json(
      formatSuccessResponse('Product created successfully', newProduct)
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Update a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { 
      name, 
      description, 
      category, 
      size, 
      color, 
      ageGroup, 
      gender, 
      costPrice, 
      sellingPrice, 
      supplierId, 
      barcode, 
      images, 
      tags,
      isActive
    } = req.body;
    
    // Check if product exists
    const existingProduct = await getItem(TABLES.PRODUCTS, { productId });
    
    if (!existingProduct) {
      return res.status(404).json(
        formatErrorResponse(new Error('Product not found'))
      );
    }
    
    // Check if supplier exists if supplierId is provided
    if (supplierId) {
      const supplier = await getItem(TABLES.SUPPLIERS, { supplierId });
      
      if (!supplier) {
        return res.status(404).json(
          formatErrorResponse(new Error('Supplier not found'))
        );
      }
    }
    
    // Update product
    const updates = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(category && { category }),
      ...(size && { size }),
      ...(color && { color }),
      ...(ageGroup && { ageGroup }),
      ...(gender && { gender }),
      ...(costPrice !== undefined && { costPrice: parseFloat(costPrice) }),
      ...(sellingPrice !== undefined && { sellingPrice: parseFloat(sellingPrice) }),
      ...(supplierId && { supplierId }),
      ...(barcode !== undefined && { barcode }),
      ...(images && { images }),
      ...(tags && { tags }),
      ...(isActive !== undefined && { isActive }),
      updatedAt: formatDate(),
    };
    
    // Update product in database
    const updatedProduct = await updateItem(TABLES.PRODUCTS, { productId }, updates);
    
    return res.status(200).json(
      formatSuccessResponse('Product updated successfully', updatedProduct)
    );
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

/**
 * Delete a product
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 */
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Check if product exists
    const existingProduct = await getItem(TABLES.PRODUCTS, { productId });
    
    if (!existingProduct) {
      return res.status(404).json(
        formatErrorResponse(new Error('Product not found'))
      );
    }
    
    // Delete product from database
    const deletedProduct = await deleteItem(TABLES.PRODUCTS, { productId });
    
    return res.status(200).json(
      formatSuccessResponse('Product deleted successfully', deletedProduct)
    );
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json(formatErrorResponse(error));
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySupplier,
  createProduct,
  updateProduct,
  deleteProduct,
};
