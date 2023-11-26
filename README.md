# Nextjs Recipe App  [![Deploy To Vercel](https://github.com/lapptomi/nextjs-recipeapp/actions/workflows/fly.yml/badge.svg)](https://github.com/lapptomi/nextjs-recipeapp/actions/workflows/fly.yml)

*Web application written in Typescript to learn and try out [Next.js](https://nextjs.org/).*

## Technologies used  

![TS](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL Badge](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=for-the-badge)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?logo=jest&logoColor=fff&style=for-the-badge)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Material UI](https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=mui&logoColor=white)


# App hosted on Vercel
### [View Hosted Application](https://nextjs-recipeapp.vercel.app/)


# Running app locally  

### Start the app with Docker Compose
###### Note that you must have Docker installed in your machine   


### Development
The application can be started in development mode by command:  
```
docker-compose -f docker-compose.dev.yml up
```
And going to http://localhost:3000 in your browser.

### Production
The application can be started in production mode by command:  
```
docker-compose up
```  
And going to http://localhost:3000 in your browser.


### Database
To view view and edit PostgreSQL data easily, you can open Prisma studio by command:  
```
npx prisma studio
```  
And opening http://localhost:5555 in your browser.


# Environment Variables
This application uses environment variables listed below:  
```
DATABASE_URL=(SQL database url, uses SQLite by default = "file:./dev.db"  )
NEXTAUTH_SECRET=(any string)
NEXTAUTH_URL=(any string for Fly.io)
AWS_BUCKET_NAME=(aws s3 bucket name)
AWS_BUCKET_REGION=(aws s3 bucket region)
AWS_ACCESS_KEY_ID_(aws access key)
AWS_SECRET_ACCESS_KEY=(aws secret access key)
```

# Info

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

