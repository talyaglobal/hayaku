# Deployment Guide

## Overview
Comprehensive deployment guide for the Hayaku luxury e-commerce platform. This guide covers production deployment on Vercel with Supabase backend, environment configuration, and monitoring setup.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [Environment Configuration](#environment-configuration)
4. [Vercel Deployment](#vercel-deployment)
5. [Domain Configuration](#domain-configuration)
6. [Security Setup](#security-setup)
7. [Performance Optimization](#performance-optimization)
8. [Monitoring & Analytics](#monitoring--analytics)
9. [CI/CD Pipeline](#cicd-pipeline)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- ✅ [Vercel Account](https://vercel.com) (for hosting)
- ✅ [Supabase Account](https://supabase.com) (for database & auth)
- ✅ [Stripe Account](https://stripe.com) (for payments)
- ✅ [GitHub Account](https://github.com) (for source code)
- ✅ Custom domain (optional but recommended)

### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/your-username/hayaku.git
cd hayaku

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Start development server
npm run dev
```

### Required Tools
- Node.js 18+ 
- npm or yarn
- Git
- Vercel CLI (optional)

---

## Database Setup

### 1. Create Supabase Project
1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Choose organization and set project details:
   - **Name**: `hayaku-production`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your target audience
4. Wait for project creation (2-3 minutes)

### 2. Database Schema Setup
1. Go to **SQL Editor** in Supabase Dashboard
2. Run the database setup script from `DATABASE-SETUP-GUIDE.md`
3. Verify tables are created successfully

### 3. Storage Configuration
```sql
-- Enable storage for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

-- Create storage policies
CREATE POLICY "Public product images" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Admin upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'products');
```

### 4. Authentication Setup
1. Go to **Authentication** → **Settings**
2. Configure providers (Email, Google OAuth, etc.)
3. Set site URL: `https://your-domain.com`
4. Configure email templates

---

## Environment Configuration

### 1. Environment Variables
Create production environment variables in your deployment platform:

#### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

#### Site Configuration
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=Hayaku
NEXT_PUBLIC_APP_DESCRIPTION=Luxury E-commerce Platform
```

#### Stripe Configuration
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Email Configuration (SMTP)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=admin@your-domain.com
```

#### Security Configuration
```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-nextauth-secret
JWT_SECRET=your-jwt-secret
```

### 2. Environment Files Structure
```
.env.local              # Local development (gitignored)
.env.example           # Template file for reference
.env.production        # Production variables (encrypted)
```

### 3. Environment Validation
```typescript
// lib/env-validation.ts
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
]

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`)
  }
})
```

---

## Vercel Deployment

### 1. Initial Deployment
```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel --prod
```

### 2. GitHub Integration (Recommended)
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - **Framework**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Vercel Configuration File
The project includes a `vercel.json` configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/payments/webhook",
      "dest": "/api/payments/webhook"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key",
    "STRIPE_SECRET_KEY": "@stripe_secret_key",
    // ... other environment variables
  },
  "functions": {
    "app/api/payments/webhook/route.ts": {
      "maxDuration": 30
    }
  }
}
```

### 4. Environment Variables in Vercel
1. Go to **Project Settings** → **Environment Variables**
2. Add all required environment variables
3. Set appropriate environments (Production, Preview, Development)

### 5. Build Optimization
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate' }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

---

## Domain Configuration

### 1. Custom Domain Setup
1. Go to Vercel **Project Settings** → **Domains**
2. Add your custom domain
3. Configure DNS records:
   - **Type**: CNAME
   - **Name**: @ (or www)
   - **Value**: cname.vercel-dns.com

### 2. SSL Certificate
- Vercel automatically provisions SSL certificates
- Verify HTTPS is working: `https://your-domain.com`

### 3. Subdomain Configuration
```
www.your-domain.com    → CNAME → cname.vercel-dns.com
api.your-domain.com    → CNAME → cname.vercel-dns.com
admin.your-domain.com  → CNAME → cname.vercel-dns.com
```

---

## Security Setup

### 1. CORS Configuration
```typescript
// lib/cors.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}
```

### 2. Content Security Policy
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.stripe.com *.supabase.co;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: *.supabase.co *.stripe.com;
      connect-src 'self' *.supabase.co *.stripe.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]
```

### 3. Rate Limiting
```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})
```

### 4. API Security
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  
  return response
}
```

---

## Performance Optimization

### 1. Next.js Optimization
```javascript
// next.config.js optimizations
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  compress: true,
  poweredByHeader: false,
}
```

### 2. Image Optimization
```typescript
// Image configuration
import Image from 'next/image'

// Optimize product images
<Image
  src={productImage}
  alt={productName}
  width={500}
  height={500}
  priority={isAboveFold}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 3. Database Optimization
```sql
-- Add database indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
```

### 4. Caching Strategy
```typescript
// API route caching
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  })
}
```

---

## Monitoring & Analytics

### 1. Vercel Analytics
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 2. Performance Monitoring
```bash
# Add performance monitoring scripts
npm run test:performance
npm run test:accessibility
npm run audit:security
```

### 3. Error Tracking
```typescript
// lib/error-tracking.ts
export function trackError(error: Error, context?: any) {
  console.error('Application Error:', error, context)
  // Send to error tracking service
}
```

### 4. Health Checks
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    const dbCheck = await supabase.from('products').select('id').limit(1)
    
    // Check external services
    const stripeCheck = await stripe.balance.retrieve()
    
    return NextResponse.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbCheck.error ? 'down' : 'up',
        payments: stripeCheck ? 'up' : 'down'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    )
  }
}
```

---

## CI/CD Pipeline

### 1. GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:all
      
      - name: Type check
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 2. Quality Gates
```bash
# Pre-deployment checks
npm run lint              # ESLint checks
npm run typecheck         # TypeScript validation
npm run test             # Unit tests
npm run test:e2e         # End-to-end tests
npm run test:security    # Security audit
```

### 3. Environment Promotion
```bash
# Development → Staging → Production
git push origin develop    # Deploy to staging
git push origin main      # Deploy to production
```

---

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### 2. Environment Variable Issues
```bash
# Verify environment variables
vercel env ls
vercel env pull .env.local
```

#### 3. Database Connection Issues
```typescript
// Test database connection
const { data, error } = await supabase
  .from('products')
  .select('*')
  .limit(1)

console.log('DB Test:', { data, error })
```

#### 4. Stripe Webhook Issues
```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/payments/webhook
```

### Debug Commands
```bash
# Vercel deployment logs
vercel logs

# Local development debugging
DEBUG=* npm run dev

# Database debugging
npx supabase status
npx supabase logs
```

### Performance Issues
```bash
# Bundle analysis
npm run build
npx @next/bundle-analyzer

# Performance testing
npm run test:performance
npm run test:load
```

---

## Post-Deployment Checklist

### ✅ Functional Testing
- [ ] Homepage loads correctly
- [ ] User authentication works
- [ ] Product catalog displays
- [ ] Search functionality works
- [ ] Shopping cart operations
- [ ] Checkout process completes
- [ ] Payment processing works
- [ ] Email notifications send
- [ ] Admin dashboard accessible

### ✅ Performance Testing
- [ ] Page load times < 3 seconds
- [ ] Core Web Vitals passing
- [ ] Mobile performance optimized
- [ ] Images loading efficiently
- [ ] API response times acceptable

### ✅ Security Testing
- [ ] HTTPS working correctly
- [ ] Headers properly configured
- [ ] Authentication secure
- [ ] API endpoints protected
- [ ] No sensitive data exposed

### ✅ SEO & Analytics
- [ ] Meta tags configured
- [ ] Analytics tracking working
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] Schema markup added

### ✅ Monitoring
- [ ] Error tracking active
- [ ] Performance monitoring setup
- [ ] Uptime monitoring configured
- [ ] Alert notifications working

---

## Maintenance

### Regular Tasks
- **Daily**: Monitor error rates and performance
- **Weekly**: Security updates and dependency checks
- **Monthly**: Performance optimization review
- **Quarterly**: Full security audit

### Update Process
```bash
# Update dependencies
npm update
npm audit fix

# Deploy updates
git add .
git commit -m "chore: update dependencies"
git push origin main
```

### Backup Strategy
- Database: Automated daily backups via Supabase
- Code: Version controlled in GitHub
- Environment: Documented configuration

---

## Support & Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

### Community Support
- [Next.js Discord](https://discord.gg/nextjs)
- [Vercel Discord](https://discord.gg/vercel)
- [Supabase Discord](https://discord.supabase.com)

### Emergency Contacts
- **Technical Lead**: your-email@domain.com
- **DevOps**: devops@domain.com
- **Support**: support@domain.com

---

This deployment guide ensures a successful, secure, and performant deployment of the Hayaku e-commerce platform. Follow each section carefully and verify all checkpoints before going live.