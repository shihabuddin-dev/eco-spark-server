# EcoSpark Hub - Server API

[![Live API](https://img.shields.io/badge/Live%20API-View%20API-green?style=for-the-badge&logo=vercel)](https://eco-spark-server.vercel.app/)
[![Client App](https://img.shields.io/badge/Client%20App-Visit%20Site-blue?style=for-the-badge&logo=vercel)](https://eco-spark-client.vercel.app/)
[![License](https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 🌟 Overview

**EcoSpark Hub Server** is the robust backend API that powers the EcoSpark Hub platform. Built with modern technologies and best practices, this server handles all the business logic, data management, authentication, and payment processing for the decentralized sustainability portal.

### 🎯 Purpose

The server provides a comprehensive REST API that enables the frontend client to manage users, ideas, payments, and administrative functions while ensuring data integrity, security, and scalability.

### 🚀 Key Features

#### Authentication & Authorization
- **Multi-provider Authentication**: Support for email/password and Google OAuth
- **JWT Token Management**: Secure session handling with refresh tokens
- **Role-based Access Control**: Different permissions for members and administrators
- **User Status Management**: Active/deactivated user states

#### Idea Management
- **CRUD Operations**: Full lifecycle management of sustainability ideas
- **Status Workflow**: Draft → Under Review → Approved/Rejected
- **Category Organization**: Structured categorization of ideas
- **Media Upload Support**: Multiple image handling for idea visualization
- **Admin Feedback System**: Review comments and approval workflow

#### Community Features
- **Voting System**: Democratic support mechanism for ideas
- **Comment System**: Discussion threads for each idea
- **User Engagement Tracking**: Analytics on user interactions

#### Payment Integration
- **Stripe Integration**: Secure payment processing
- **Premium Ideas**: Monetization support for detailed implementation guides
- **Transaction History**: Complete payment tracking and records

#### Administrative Tools
- **User Management**: Admin controls for user accounts
- **Content Moderation**: Idea approval and rejection workflows
- **Analytics**: Platform metrics and reporting
- **Newsletter Management**: Email subscription handling

#### Communication
- **Email Notifications**: Automated emails using Nodemailer
- **Newsletter System**: Subscription management and campaigns

## 🛠️ Technology Stack

### Runtime & Framework
- **Node.js** - JavaScript runtime environment
- **Express.js 5.2.1** - Fast, unopinionated web framework
- **TypeScript 5.9.3** - Type-safe JavaScript

### Database & ORM
- **PostgreSQL** - Advanced open-source relational database
- **Prisma 7.5.0** - Next-generation ORM for TypeScript & Node.js
- **@prisma/adapter-pg 7.5.0** - PostgreSQL adapter for Prisma
- **@prisma/client 7.5.0** - Auto-generated database client

### Authentication & Security
- **Better Auth 1.5.6** - Modern authentication library
- **bcrypt 6.0.0** - Password hashing
- **jsonwebtoken 9.0.3** - JWT token handling
- **CORS 2.8.6** - Cross-origin resource sharing

### Payment Processing
- **Stripe 21.0.0** - Payment processing platform

### Communication
- **Nodemailer 8.0.4** - Email sending library
- **@types/nodemailer 7.0.11** - TypeScript definitions for Nodemailer

### Utilities
- **Zod 4.3.6** - TypeScript-first schema validation
- **http-status 2.1.0** - HTTP status codes utility
- **dotenv 17.3.1** - Environment variable management

### Development & Build Tools
- **tsx 4.21.0** - TypeScript execution and REPL
- **tsup 8.5.1** - Bundle your TypeScript library
- **ESLint 10.0.3** - Code linting
- **typescript-eslint 8.57.1** - ESLint rules for TypeScript

## 📁 Project Structure

```
eco-spark-server/
├── api/                    # Built API files (generated)
├── prisma/
│   ├── migrations/         # Database migration files
│   ├── schema/             # Prisma schema files
│   │   ├── schema.prisma   # Main schema configuration
│   │   ├── user.prisma     # User model
│   │   ├── idea.prisma     # Idea model
│   │   ├── category.prisma # Category model
│   │   ├── comment.prisma  # Comment model
│   │   ├── vote.prisma     # Vote model
│   │   ├── payment.prisma  # Payment model
│   │   ├── newsletter.prisma # Newsletter model
│   │   ├── session.prisma  # Session model
│   │   ├── account.prisma  # Account model
│   │   └── verification.prisma # Verification model
│   └── prisma.config.ts    # Prisma configuration
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── app/
│   │   ├── config/         # Application configuration
│   │   ├── errorHelpers/   # Error handling utilities
│   │   ├── interfaces/     # TypeScript interfaces
│   │   ├── lib/            # Core libraries
│   │   ├── middleware/     # Express middleware
│   │   ├── module/         # Application modules
│   │   ├── routes/         # API route handlers
│   │   ├── shared/         # Shared utilities
│   │   └── utils/          # Utility functions
│   └── generated/          # Auto-generated Prisma client
├── cleanup_ideas.ts        # Data cleanup script
├── eslint.config.mjs       # ESLint configuration
├── ideas_data.json         # Sample ideas data
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tsup.config.ts          # Build configuration
└── vercel.json             # Vercel deployment config
```

## 🗄️ Database Schema

### Core Models

#### User Model
```prisma
enum Role {
  MEMBER
  ADMIN
}

enum UserStatus {
  ACTIVE
  DEACTIVATED
}

model User {
  id           String     @id @default(uuid())
  name         String
  email        String     @unique
  emailVerified Boolean    @default(false)
  image         String?
  password      String?
  role          Role       @default(MEMBER)
  status        UserStatus @default(ACTIVE)
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt

  sessions Session[]
  accounts Account[]
  ideas    Idea[]
  votes    Vote[]
  comments Comment[]
  payments Payment[]
}
```

#### Idea Model
```prisma
enum IdeaStatus {
  DRAFT
  UNDER_REVIEW
  APPROVED
  REJECTED
}

model Idea {
  id               String     @id @default(uuid())
  title            String
  problemStatement String
  proposedSolution String
  description      String
  images           String[]
  isPaid           Boolean    @default(false)
  price            Float?
  status           IdeaStatus @default(DRAFT)
  adminFeedback    String?

  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])

  authorId String
  author   User   @relation(fields: [authorId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  votes    Vote[]
  comments Comment[]
  payments Payment[]
}
```

#### Additional Models
- **Category**: Idea categorization
- **Comment**: Discussion system
- **Vote**: Support mechanism
- **Payment**: Transaction records
- **Newsletter**: Email subscriptions
- **Session**: Authentication sessions
- **Account**: OAuth provider accounts
- **Verification**: Email verification tokens

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 18 or higher)
- **PostgreSQL** database
- **pnpm** (recommended) or npm/yarn
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eco-spark-server
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/ecospark_db"
   JWT_SECRET="your-super-secret-jwt-key"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   STRIPE_SECRET_KEY="your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASS="your-email-password"
   FRONTEND_URL="https://eco-spark-client.vercel.app"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   pnpm generate

   # Run database migrations
   pnpm migrate

   # (Optional) Seed the database
   pnpm seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

The server will start on `http://localhost:3001` (or configured port).

### Build for Production

```bash
pnpm build
pnpm start
```

## 📡 API Endpoints

### Authentication Routes
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### User Management
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Idea Management
- `GET /api/ideas` - Get all ideas (with filtering)
- `GET /api/ideas/:id` - Get idea by ID
- `POST /api/ideas` - Create new idea
- `PUT /api/ideas/:id` - Update idea
- `DELETE /api/ideas/:id` - Delete idea
- `POST /api/ideas/:id/vote` - Vote on idea
- `POST /api/ideas/:id/comment` - Comment on idea

### Category Management
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Payment Processing
- `POST /api/payments/create-session` - Create Stripe payment session
- `GET /api/payments/success` - Payment success callback
- `GET /api/payments/cancel` - Payment cancel callback
- `GET /api/payments/history` - Get user payment history

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter

### Administrative Routes
- `GET /api/admin/stats` - Get platform statistics
- `PUT /api/admin/ideas/:id/status` - Update idea status
- `GET /api/admin/users` - Get user management data

## 🔧 Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm start` - Start production server
- `pnpm build` - Build the application for production
- `pnpm lint` - Run ESLint for code linting
- `pnpm migrate` - Run Prisma migrations
- `pnpm generate` - Generate Prisma client
- `pnpm studio` - Open Prisma Studio
- `pnpm push` - Push schema changes to database
- `pnpm pull` - Pull database schema
- `pnpm seed` - Seed database with initial data

## 🌐 Deployment

The API is deployed on Vercel and can be accessed at:
- **Live API**: https://eco-spark-server.vercel.app/

### Deployment Steps

1. **Connect to Vercel**
   - Import your GitHub repository to Vercel
   - Set the root directory to `eco-spark-server`

2. **Build Settings**
   - Build Command: `pnpm build`
   - Output Directory: `api`
   - Install Command: `pnpm install`

3. **Environment Variables**
   Set all required environment variables in your Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `FRONTEND_URL`

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured cross-origin policies
- **Input Validation**: Zod schema validation for all inputs
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **Rate Limiting**: Built-in request rate limiting
- **HTTPS Enforcement**: SSL/TLS encryption in production

## 📊 Monitoring & Analytics

- **Error Logging**: Comprehensive error tracking and logging
- **Performance Monitoring**: Response time and throughput metrics
- **Database Query Optimization**: Efficient Prisma queries
- **User Activity Tracking**: Analytics on user engagement

## 🤝 Contributing

We welcome contributions to the EcoSpark Hub Server! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update API documentation for new endpoints
- Ensure all linting checks pass
- Follow REST API conventions

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer Information

**Developed by: Shihab Uddin**

- **Portfolio**: [https://shihab-dev.web.app/](https://shihab-dev.web.app/)
- **LinkedIn**: [https://www.linkedin.com/in/shihab-dev](https://www.linkedin.com/in/shihab-dev)
- **Facebook**: [https://www.facebook.com/shihab.dev](https://www.facebook.com/shihab.dev)

## 🙏 Acknowledgments

- Thanks to the Prisma team for the amazing ORM
- Gratitude to the Express.js community
- Special thanks to environmental technology innovators
- Appreciation to all contributors and beta testers

## 📞 Support

For API support or questions, please contact the development team or create an issue in the repository.

---

**EcoSpark Hub Server** - Powering Sustainability Innovation 🌍