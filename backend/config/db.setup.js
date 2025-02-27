const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const { dynamoDb, TABLES } = require('./config');

const client = new DynamoDBClient({
  region: 'local',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'local',
    secretAccessKey: 'local',
  },
});

const createTable = async (tableName, partitionKey, sortKey = null, globalSecondaryIndexes = []) => {
  const params = {
    TableName: tableName,
    KeySchema: [
      { AttributeName: partitionKey, KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: partitionKey, AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5
    }
  };

  // Add sort key if provided
  if (sortKey) {
    params.KeySchema.push({ AttributeName: sortKey, KeyType: 'RANGE' });
    params.AttributeDefinitions.push({ AttributeName: sortKey, AttributeType: 'S' });
  }

  // Add global secondary indexes
  if (globalSecondaryIndexes.length > 0) {
    params.GlobalSecondaryIndexes = globalSecondaryIndexes.map(index => ({
      IndexName: index.IndexName,
      KeySchema: [
        { AttributeName: index.PartitionKey, KeyType: 'HASH' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    }));

    // Add attribute definitions for GSI
    params.AttributeDefinitions.push(
      ...globalSecondaryIndexes.map(index => ({
        AttributeName: index.PartitionKey,
        AttributeType: 'S'
      }))
    );
  }

  try {
    const command = new CreateTableCommand(params);
    await client.send(command);
    console.log(`Table ${tableName} created successfully`);
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
  }
};

const setupDynamoDBTables = async () => {
  try {
    // List existing tables
    const listTablesCommand = new ListTablesCommand({});
    const { TableNames } = await client.send(listTablesCommand);

    // Create tables if they don't exist
    const tableCreationPromises = Object.values(TABLES)
      .filter(tableName => !TableNames.includes(tableName))
      .map(tableName => {
        switch(tableName) {
          case 'Users':
            return createTable(tableName, 'id');
          case 'Customers':
            return createTable(tableName, 'id');
          case 'Suppliers':
            return createTable(tableName, 'id');
          case 'Products':
            return createTable(tableName, 'id');
          case 'Inventory':
            return createTable(tableName, 'productId');
          case 'Sales':
            return createTable(tableName, 'id');
          case 'SalesDetails':
            return createTable(tableName, 'salesId', 'productId');
          case 'Payments':
            return createTable(tableName, 'id');
          case 'Expenses':
            return createTable(tableName, 'id');
          default:
            console.log(`No specific setup for table: ${tableName}`);
            return Promise.resolve();
        }
      });

    await Promise.all(tableCreationPromises);
    console.log('DynamoDB local tables setup complete');
  } catch (error) {
    console.error('Error setting up DynamoDB tables:', error);
  }
};

module.exports = { setupDynamoDBTables };
