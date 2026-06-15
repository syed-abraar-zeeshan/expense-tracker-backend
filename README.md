# Expense Tracker API

A production-ready REST API built with Node.js, Express.js, MongoDB Atlas, and JWT Authentication.

## Features

- JWT Authentication
- Password Reset via Email
- Expense CRUD Operations
- Dashboard Analytics APIs
- Input Validation using Zod
- Rate Limiting
- Helmet Security Headers
- Compression Middleware
- Structured Logging with Pino
- MongoDB Atlas Integration
- AWS EC2 Deployment
- PM2 Process Management
- Nginx Reverse Proxy

## Tech Stack

Node.js • Express.js • MongoDB Atlas • Mongoose • JWT • Zod • Pino • PM2 • Nginx • AWS EC2

## Architecture

Flutter App
↓
Nginx
↓
PM2
↓
Node.js / Express.js
↓
MongoDB Atlas

## API Endpoints

| Method | Endpoint                        | Access  |
| ------ | ------------------------------- | ------- |
| POST   | /api/auth/register              | Public  |
| POST   | /api/auth/login                 | Public  |
| POST   | /api/auth/forgot-password       | Public  |
| PUT    | /api/auth/reset-password/:token | Public  |
| GET    | /api/auth/profile               | Private |
| GET    | /api/expenses                   | Private |
| POST   | /api/expenses                   | Private |
| GET    | /api/expenses/:id               | Private |
| PUT    | /api/expenses/:id               | Private |
| DELETE | /api/expenses/:id               | Private |
| GET    | /api/dashboard                  | Private |

## Local Setup

```bash
git clone <repo-url>
cd expense-tracker-backend
npm install
```

Create a `.env` file:

```env
PORT=4000
MONGO_URI=
JWT_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

Run the application:

```bash
npm start
```

## Deployment

- AWS EC2
- Elastic IP
- PM2
- Nginx Reverse Proxy
- MongoDB Atlas

## Author

Syed Abraar Zeeshan

Flutter Developer (4+ Years) | Flutter Full Stack Developer

GitHub:
https://github.com/syed-abraar-zeeshan
