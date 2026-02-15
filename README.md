<div align="center">

# RecipeApp Pro 
### https://recipeapp.dev


[![Test And Deploy To Vercel](https://github.com/lapptomi/nextjs-recipeapp/actions/workflows/pipeline.yml/badge.svg)](https://github.com/lapptomi/nextjs-recipeapp/actions/workflows/pipeline.yml)

**A full-stack web application for creating, rating, and sharing recipes**

[Live Demo](https://recipeapp.dev) • [API Documentation](https://api.nextjs-recipeapp-prod.click/swagger-ui/swagger-ui/index.html) • [Report Bug](https://github.com/lapptomi/nextjs-recipeapp/issues)

<img src="https://github.com/lapptomi/nextjs-recipeapp/blob/main/assets/1.png?raw=true" width="700" alt="RecipeApp Screenshot" style="box-shadow: 0 4px 20px 4px rgba(0,0,0,0.25); border-radius: 8px;">

</div>

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)

---

## 🎯 About

RecipeApp Pro is a full-stack web application where users can discover, create, rate, and comment on recipes. Built as a learning project to explore modern web technologies and cloud infrastructure.

**Key Highlights:**
- Modern full-stack architecture with Next.js 16 & Spring Boot
- OAuth authentication (GitHub, Google, Credentials)
- Cloud-native deployment on AWS & Vercel
- Automated CI/CD pipelines with GitHub Actions
- End-to-end testing with Cypress

> **Note:** This project emphasizes learning and experimentation with various technologies (Next.js, Kotlin/Spring Boot, AWS services like S3, EC2, ECS, ECR, Fargate, App Runner, Route53, and CDK).

---

## ✨ Features

- 🔐 **Authentication** - Email, GitHub, and Google sign-in
- 📝 **Recipe Management** - Create, edit, and share recipes
- ⭐ **Rating System** - Like/dislike recipes
- 💬 **Comments** - Community discussions
- 🖼️ **Image Upload** - AWS S3 integration
- 👤 **User Profiles** - View profiles and their recipes
- 🔍 **Search & Filter** - Find recipes easily
- 📱 **Responsive Design** - Mobile-friendly UI

---

## 🛠️ Tech Stack

**Frontend:** Next.js 16 • React 19 • TypeScript • Material-UI v7 • Tailwind CSS  
**Backend:** Kotlin • Spring Boot • PostgreSQL  
**DevOps:** Docker • AWS (App Runner, S3) • GitHub Actions • Cypress

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TS](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=Kotlin&logoColor=white)
![Spring Boot](https://img.shields.io/badge/SpringBoot-6DB33F?style=for-the-badge&logo=Spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=fff&style=for-the-badge)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

---

## 🏗️ Architecture

**Frontend:** Next.js 16 with React 19, hosted on Vercel  
**Backend:** Kotlin/Spring Boot REST API on AWS App Runner  
**Database:** PostgreSQL (AWS RDS or local Docker)  
**Storage:** AWS S3 for recipe images  
**CI/CD:** GitHub Actions → AWS & Vercel

<pre>
┌─────────────────┐
│      Vercel     │ ← Next.js Frontend
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AWS App Runner │ ← Spring Boot API
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌──────┐  ┌─────┐
│  RDS │  │ S3  │ ← PostgreSQL & Recipe Images
└──────┘  └─────┘
</pre>

---

## 🚀 Getting Started

### Prerequisites

- **Docker** (v20+) & **Docker Compose** - [Install Docker](https://docs.docker.com/get-docker/)
- **Node.js** (v18+) - For local development
- **AWS Account** - For S3 and deployment (optional for local dev)
- **OAuth Apps** - GitHub/Google credentials for social login (optional)

### Quick Start

**1. Clone the repository**
```bash
git clone https://github.com/lapptomi/nextjs-recipeapp.git
cd nextjs-recipeapp
```

**2. Start in development mode**
```bash
docker compose -f docker-compose.dev.yml up
```

**3. Open in browser**
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- pgAdmin: http://localhost:8888

That's it! 🎉

### Other Modes

**Test mode:**
```bash
docker compose -f docker-compose.test.yml up
```

**Production mode:**
```bash
docker compose up
```

> [!IMPORTANT]  
> Production mode requires environment variables. See [Environment Variables](#-environment-variables) section.

---

## 🔐 Environment Variables

### Backend (Spring Boot)

Create `server/.env`:

```bash
# Database Configuration
DATABASE_URL=(JDBC PostgreSQL database host address)
DATABASE_USERNAME=(PostgreSQL database username)
DATABASE_PASSWORD=(PostgreSQL database password)

# AWS S3 Configuration
AWS_BUCKET_NAME=(aws s3 bucket name)
AWS_BUCKET_REGION=(aws s3 bucket region)
AWS_ACCESS_KEY_ID_(aws access key)
AWS_SECRET_ACCESS_KEY=(aws secret access key)

# Security
JWT_SECRET_KEY=(secret key for jwt tokens)
```

<details>
<summary>Example configuration</summary>

```bash
DATABASE_URL=jdbc:postgresql://localhost:5432/recipeapp
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=secretpassword
AWS_BUCKET_NAME=my-recipe-images
AWS_BUCKET_REGION=us-east-1
AWS_ACCESS_KEY_ID_=AKIA...
AWS_SECRET_ACCESS_KEY=wJalr...
JWT_SECRET_KEY=your-secure-random-string
```
</details>

---

### Client (Next.js)

Create `client/.env.local`:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=(any string)
NEXTAUTH_URL=(URL of the application, for example: https://example.com. <- is needed when hosting the app)

# Backend API
NEXT_APP_API_URL=(address of the Java backend server)

# OAuth Providers (GitHub)
GITHUB_ID=(id for github sign in / authentication)
GITHUB_SECRET=(secret token for github sign in / authentication)

# OAuth Providers (Google)
GOOGLE_ID=(google oauth client id)
GOOGLE_SECRET=(google oauth client secret)

# Middleware.tsx
CF_EDGE_SECRET=(any string to check that the requests are coming from cloudflare, but have to be the same as the one in cloudflare request headers)
SKIP_COUNTRY_CHECK=(true or false, check if the requests are from finland or not)
```

<details>
<summary>Example configuration</summary>

```bash
NEXTAUTH_SECRET=any-random-string-here-min-32-chars
NEXTAUTH_URL=http://localhost:3000
NEXT_APP_API_URL=http://localhost:8080
GITHUB_ID=Iv1.abc123...
GITHUB_SECRET=abc123...
GOOGLE_ID=123456-abc.apps.googleusercontent.com
GOOGLE_SECRET=GOCSPX-abc123...
```
</details>

> [!TIP]  
> For local development with Docker Compose, these are mostly pre-configured. Only required for production or when running outside Docker.

---

## 🧪 Testing

### Cypress E2E Tests

Ensure the app is running, then:

**Interactive mode:**
```bash
cd client
npm run cypress:open
```

**Headless mode (CI/CD):**
```bash
cd client
npm run cypress:run
```

**Test Coverage:**
- User registration and login
- Recipe creation and viewing
- Profile pages
- OAuth authentication
- Comments and ratings

---

## 🗄️ Database Management

When running in **dev** or **test** mode, pgAdmin4 is available at http://localhost:8888

**Features:** Visual explorer • SQL editor • Table management • Connection monitoring

**Credentials:** Found in `docker-compose.dev.yml` or `docker-compose.test.yml`

---

## 📚 API Documentation

<div align="center">

### [📖 Open SwaggerUI Documentation](https://api.nextjs-recipeapp-prod.click/swagger-ui/swagger-ui/index.html)

<img src="https://github.com/lapptomi/nextjs-recipeapp/blob/main/assets/img2.png?raw=true" width="600" alt="Swagger API Documentation">

</div>

The Spring Boot backend API is fully documented with **OpenAPI 3.0 / Swagger**.

**Available Endpoints:**
- `/auth/*` - Authentication (login, register, social login)
- `/users/*` - User management
- `/recipes/*` - Recipe CRUD operations
- `/recipes/{id}/comments` - Comment management
- `/recipes/{id}/ratings` - Rating system

---

## 🚀 Deployment

### Automated CI/CD with GitHub Actions

**Production Pipeline (`main` branch):**
1. Run tests (Cypress E2E, backend unit tests)
2. Build and deploy backend to AWS App Runner
3. Deploy Next.js app to Vercel Production

**Development Pipeline (`dev` branch):**
1. Run tests
2. Deploy backend to AWS App Runner (dev)
3. Deploy Next.js app to Vercel Preview

**Workflow files:**
- `.github/workflows/pipeline.yml` - Production
- `.github/workflows/dev-pipeline.yml` - Development

---

### Manual CDK Deployment

Deploy backend infrastructure to AWS:

```bash
cd cdk
npx cdk deploy
```

**What gets deployed:** AWS App Runner • VPC • IAM roles • CloudFormation stacks

**Prerequisites:** AWS CLI configured • CDK CLI installed • IAM permissions


</div>
