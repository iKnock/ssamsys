# Baby Clothing Store Management System

A complete store management solution for baby clothing stores, featuring inventory management, sales processing, customer management, and reporting.

## System Architecture

This project consists of two main components:

1. **Backend**: Node.js + Express.js API with DynamoDB
2. **Frontend**: Angular application with Material UI

Detailed architecture diagrams are available in the [docs/architecture](./docs/architecture) directory:

- [Overall Architecture Diagram](./docs/architecture/overall-architecture.md)
- [Component Diagram](./docs/architecture/component-diagram.md)
- [Deployment Diagram](./docs/architecture/deployment-diagram.md)

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Setup Instructions

### Option 1: Using the Setup Script (Recommended)

1. Run the setup script to install all dependencies:
   ```bash
   ./setup.sh
   ```

2. Start both the frontend and backend with a single command:
   ```bash
   ./run-app.sh
   ```

### Option 2: Manual Setup

#### Backend Setup

1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install Angular Material:
   ```bash
   npx ng add @angular/material
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

## Accessing the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api
- **API Documentation**: http://localhost:3000/api-docs

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Create and manage user accounts with different roles
- **Customer Management**: Track customer information and purchase history
- **Supplier Management**: Manage supplier information and purchase orders
- **Product Management**: Add, edit, and categorize products
- **Inventory Management**: Track stock levels and receive alerts for low stock
- **Sales Processing**: Create and manage sales transactions
- **Payment Tracking**: Record and track payments
- **Expense Management**: Track and categorize business expenses
- **Reporting & Analytics**: Generate reports on sales, inventory, and finances

## Project Structure

- **/src**: Backend source code
  - **/config**: Configuration files
  - **/controllers**: API controllers
  - **/middlewares**: Express middlewares
  - **/models**: Data models
  - **/routes**: API routes
  - **/utils**: Utility functions
- **/frontend**: Angular frontend application
  - **/src/app**: Angular components and modules
    - **/core**: Core services, guards, and interceptors
    - **/shared**: Shared components, directives, and pipes
    - **/features**: Feature modules (dashboard, products, etc.)

## License

This project is licensed under the ISC License.
