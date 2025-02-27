```mermaid
graph TB
    subgraph "Client"
        A[Web Browser] --> B[Angular Frontend]
    end
    
    subgraph "AWS Cloud"
        subgraph "Frontend Hosting"
            C[S3 Bucket] --> D[CloudFront Distribution]
            D --> B
        end
        
        subgraph "Authentication"
            E[AWS Cognito]
            B <--> E
        end
        
        subgraph "API Layer"
            F[API Gateway] --> G[Lambda Functions]
        end
        
        subgraph "Backend Services"
            G --> H[Express.js API]
            H --> I[Business Logic]
            I --> J[Data Access Layer]
        end
        
        subgraph "Database"
            J --> K[DynamoDB]
        end
        
        subgraph "CI/CD Pipeline"
            L[GitHub Repository] --> M[AWS CodePipeline]
            M --> N[Build & Test]
            N --> O[Deploy to S3/Lambda]
        end
        
        B <--> F
    end
    
    style A fill:#f9f9f9,stroke:#333,stroke-width:1px
    style B fill:#dd0031,stroke:#333,stroke-width:1px,color:white
    style C fill:#FF9900,stroke:#333,stroke-width:1px
    style D fill:#FF9900,stroke:#333,stroke-width:1px
    style E fill:#FF9900,stroke:#333,stroke-width:1px
    style F fill:#FF9900,stroke:#333,stroke-width:1px
    style G fill:#FF9900,stroke:#333,stroke-width:1px
    style H fill:#68BD45,stroke:#333,stroke-width:1px
    style I fill:#68BD45,stroke:#333,stroke-width:1px
    style J fill:#68BD45,stroke:#333,stroke-width:1px
    style K fill:#FF9900,stroke:#333,stroke-width:1px
    style L fill:#333333,stroke:#333,stroke-width:1px,color:white
    style M fill:#FF9900,stroke:#333,stroke-width:1px
    style N fill:#FF9900,stroke:#333,stroke-width:1px
    style O fill:#FF9900,stroke:#333,stroke-width:1px
```

# Overall Architecture Diagram

This diagram illustrates the complete architecture of our Angular and Node.js/Express application deployed on AWS serverless infrastructure. The system is divided into several key areas:

## Client Side
- **Web Browser**: The entry point for users
- **Angular Frontend**: Single-page application built with Angular

## AWS Cloud Infrastructure
- **Frontend Hosting**: 
  - S3 bucket stores static assets
  - CloudFront provides global content delivery with caching

- **Authentication**:
  - AWS Cognito manages user authentication and authorization
  - Handles user registration, login, and token management

- **API Layer**:
  - API Gateway exposes RESTful endpoints
  - Routes requests to appropriate Lambda functions

- **Backend Services**:
  - Lambda Functions execute serverless backend code
  - Express.js provides the API framework
  - Business Logic layer implements application rules
  - Data Access Layer abstracts database operations

- **Database**:
  - DynamoDB provides NoSQL storage with high scalability

- **CI/CD Pipeline**:
  - GitHub Repository stores source code
  - AWS CodePipeline orchestrates the deployment process
  - Build & Test stage validates code quality
  - Deployment stage publishes to S3 and Lambda

This serverless architecture provides high scalability, reduced operational overhead, and pay-per-use cost model.
