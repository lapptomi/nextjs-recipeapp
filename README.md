# RecipeApp Pro [![Deploy To Vercel](https://github.com/lapptomi/nextjs-recipeapp/actions/workflows/pipeline.yml/badge.svg)](https://github.com/lapptomi/nextjs-recipeapp/actions/workflows/pipeline.yml)
**Full Stack Web application where users can create, rate, and comment on recipes.**

The backend is created with **Java & Spring boot** and the client is created with **Typescript & Next.js**.

## Technologies used  

![TS](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) 
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=for-the-badge)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![cypress](https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e)![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=flat-square&logo=Spring&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)



# Getting Started

### Start the app with Docker Compose
###### Note that you must have Docker installed in your machine   

### Development
The application can be started in development mode by command:  
```
docker-compose up
```
And going to http://localhost:3000 in your browser.  

### Testing
  
The application can be started in testing mode by command:  
```
docker-compose -f docker-compose.test.yml up
```

After that you can run the Cypress tests with command:  
```
npm run cypress:open
```
or  
```
npm run cypress:run
```

### Database
To view and edit PostgreSQL data easily, you can open pgadmin4 by going to http://localhost:8888 in your browser.  
The credentials can be found from *docker-compose.yml* file.

# Environment Variables

## Backend
The Java Spring Boot server uses the environment variables listed below:  
```
DATABASE_URL=(PostgreSQL database url in jdbc format)
DATABASE_USERNAME=(PostgreSQL database username)
DATABASE_PASSWORD=(PostgreSQL database password)
AWS_BUCKET_NAME=(aws s3 bucket name)
AWS_BUCKET_REGION=(aws s3 bucket region)
AWS_ACCESS_KEY_ID_(aws access key)
AWS_SECRET_ACCESS_KEY=(aws secret access key)
```

## Client
The Next.js client uses environment variables listed below:  
```
NEXTAUTH_SECRET=(any string)
NEXTAUTH_URL=(URL of the application, for example: https://example.com. <- is needed when hosting the app)
NEXT_APP_API_URL=(address of the Java backend server)
```
