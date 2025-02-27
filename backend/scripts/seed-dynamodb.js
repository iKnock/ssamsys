const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoDb, TABLES } = require('../config/config');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const seedUsers = async () => {
  const users = [
    {
      id: uuidv4(),
      email: 'admin@stockmgt.com',
      password: await bcrypt.hash('AdminPass123!', 10),
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      isActive: true
    },
    {
      id: uuidv4(),
      email: 'manager@stockmgt.com',
      password: await bcrypt.hash('ManagerPass123!', 10),
      role: 'manager',
      firstName: 'Store',
      lastName: 'Manager',
      isActive: true
    },
    {
      id: uuidv4(),
      email: 'staff@stockmgt.com',
      password: await bcrypt.hash('StaffPass123!', 10),
      role: 'staff',
      firstName: 'Staff',
      lastName: 'Member',
      isActive: true
    }
  ];

  for (const user of users) {
    const params = {
      TableName: TABLES.USERS,
      Item: user
    };

    try {
      await dynamoDb.send(new PutCommand(params));
      console.log(`Seeded user: ${user.email}`);
    } catch (error) {
      console.error(`Error seeding user ${user.email}:`, error);
    }
  }
};

const seedDatabase = async () => {
  try {
    await seedUsers();
    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedDatabase();
