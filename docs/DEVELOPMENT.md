# Development Guide - D'iLeon Energy Sourcing Corp

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Initial Setup

```bash
# Clone and setup
git clone <https://github.com/leulged/D-iLeon-Energy-Sourcing-Corp.git>


# Install all dependencies
npm run install:all

# Setup environment files
cp server/.env.example server/.env
cp client/.env.example client/.env.local

# Start development servers
npm run dev
```

## 📁 Project Structure

### Root Level

```
dileon-platform/
├── client/                 # Next.js frontend
├── server/                 # Node.js backend
├── docs/                   # Documentation
├── infra/                  # Deployment configs
├── package.json           # Root package.json
└── README.md              # Project overview
```

### Frontend (client/)

```
client/
├── app/                   # Next.js 14 app router
│   ├── (auth)/           # Authentication routes
│   ├── (dashboard)/      # Dashboard routes
│   ├── api/              # API routes (if needed)
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   └── features/        # Feature-specific components
├── lib/                 # Utilities and helpers
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

### Backend (server/)

```
server/
├── src/
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose models
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   └── types/           # TypeScript types
├── tests/               # Test files
└── dist/                # Build output
```

## 🛠️ Development Workflow

### 1. Starting Development

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:client    # Frontend only (port 3000)
npm run dev:server    # Backend only (port 5000)
```

### 2. Making Changes

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test your changes: `npm run test`
4. Lint your code: `npm run lint`
5. Commit with conventional commits: `git commit -m "feat: add user authentication"`

### 3. Testing

```bash
# Run all tests
npm run test

# Run specific tests
npm run test:client
npm run test:server

# Run tests in watch mode
cd client && npm run test:watch
cd server && npm run test:watch
```

### 4. Building for Production

```bash
# Build both projects
npm run build

# Build individually
npm run build:client
npm run build:server
```

## 📝 Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all data structures
- Use type guards for runtime type checking
- Prefer `interface` over `type` for object shapes

### React/Next.js

- Use functional components with hooks
- Implement proper error boundaries
- Use React.memo for performance optimization
- Follow Next.js 14 app router conventions

### Node.js/Express

- Use async/await for all async operations
- Implement proper error handling middleware
- Use Joi or Zod for request validation
- Follow RESTful API conventions

### Database (MongoDB/Mongoose)

- Use proper indexing for performance
- Implement data validation in schemas
- Use transactions for critical operations
- Follow naming conventions for collections

## 🔐 Authentication & Authorization

### User Roles

- **Buyer**: Can view seller listings, initiate deals
- **Seller**: Can create listings, manage inventory
- **Admin**: Full platform access, user management
- **Compliance**: Document verification, sanctions screening

### JWT Implementation

```typescript
// Token structure
interface JWTPayload {
  userId: string;
  email: string;
  role: "buyer" | "seller" | "admin" | "compliance";
  permissions: string[];
  iat: number;
  exp: number;
}
```

## 📊 Database Schema

### Core Collections

- `users` - User accounts and profiles
- `companies` - Company information
- `listings` - Oil/trading listings
- `deals` - Deal tracking and status
- `documents` - File storage and metadata
- `messages` - Internal communication
- `payments` - Payment records

### Relationships

- Users belong to Companies
- Listings belong to Sellers (Users)
- Deals connect Buyers and Sellers
- Documents are linked to Deals/Users

## 🧪 Testing Strategy

### Unit Tests

- Test individual functions and components
- Mock external dependencies
- Use Jest for backend, React Testing Library for frontend

### Integration Tests

- Test API endpoints
- Test database operations
- Use supertest for API testing

### E2E Tests

- Test complete user workflows
- Use Cypress for frontend testing
- Test critical business paths

### Test Coverage

- Aim for 80%+ coverage
- Focus on business logic
- Test error scenarios

## 🔧 Environment Configuration

### Backend Environment (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dileon
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Frontend Environment (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### Backend (Render/Heroku)

1. Connect repository to deployment platform
2. Set environment variables
3. Configure build command: `npm run build`
4. Set start command: `npm run start`

## 📋 API Documentation

### Base URL

- Development: `http://localhost:5000/api`
- Production: `https://api.dileon.com/api`

### Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <jwt-token>
```

### Common Response Format

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 Debugging

### Frontend Debugging

- Use React DevTools
- Check browser console for errors
- Use Next.js debug mode: `DEBUG=* npm run dev`

### Backend Debugging

- Use Node.js debugger: `node --inspect server.js`
- Check server logs
- Use MongoDB Compass for database inspection

### Common Issues

1. **CORS errors**: Check backend CORS configuration
2. **JWT errors**: Verify token expiration and secret
3. **Database connection**: Check MongoDB URI and network
4. **File uploads**: Verify AWS credentials and bucket permissions

## 📚 Resources

### Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

### Tools

- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code Extensions](https://marketplace.visualstudio.com/) - Development tools

---

**Remember**: Always follow security best practices and test thoroughly before deploying to production!
