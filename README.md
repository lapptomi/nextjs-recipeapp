
# RecipeApp Pro [![Test And Deploy To Vercel](https://github.com/lapptomi/nextjs-recipeapp/actions/workflows/pipeline.yml/badge.svg)](https://github.com/lapptomi/nextjs-recipeapp/actions/workflows/pipeline.yml)


### Link to application: https://recipeapp.dev
### Web application where users can create, rate, and comment on recipes.  

The idea of this project has been mainly to learn and try out various technologies, such as **Next.js**, **Nest.js** and Amazon Web Services, such as **S3**, **EC2**, **ECS**, **ECR**, **Fargate**, **App Runner**, **Route53** and **CDK**, so the infrastructure might not be the most optimal, such as using external Kotlin backend server with Next.js etc.  


<p float="left">
  <img src="https://github.com/lapptomi/nextjs-recipeapp/blob/main/assets/img1.png?raw=true" width="500">
</p>


## Technologies used
![TS](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=Kotlin&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) 
[![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=Spring&logoColor=white)](#)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=for-the-badge)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)


# Server
<p align="left">
  <a href="https://spring.io/projects/spring-boot" target="blank"><img src="https://spring.io/img/spring.svg" width="150" alt="Spring Logo" /></a>
</p>  

The backend is created with **Kotlin & Spring Boot** and is running on **AWS App Runner**.  

## Server API Documentation
<img src="https://raw.githubusercontent.com/swagger-api/swagger.io/wordpress/images/assets/SWU-logo-clr.png" width="300">

<p float="left">
  <img src="https://github.com/lapptomi/nextjs-recipeapp/blob/main/assets/img2.png?raw=true" width="500">
</p>


### <a href="https://api.nextjs-recipeapp-prod.click/swagger-ui/swagger-ui/index.html" target="_blank">Open SwaggerUI</a>

# Client
<p align="left">
  <a href="http://nextjs.org/" target="blank"><img src="https://seeklogo.com/images/N/next-js-logo-7929BCD36F-seeklogo.com.png" width="150" alt="Next Logo" /></a>
</p>  

The client is created with **TypeScript & NextJS** and is hosted online on Vercel and can be opened via the link above.

# Running the project

### Start the app with Docker Compose
###### Note that you must have Docker installed in your machine   

### Development
The application can be started in development mode by command:  
```
docker-compose -f docker-compose.dev.yml up
```
And going to http://localhost:3000 in your browser.  
The server will start on http://localhost:8080

### Test
The application can be started in testing mode by command:  
```
docker-compose -f docker-compose.test.yml up
```
And going to http://localhost:3000 in your browser.  
The server will start on http://localhost:8080

### Production
The application can be started in production mode by command:  
```
docker-compose up
```
And going to http://localhost:3000 in your browser.  
The server will start on http://localhost:8080

> [!NOTE]  
> **When running in production mode, you'll have to set all the environment variables listed below to **.env** files on the server and client folders**

# Environment Variables

## Backend
The Spring Boot server requires the environment variables listed below:  
```
DATABASE_URL=(JDBC PostgreSQL database host address)
DATABASE_USERNAME=(PostgreSQL database username)
DATABASE_PASSWORD=(PostgreSQL database password)

AWS_BUCKET_NAME=(aws s3 bucket name)
AWS_BUCKET_REGION=(aws s3 bucket region)
AWS_ACCESS_KEY_ID_(aws access key)
AWS_SECRET_ACCESS_KEY=(aws secret access key)
JWT_SECRET_KEY=(secret key for jwt tokens)
```
The environment variables can be set in a **.env** file in the server folder **./server/.env**.

## Client
The Next.js client uses environment variables listed below:  
```
NEXTAUTH_SECRET=(any string)
NEXTAUTH_URL=(URL of the application, for example: https://example.com. <- is needed when hosting the app)
NEXT_APP_API_URL=(address of the Java backend server)
GITHUB_ID=(id for github sign in / authentication)
GITHUB_SECRET=(secret token for github sign in / authentication)
```


# Testing

When the project is up and running locally with docker compose, you can run the Cypress tests by going to the client folder and entering command:  
```
npm run cypress:open
```
or  
```
npm run cypress:run
```

# Database
When running the app locally with docker-compose on development or test mode, you can open pgadmin4 by going to http://localhost:8888 in your browser to view and edit PostgreSQL data easily.  
The credentials can be found from *docker-compose* files.

# Deployment
The project has automated deployment pipelines for production and development environments.
The deployment pipelines will run tests, deploy the backend to AWS, and lastly deploy the Next.js app to Vercel.

### Github Actions
When making changes to the **main** branch, it will trigger Github Actions pipeline to deploy the backend to AWS, and the Next.js app to Vercel prodution environment. But when changes are made in **dev** branch, it will also deploy the backend to AWS, but will deploy the Next.js app to preview environment in Vercel instead of production.

### Manual CDK deployment
The backend can also be deployed manually by running the following command in the **/cdk** folder:  
```
npx cdk deploy
```
