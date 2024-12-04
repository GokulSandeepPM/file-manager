# File Manager  

File Manager is a web application designed to efficiently manage files. 
This repository contains both the backend and frontend implementations. 
Follow the instructions below to set up and run the project.  

## Table of Contents  
- [Clone the Repository](#clone-the-repository)  
- [Setup Instructions](#setup-instructions)  
  - [Backend](#backend)  
  - [Frontend](#frontend)  
- [Environment Configuration](#environment-configuration)  
  - [Backend](#backend-environment-variables)
- [Database Seeding](#database-seeding)  
- [Running the Application](#running-the-application)  
- [HTTPS Configuration](#https-configuration)  
- [Docker Setup](#docker-setup)  
- [Kubernetes Configuration](#kubernetes-configuration)  

## Clone the Repository  
Clone the repository to your local machine using the following command:  
```bash  
git clone https://github.com/GokulSandeepPM/file-manager.git  
```  

## Setup Instructions  

### Backend  
1. Navigate to the backend folder:  
   ```bash  
   cd file-manager/file-manager-be  
   ```  
2. Install the dependencies:  
   ```bash  
   npm install  
   ```  

### Frontend  
1. Navigate to the frontend folder:  
   ```bash  
   cd file-manager/file-manager-fe  
   ```  
2. Install the dependencies:  
   ```bash  
   npm install  
   ```  

## Environment Configuration  

### Backend Environment Variables  
The backend requires the following configuration in the `.env` file:  

#### AWS S3 Configuration  
```env  
AWS_ACCESS_KEY_ID=<Your AWS Access Key ID>  
AWS_SECRET_ACCESS_KEY=<Your AWS Secret Access Key>  
AWS_S3_BUCKET_NAME=<Your S3 Bucket Name>  
AWS_REGION=<Your AWS Region>  
```  

#### JWT Configuration  
```env  
JWT_SECRET=<Your JWT Secret Key>   
```  

Ensure all the environment variables are set correctly before starting the backend server.  
 

## Database Seeding  
After updating the `.env` file in the backend, you need to run the **seed.js** script to populate the database with initial data:  

1. Navigate to the backend folder:  
   ```bash  
   cd file-manager/file-manager-be  
   ```  
2. Run the seed script:  
   ```bash  
   node seed/seed.js  
   ```  

This will insert necessary entries into the database, such as initial user roles and sample documents.  

## Running the Application  
This project runs exclusively on **HTTPS**. Ensure your SSL keys are correctly configured:  
- Backend keys: `file-manager-be/keys`  
- Frontend keys: `file-manager-fe/keys`  

Place the appropriate keys in their respective directories before starting the application.  

## Docker Setup  
The project includes Docker support for both the frontend and backend.  

### Building and Running with Docker  
1. Build and run the Docker containers using the provided `Dockerfile` in each directory:  
   - **Frontend:** `file-manager-fe/Dockerfile`  
   - **Backend:** `file-manager-be/Dockerfile`  
2. Alternatively, use `docker-compose.yml` to orchestrate both services:  
   ```bash  
   docker-compose up  
   ```  

This will spin up the frontend and backend services together.  

## Kubernetes Configuration  
The `k8s` folder contains Kubernetes deployment and service configuration files. Use these files to deploy the application in a Kubernetes cluster:  
```bash  
kubectl apply -f k8s/  
```  

Ensure your cluster is properly configured to support HTTPS, and update the ingress settings if necessary.  

---  