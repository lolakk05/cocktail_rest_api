# 🍹 Cocktail REST API

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://swagger.io/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

## About the project

This is a simple REST API for managing cocktail recipes. It allows you to create, read, update, and delete cocktail recipes. Made for KN Solvro recruitment process.

## 🚀 Technologies
* **Backend:** Node.js, NestJS
* **Database:** PostgreSQL, Prisma ORM
* **Security & Auth:** Passport, JWT, Bcrypt
* **Documentation:** Swagger 
* **File Handling:** Multer 
* **Testing:** Jest, Supertest (E2E Tests)

## ⚙️ Requirements
* Node.js 
* PostgreSQL 

## 🛠️ Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/lolakk05/cocktail_rest_api.git
   ```

2. Instal project dependencies:
   ```bash
   npm install
   ```
   
3. Set up environment variables:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/cocktail_rest_api?schema=public"
    JWT_SECRET="your_super_secret_jwt_key"
    ```
   
4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
   
5. Start the development server:
   ```bash
   npm run start:dev
   ```
   
6. Additionaly, you can seed the database with initial data:
   ```bash
   npm run seed
   ```
   
7. Live time DB monitoring:
   ```bash
   npx prisma studio
   ```

## 📂 Project Structure
* `src/auth` - JWT strategy, guards, and authentication logic.
* `src/users` - User management and profile logic.
* `src/cocktails` - Core logic for managing recipes.
* `src/database` - Prisma service and database seeding scripts.
* `uploads/` - Local storage for ingredient and cocktail images.

## 📚 API Documentation
API documentation is available at **http://localhost:3000/docs** after starting the server.

## 🛠 API Architecture
All endpoints are prefixed with `/api/v1` 

## 🔐 Role System
The API implements two levels of access:
* **User**: Can view profiles, manage their own data, and browse cocktails.
* **Admin**: Full access, including deleting users and managing the entire ingredient database.

## 🔑 Database Diagram

![db_schema.png](db_schema.png)

Author: Karol Stolarczyk
