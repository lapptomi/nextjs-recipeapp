# Nextjs Recipe App [![Deploy To Vercel](https://github.com/lapptomi/nextjs-recipeapp/actions/workflows/pipeline.yml/badge.svg)](https://github.com/lapptomi/nextjs-recipeapp/actions/workflows/pipeline.yml)
**Full Stack Web application where users can create, rate, and comment on recipes.**

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
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)


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
When running the project in testing mode you don't have to set any **.env** variables.  

  
The application can be started in testing mode by command:  
```
docker-compose -f docker-compose.test.yml up
```
This will start PostgreSQL and Next production build made for testing purposes.  
After that you can run the Cypress tests with command:  
```
npm run cypress:open
```
or  
```
npm run cypress:run
```

### Production
The application can be started in production mode by command:  
```
npm run build && npm start
```  
And going to http://localhost:3000 in your browser.  
***DATABASE_URL*** in ***.env*** file is needed for the ***npm run build*** command to work.

### Database
To view view and edit PostgreSQL data easily, you can open Prisma studio by command:  
```
npx prisma studio
```  
And opening http://localhost:5555 in your browser.  
This will open an edit view for the database that you have set in **.env DATABASE_URL**.

# Environment Variables
This application uses environment variables listed below:  
```
DATABASE_URL=(PostgreSQL database url)
NEXTAUTH_SECRET=(any string)
NEXTAUTH_URL=(URL of the application, for example: https://example.com. <- is needed when hosting the app)
AWS_BUCKET_NAME=(aws s3 bucket name)
AWS_BUCKET_REGION=(aws s3 bucket region)
AWS_ACCESS_KEY_ID_(aws access key)
AWS_SECRET_ACCESS_KEY=(aws secret access key)
```

# Info

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

