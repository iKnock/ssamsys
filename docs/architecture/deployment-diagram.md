```mermaid
graph TB
    subgraph "Development Environment"
        A1[Developer Workstation]
        A2[Git Repository]
        A3[CI/CD Trigger]
        
        A1 -->|git push| A2
        A2 -->|webhook| A3
    end
    
    subgraph "AWS Cloud"
        subgraph "CI/CD Pipeline"
            B1[AWS CodePipeline]
            B2[Source Stage]
            B3[Build Stage]
            B4[Test Stage]
            B5[Deploy Stage]
            
            B1 --> B2
            B2 --> B3
            B3 --> B4
            B4 --> B5
        end
        
        subgraph "Frontend Deployment"
            C1[S3 Bucket]
            C2[CloudFront Distribution]
            C3[Route 53 DNS]
            C4[ACM Certificate]
            
            B5 -->|deploy static assets| C1
            C1 --> C2
            C3 -->|DNS routing| C2
            C4 -->|SSL/TLS| C2
        end
        
        subgraph "Backend Deployment"
            D1[API Gateway]
            D2[Lambda Functions]
            D3[CloudWatch Logs]
            D4[CloudWatch Alarms]
            
            B5 -->|deploy serverless functions| D2
            D1 -->|route requests| D2
            D2 -->|log output| D3
            D3 -->|trigger| D4
        end
        
        subgraph "Database"
            E1[DynamoDB Tables]
            E2[DynamoDB Auto Scaling]
            E3[DynamoDB Backups]
            
            D2 -->|read/write data| E1
            E1 --> E2
            E1 -->|scheduled backup| E3
        end
        
        subgraph "Security & Authentication"
            F1[Cognito User Pool]
            F2[Cognito Identity Pool]
            F3[IAM Roles]
            F4[API Gateway Authorizers]
            
            C2 -->|authenticate users| F1
            F1 -->|federated identities| F2
            F2 -->|assume| F3
            F4 -->|validate tokens| F1
            D1 -->|authorize requests| F4
            F3 -->|grant permissions| D2
            F3 -->|grant permissions| E1
        end
        
        subgraph "Monitoring & Operations"
            G1[CloudWatch Dashboard]
            G2[X-Ray Tracing]
            G3[SNS Notifications]
            
            D2 -->|trace requests| G2
            D3 -->|metrics| G1
            D4 -->|alert| G3
            E1 -->|metrics| G1
            C2 -->|metrics| G1
        end
    end
    
    subgraph "End Users"
        H1[Web Browser]
        H2[Mobile Browser]
        
        H1 -->|HTTPS requests| C2
        H2 -->|HTTPS requests| C2
        C2 -->|serve content| H1
        C2 -->|serve content| H2
        H1 -->|API calls| D1
        H2 -->|API calls| D1
    end
    
    style A1 fill:#f9f9f9,stroke:#333,stroke-width:1px
    style A2 fill:#333333,stroke:#333,stroke-width:1px,color:white
    style A3 fill:#333333,stroke:#333,stroke-width:1px,color:white
    
    style B1 fill:#FF9900,stroke:#333,stroke-width:1px
    style B2 fill:#FF9900,stroke:#333,stroke-width:1px
    style B3 fill:#FF9900,stroke:#333,stroke-width:1px
    style B4 fill:#FF9900,stroke:#333,stroke-width:1px
    style B5 fill:#FF9900,stroke:#333,stroke-width:1px
    
    style C1 fill:#FF9900,stroke:#333,stroke-width:1px
    style C2 fill:#FF9900,stroke:#333,stroke-width:1px
    style C3 fill:#FF9900,stroke:#333,stroke-width:1px
    style C4 fill:#FF9900,stroke:#333,stroke-width:1px
    
    style D1 fill:#FF9900,stroke:#333,stroke-width:1px
    style D2 fill:#FF9900,stroke:#333,stroke-width:1px
    style D3 fill:#FF9900,stroke:#333,stroke-width:1px
    style D4 fill:#FF9900,stroke:#333,stroke-width:1px
    
    style E1 fill:#FF9900,stroke:#333,stroke-width:1px
    style E2 fill:#FF9900,stroke:#333,stroke-width:1px
    style E3 fill:#FF9900,stroke:#333,stroke-width:1px
    
    style F1 fill:#FF9900,stroke:#333,stroke-width:1px
    style F2 fill:#FF9900,stroke:#333,stroke-width:1px
    style F3 fill:#FF9900,stroke:#333,stroke-width:1px
    style F4 fill:#FF9900,stroke:#333,stroke-width:1px
    
    style G1 fill:#FF9900,stroke:#333,stroke-width:1px
    style G2 fill:#FF9900,stroke:#333,stroke-width:1px
    style G3 fill:#FF9900,stroke:#333,stroke-width:1px
    
    style H1 fill:#f9f9f9,stroke:#333,stroke-width:1px
    style H2 fill:#f9f9f9,stroke:#333,stroke-width:1px
```

# Deployment Diagram

This diagram illustrates the AWS serverless deployment setup for our application, showing how all components are deployed and interact in the cloud environment.

## Development Environment
- **Developer Workstation**: Local development environment
- **Git Repository**: Source code version control (GitHub, GitLab, etc.)
- **CI/CD Trigger**: Webhook that initiates the deployment pipeline

## AWS Cloud Infrastructure

### CI/CD Pipeline
- **AWS CodePipeline**: Orchestrates the deployment workflow
- **Source Stage**: Pulls code from the repository
- **Build Stage**: Compiles and bundles the application
- **Test Stage**: Runs automated tests
- **Deploy Stage**: Deploys to production environment

### Frontend Deployment
- **S3 Bucket**: Hosts static Angular assets
- **CloudFront Distribution**: CDN for global content delivery
- **Route 53 DNS**: Domain name management
- **ACM Certificate**: SSL/TLS certificate for HTTPS

### Backend Deployment
- **API Gateway**: RESTful API endpoint management
- **Lambda Functions**: Serverless compute for Express.js API
- **CloudWatch Logs**: Captures application logs
- **CloudWatch Alarms**: Monitors for issues and anomalies

### Database
- **DynamoDB Tables**: NoSQL data storage
- **DynamoDB Auto Scaling**: Automatic capacity adjustment
- **DynamoDB Backups**: Point-in-time recovery

### Security & Authentication
- **Cognito User Pool**: User directory and authentication
- **Cognito Identity Pool**: Federated identity management
- **IAM Roles**: Fine-grained access control
- **API Gateway Authorizers**: JWT token validation

### Monitoring & Operations
- **CloudWatch Dashboard**: Centralized monitoring
- **X-Ray Tracing**: Request tracing and performance analysis
- **SNS Notifications**: Alerts and notifications

## End Users
- **Web Browser**: Desktop access
- **Mobile Browser**: Mobile access

This serverless architecture provides several benefits:
1. **Scalability**: Automatic scaling based on demand
2. **Cost-Efficiency**: Pay only for resources used
3. **Reliability**: High availability across multiple AWS availability zones
4. **Security**: Comprehensive security controls at multiple levels
5. **DevOps Integration**: Streamlined CI/CD pipeline
6. **Reduced Operational Overhead**: No server management required
