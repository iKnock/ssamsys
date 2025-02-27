const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create DynamoDB client
const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Table definitions
const tables = [
  {
    TableName: process.env.DYNAMODB_USERS_TABLE || 'Users',
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
      { AttributeName: 'role', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'RoleIndex',
        KeySchema: [
          { AttributeName: 'role', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: process.env.DYNAMODB_CUSTOMERS_TABLE || 'Customers',
    KeySchema: [
      { AttributeName: 'customerId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'customerId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: process.env.DYNAMODB_SUPPLIERS_TABLE || 'Suppliers',
    KeySchema: [
      { AttributeName: 'supplierId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'supplierId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: process.env.DYNAMODB_PRODUCTS_TABLE || 'Products',
    KeySchema: [
      { AttributeName: 'productId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'productId', AttributeType: 'S' },
      { AttributeName: 'category', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CategoryIndex',
        KeySchema: [
          { AttributeName: 'category', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: process.env.DYNAMODB_INVENTORY_TABLE || 'Inventory',
    KeySchema: [
      { AttributeName: 'inventoryId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'inventoryId', AttributeType: 'S' },
      { AttributeName: 'productId', AttributeType: 'S' },
      { AttributeName: 'stockStatus', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'ProductIndex',
        KeySchema: [
          { AttributeName: 'productId', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'StockStatusIndex',
        KeySchema: [
          { AttributeName: 'stockStatus', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: process.env.DYNAMODB_SALES_TABLE || 'Sales',
    KeySchema: [
      { AttributeName: 'saleId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'saleId', AttributeType: 'S' },
      { AttributeName: 'customerId', AttributeType: 'S' },
      { AttributeName: 'saleDate', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CustomerIndex',
        KeySchema: [
          { AttributeName: 'customerId', KeyType: 'HASH' },
          { AttributeName: 'saleDate', KeyType: 'RANGE' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'DateIndex',
        KeySchema: [
          { AttributeName: 'saleDate', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: process.env.DYNAMODB_SALES_DETAILS_TABLE || 'SalesDetails',
    KeySchema: [
      { AttributeName: 'saleDetailId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'saleDetailId', AttributeType: 'S' },
      { AttributeName: 'saleId', AttributeType: 'S' },
      { AttributeName: 'productId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'SaleIndex',
        KeySchema: [
          { AttributeName: 'saleId', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'ProductIndex',
        KeySchema: [
          { AttributeName: 'productId', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: process.env.DYNAMODB_PAYMENTS_TABLE || 'Payments',
    KeySchema: [
      { AttributeName: 'paymentId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'paymentId', AttributeType: 'S' },
      { AttributeName: 'saleId', AttributeType: 'S' },
      { AttributeName: 'paymentDate', AttributeType: 'S' },
      { AttributeName: 'paymentMethod', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'SaleIndex',
        KeySchema: [
          { AttributeName: 'saleId', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'DateIndex',
        KeySchema: [
          { AttributeName: 'paymentDate', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'MethodIndex',
        KeySchema: [
          { AttributeName: 'paymentMethod', KeyType: 'HASH' },
          { AttributeName: 'paymentDate', KeyType: 'RANGE' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: process.env.DYNAMODB_EXPENSES_TABLE || 'Expenses',
    KeySchema: [
      { AttributeName: 'expenseId', KeyType: 'HASH' },
    ],
    AttributeDefinitions: [
      { AttributeName: 'expenseId', AttributeType: 'S' },
      { AttributeName: 'category', AttributeType: 'S' },
      { AttributeName: 'expenseDate', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CategoryIndex',
        KeySchema: [
          { AttributeName: 'category', KeyType: 'HASH' },
          { AttributeName: 'expenseDate', KeyType: 'RANGE' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'DateIndex',
        KeySchema: [
          { AttributeName: 'expenseDate', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
];

// Create tables
const createTables = async () => {
  try {
    // Check existing tables
    const { TableNames } = await dynamoDB.send(new ListTablesCommand({}));
    
    // Create tables that don't exist
    for (const tableConfig of tables) {
      if (!TableNames.includes(tableConfig.TableName)) {
        console.log(`Creating table: ${tableConfig.TableName}`);
        await dynamoDB.send(new CreateTableCommand(tableConfig));
        console.log(`Table created: ${tableConfig.TableName}`);
      } else {
        console.log(`Table already exists: ${tableConfig.TableName}`);
      }
    }
    
    console.log('All tables created or already exist');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

// Run the script if it's called directly
if (require.main === module) {
  createTables();
}

module.exports = {
  createTables,
};
