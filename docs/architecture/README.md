# Angular + Node.js/Express AWS Serverless Architecture

This directory contains architectural diagrams for a full-stack web application built with Angular for the frontend and Node.js with Express.js for the backend. The system uses AWS DynamoDB as the database and is deployed using AWS Serverless services.

## Available Diagrams

1. [Overall Architecture Diagram](./overall-architecture.md) - Shows the complete system architecture including all major components and their interactions.

2. [Component Diagram](./component-diagram.md) - Breaks down the application into key components, showing the internal structure of both frontend and backend.

3. [Deployment Diagram](./deployment-diagram.md) - Illustrates the AWS serverless deployment setup, including CI/CD pipeline and security components.

## Viewing the Diagrams

These diagrams are created using Mermaid, a markdown-based diagramming tool. To view them:

1. Open the markdown files in a Mermaid-compatible markdown viewer
2. Use GitHub's built-in Mermaid rendering (if viewing on GitHub)
3. Copy the Mermaid code into an online Mermaid editor like [Mermaid Live Editor](https://mermaid.live/)

## Architecture Overview

This architecture follows modern best practices for cloud-native applications:

- **Serverless First**: Eliminates server management and scales automatically
- **Microservices Approach**: Decoupled components with clear responsibilities
- **Infrastructure as Code**: Entire infrastructure can be defined and deployed via code
- **CI/CD Integration**: Automated testing and deployment pipeline
- **Security by Design**: Authentication, authorization, and encryption at multiple levels

## Key AWS Services Used

- **Frontend**: S3, CloudFront, Route 53, ACM
- **API Layer**: API Gateway, Lambda
- **Backend**: Lambda, Express.js
- **Database**: DynamoDB
- **Authentication**: Cognito
- **CI/CD**: CodePipeline, CodeBuild
- **Monitoring**: CloudWatch, X-Ray

## Benefits of This Architecture

1. **Scalability**: Automatically scales based on demand
2. **Cost Efficiency**: Pay-per-use model with no idle resources
3. **High Availability**: Distributed across multiple availability zones
4. **Security**: Comprehensive security at all layers
5. **Developer Productivity**: Focus on code, not infrastructure
6. **Operational Excellence**: Reduced operational overhead
