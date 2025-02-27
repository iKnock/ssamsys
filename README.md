# Baby Clothing Store Management System

## Local Development Setup with DynamoDB

### Prerequisites
- Docker
- Docker Compose
- Node.js (v16+)
- npm

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Local DynamoDB**
   ```bash
   npm run dynamodb:start
   ```
   This will start DynamoDB Local and DynamoDB Admin UI:
   - DynamoDB: http://localhost:8000
   - DynamoDB Admin: http://localhost:8001

3. **Seed Initial Data**
   ```bash
   npm run dynamodb:seed
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```

### Available Scripts
- `npm run dynamodb:start`: Start local DynamoDB
- `npm run dynamodb:stop`: Stop local DynamoDB
- `npm run dynamodb:seed`: Seed initial database data
- `npm run start`: Start the application
- `npm run dev`: Start the application in development mode

### Default User Credentials
- Admin: 
  - Email: admin@stockmgt.com
  - Password: AdminPass123!
- Manager:
  - Email: manager@stockmgt.com
  - Password: ManagerPass123!
- Staff:
  - Email: staff@stockmgt.com
  - Password: StaffPass123!

### API Documentation
Access Swagger UI at: http://localhost:3000/api-docs
