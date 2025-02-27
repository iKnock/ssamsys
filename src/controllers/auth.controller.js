const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { 
  DynamoDBDocumentClient, 
  GetCommand, 
  PutCommand, 
  ScanCommand 
} = require('@aws-sdk/lib-dynamodb');
const { dynamoDb, TABLES, JWT_SECRET, JWT_EXPIRES_IN } = require('../config/config');
const { v4: uuidv4 } = require('uuid');

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email using scan (less efficient but works with local DynamoDB)
    const params = {
      TableName: TABLES.USERS,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const { Items } = await dynamoDb.send(new ScanCommand(params));
    const user = Items[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const register = async (req, res) => {
  try {
    const { email, name, password, role = 'staff' } = req.body;

    // Check if user already exists using scan
    const checkParams = {
      TableName: TABLES.USERS,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const { Items: existingUsers } = await dynamoDb.send(new ScanCommand(checkParams));

    if (existingUsers && existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      email,
      name,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString()
    };

    const putParams = {
      TableName: TABLES.USERS,
      Item: newUser
    };

    await dynamoDb.send(new PutCommand(putParams));

    // Generate token
    const token = generateToken(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    // Assuming the user ID is attached to the request by an auth middleware
    const userId = req.user.id;

    const params = {
      TableName: TABLES.USERS,
      Key: {
        id: userId
      }
    };

    const { Item: user } = await dynamoDb.send(new GetCommand(params));

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove sensitive information
    const { password, ...userProfile } = user;

    return res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: userProfile
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  login,
  register,
  getProfile
};
