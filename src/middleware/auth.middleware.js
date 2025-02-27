const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

/**
 * Middleware to verify JWT token
 */
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ 
      success: false, 
      message: 'No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: Invalid token' 
    });
  }
};

/**
 * Middleware to check if user has admin role
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Forbidden: Admin role required' 
    });
  }
};

/**
 * Middleware to check if user has cashier role
 */
const isCashier = (req, res, next) => {
  if (req.user && (req.user.role === 'cashier' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Forbidden: Cashier role required' 
    });
  }
};

/**
 * Middleware to check if user has stock manager role
 */
const isStockManager = (req, res, next) => {
  if (req.user && (req.user.role === 'stockManager' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Forbidden: Stock Manager role required' 
    });
  }
};

/**
 * Middleware to check if user has any of the specified roles
 */
const hasRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Required roles: ${roles.join(', ')}` 
      });
    }
  };
};

module.exports = {
  verifyToken,
  isAdmin,
  isCashier,
  isStockManager,
  hasRole,
};
