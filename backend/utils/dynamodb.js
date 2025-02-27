const { dynamoDb } = require('../config/config');
const { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand, 
  ScanCommand, 
  BatchGetCommand, 
  BatchWriteCommand 
} = require('@aws-sdk/lib-dynamodb');

/**
 * Generic function to get an item from DynamoDB
 * @param {string} tableName - DynamoDB table name
 * @param {Object} key - Primary key
 * @returns {Promise<Object>} Item
 */
const getItem = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key,
  };

  try {
    const { Item } = await dynamoDb.send(new GetCommand(params));
    return Item;
  } catch (error) {
    console.error(`Error getting item from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Generic function to put an item in DynamoDB
 * @param {string} tableName - DynamoDB table name
 * @param {Object} item - Item to put
 * @returns {Promise<Object>} Result
 */
const putItem = async (tableName, item) => {
  const params = {
    TableName: tableName,
    Item: item,
  };

  try {
    await dynamoDb.send(new PutCommand(params));
    return item;
  } catch (error) {
    console.error(`Error putting item in ${tableName}:`, error);
    throw error;
  }
};

/**
 * Generic function to update an item in DynamoDB
 * @param {string} tableName - DynamoDB table name
 * @param {Object} key - Primary key
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated item
 */
const updateItem = async (tableName, key, updates) => {
  // Build update expression and attribute values
  const updateExpressionParts = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};

  Object.entries(updates).forEach(([field, value]) => {
    if (field !== Object.keys(key)[0]) {  // Skip primary key
      updateExpressionParts.push(`#${field} = :${field}`);
      expressionAttributeNames[`#${field}`] = field;
      expressionAttributeValues[`:${field}`] = value;
    }
  });

  if (updateExpressionParts.length === 0) {
    return getItem(tableName, key);  // Nothing to update
  }

  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  try {
    const { Attributes } = await dynamoDb.send(new UpdateCommand(params));
    return Attributes;
  } catch (error) {
    console.error(`Error updating item in ${tableName}:`, error);
    throw error;
  }
};

/**
 * Generic function to delete an item from DynamoDB
 * @param {string} tableName - DynamoDB table name
 * @param {Object} key - Primary key
 * @returns {Promise<Object>} Result
 */
const deleteItem = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key,
    ReturnValues: 'ALL_OLD',
  };

  try {
    const { Attributes } = await dynamoDb.send(new DeleteCommand(params));
    return Attributes;
  } catch (error) {
    console.error(`Error deleting item from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Generic function to query items from DynamoDB
 * @param {string} tableName - DynamoDB table name
 * @param {string} indexName - Index name (optional)
 * @param {string} keyConditionExpression - Key condition expression
 * @param {Object} expressionAttributeNames - Expression attribute names
 * @param {Object} expressionAttributeValues - Expression attribute values
 * @param {Object} options - Additional options (limit, scanIndexForward, etc.)
 * @returns {Promise<Array>} Items
 */
const queryItems = async (
  tableName,
  indexName,
  keyConditionExpression,
  expressionAttributeNames,
  expressionAttributeValues,
  options = {}
) => {
  const params = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ...options,
  };

  try {
    const { Items } = await dynamoDb.send(new QueryCommand(params));
    return Items;
  } catch (error) {
    console.error(`Error querying items from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Generic function to scan items from DynamoDB
 * @param {string} tableName - DynamoDB table name
 * @param {Object} options - Additional options (filterExpression, limit, etc.)
 * @returns {Promise<Array>} Items
 */
const scanItems = async (tableName, options = {}) => {
  const params = {
    TableName: tableName,
    ...options,
  };

  try {
    const { Items } = await dynamoDb.send(new ScanCommand(params));
    return Items;
  } catch (error) {
    console.error(`Error scanning items from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Generic function to batch get items from DynamoDB
 * @param {string} tableName - DynamoDB table name
 * @param {Array} keys - Array of primary keys
 * @returns {Promise<Array>} Items
 */
const batchGetItems = async (tableName, keys) => {
  const params = {
    RequestItems: {
      [tableName]: {
        Keys: keys,
      },
    },
  };

  try {
    const { Responses } = await dynamoDb.send(new BatchGetCommand(params));
    return Responses[tableName];
  } catch (error) {
    console.error(`Error batch getting items from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Generic function to batch write items to DynamoDB
 * @param {string} tableName - DynamoDB table name
 * @param {Array} items - Array of items to put
 * @returns {Promise<Object>} Result
 */
const batchWriteItems = async (tableName, items) => {
  const putRequests = items.map(item => ({
    PutRequest: {
      Item: item,
    },
  }));

  const params = {
    RequestItems: {
      [tableName]: putRequests,
    },
  };

  try {
    return await dynamoDb.send(new BatchWriteCommand(params));
  } catch (error) {
    console.error(`Error batch writing items to ${tableName}:`, error);
    throw error;
  }
};

/**
 * Generic function to batch delete items from DynamoDB
 * @param {string} tableName - DynamoDB table name
 * @param {Array} keys - Array of primary keys
 * @returns {Promise<Object>} Result
 */
const batchDeleteItems = async (tableName, keys) => {
  const deleteRequests = keys.map(key => ({
    DeleteRequest: {
      Key: key,
    },
  }));

  const params = {
    RequestItems: {
      [tableName]: deleteRequests,
    },
  };

  try {
    return await dynamoDb.send(new BatchWriteCommand(params));
  } catch (error) {
    console.error(`Error batch deleting items from ${tableName}:`, error);
    throw error;
  }
};

module.exports = {
  getItem,
  putItem,
  updateItem,
  deleteItem,
  queryItems,
  scanItems,
  batchGetItems,
  batchWriteItems,
  batchDeleteItems,
};
