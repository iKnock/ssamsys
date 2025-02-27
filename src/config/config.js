const dotenv = require('dotenv');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Load environment variables
dotenv.config();

// Create DynamoDB client for local development
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'local',
  endpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
  },
});

// Create DynamoDB Document client
const dynamoDb = DynamoDBDocumentClient.from(client);

// DynamoDB table names
const TABLES = {
  USERS: process.env.DYNAMODB_USERS_TABLE || 'Users',
  CUSTOMERS: process.env.DYNAMODB_CUSTOMERS_TABLE || 'Customers',
  SUPPLIERS: process.env.DYNAMODB_SUPPLIERS_TABLE || 'Suppliers',
  PRODUCTS: process.env.DYNAMODB_PRODUCTS_TABLE || 'Products',
  INVENTORY: process.env.DYNAMODB_INVENTORY_TABLE || 'Inventory',
  SALES: process.env.DYNAMODB_SALES_TABLE || 'Sales',
  SALES_DETAILS: process.env.DYNAMODB_SALES_DETAILS_TABLE || 'SalesDetails',
  PAYMENTS: process.env.DYNAMODB_PAYMENTS_TABLE || 'Payments',
  EXPENSES: process.env.DYNAMODB_EXPENSES_TABLE || 'Expenses',
};

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

module.exports = {
  dynamoDb,
  TABLES,
  JWT_SECRET,
  JWT_EXPIRES_IN,
};
