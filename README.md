# Marketplace Platform

A modern, full-stack marketplace platform for telecom and IT products, services, and solutions. Built with Next.js 15, oRPC, Better Auth, and Prisma.

## 🚀 Features

### Core Functionality
- **Multi-vendor marketplace** for telecom and IT products
- **Comprehensive product catalog** with detailed specifications
- **Advanced categorization** with sections, categories, and subcategories
- **Vendor management** with verification and onboarding
- **Product showcases** with media support (images, videos, YouTube)
- **Events & webinars** management
- **Pricing management** with multiple currencies (INR, USD, EUR)

### Authentication & User Management
- **Multi-provider authentication** (Google, LinkedIn)
- **Phone number & email OTP** authentication
- **Role-based access control** (admin, vendor, customer)
- **User onboarding flow** with profile completion
- **Session management** with secure cookies

### Product Types Supported
- **AI Solutions** and business platforms
- **Software applications** with multiple pricing plans
- **Network hardware** with detailed specifications
- **Data center** and cloud services
- **Telecom equipment** and services

### Technical Features
- **Type-safe API** with oRPC contracts
- **Real-time updates** with optimistic UI
- **Responsive design** with Tailwind CSS v4
- **Modern UI components** with Radix UI
- **Database ORM** with Prisma and PostgreSQL
- **Edge runtime** support with Vercel

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with App Router and Turbopack
- **React 19** with modern hooks and patterns
- **TypeScript 5** for type safety
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible components
- **Framer Motion** for animations
- **Tanstack Query** for data fetching

### Backend
- **oRPC** for type-safe API contracts
- **Better Auth** for authentication
- **Prisma** with PostgreSQL adapter
- **Neon Database** for serverless PostgreSQL
- **Edge runtime** compatibility

### Development Tools
- **Biome** for linting and formatting
- **Bun** for package management
- **Prisma Studio** for database management
- **TypeScript** with strict mode

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database (Neon recommended)
- Google OAuth credentials (optional)
- LinkedIn OAuth credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd orpc
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Environment setup**
   Create `.env.development` and `.env.production` files with:
   ```env
   DATABASE_URL="postgresql://..."
   BETTER_AUTH_SECRET="your-secret-key"
   BETTER_AUTH_URL="http://localhost:3000"
   AUTH_GOOGLE_CLIENT_ID="your-google-client-id"
   AUTH_GOOGLE_CLIENT_SECRET="your-google-client-secret"
   AUTH_LINKEDIN_CLIENT_ID="your-linkedin-client-id"
   AUTH_LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   bun run db:generate
   
   # Run database migrations
   bun run db:dev:migrate
   
   # (Optional) Open Prisma Studio
   bun run db:dev:studio
   ```

5. **Start development server**
   ```bash
   bun run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (admin)/           # Admin dashboard
│   │   ├── (endpoints)/       # API endpoints
│   │   └── (home)/            # Public pages
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Core utilities and configs
│   ├── server/                # oRPC server implementation
│   ├── hooks/                 # Custom React hooks
│   ├── providers/             # Context providers
│   └── types/                 # TypeScript type definitions
├── prisma/                    # Database schema and migrations
├── generated/                 # Generated Prisma client
└── public/                    # Static assets
```

## 🗄️ Database Schema

The application uses a comprehensive database schema with the following main entities:
- **Users** with role-based access and multi-factor authentication
- **Vendors** with verification and product management
- **Products** with detailed specifications and pricing
- **Categories** with hierarchical organization
- **Showcases** for featured content
- **Events/Webinars** with registration and pricing

## 📜 Available Scripts

```bash
# Development
bun run dev              # Start development server with Turbopack
bun run build            # Build for production
bun run start            # Start production server

# Code Quality
bun run lint             # Check code with Biome
bun run format           # Format code with Biome

# Database Management
bun run db:generate      # Generate Prisma client
bun run db:dev:migrate   # Run migrations (development)
bun run db:dev:push      # Push schema changes (development)
bun run db:dev:studio    # Open Prisma Studio (development)
bun run db:dev:reset     # Reset database (development)
bun run db:prod:migrate  # Deploy migrations (production)
bun run db:prod:studio   # Open Prisma Studio (production)
```

## 🔐 Authentication Flow

1. **Social OAuth** (Google/LinkedIn) for quick registration
2. **Phone number verification** with OTP
3. **Email verification** with OTP (optional)
4. **Onboarding process** for profile completion
5. **Role assignment** (customer, vendor, admin)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy with automatic CI/CD

### Manual Deployment
1. Build the application: `bun run build`
2. Start the production server: `bun run start`

## 📚 Documentation

- [oRPC Documentation](https://orpc.io/) - Type-safe API framework
- [Better Auth Documentation](https://www.better-auth.com/) - Authentication library
- [Prisma Documentation](https://www.prisma.io/docs) - Database ORM
- [Next.js Documentation](https://nextjs.org/docs) - React framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.
