# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Customer Scorer is a Next.js application that helps service businesses (HVAC, plumbing, electrical, home services) track customer reliability scores and manage business risks. The app uses Supabase for authentication and data storage, with a shared network feature where verified businesses can report and search for customer reliability information.

## Commands

### Development
```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Build production bundle
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Architecture

### Route Structure

The app uses Next.js 16 App Router with two distinct layouts:

1. **Marketing site** - `app/(marketing)/`
   - Public pages (landing, pricing, features, blog, auth)
   - Uses `MarketingHeader` and `MarketingFooter`
   - No authentication required

2. **Application** - `app/app/`
   - Protected routes requiring authentication
   - Sidebar navigation with dashboard, customers, analytics, network features
   - Verification status banner
   - Admin-only routes for verification review

### Authentication & Authorization

- **Middleware** (`middleware.ts`): Checks authentication on all routes except public marketing pages and auth callbacks
- **Server-side auth**: Use `createSupabaseServerClient()`, `getCurrentUser()`, `getCurrentBusinessId()` from `lib/supabase/server.ts`
- **Client-side auth**: Use `createSupabaseBrowserClient()` from `lib/supabase/client.ts`
- **Verification system**: Users have verification_status (unverified/pending/verified/rejected) which affects network access
- **Admin system**: `is_admin` flag on profiles table for managing verifications

### Database Schema (Supabase)

Key tables:
- `profiles` - User profiles with business_id, verification_status, is_admin
- `businesses` - Business information and settings
- `customers` - Customer records (full_name, phone, address, email)
- `customer_notes` - Events/notes with severity (1-5 scale) and note_type
- `audit_logs` - Activity tracking for compliance
- `network_reports` - Cross-business customer reports

### Scoring System (`lib/scoring.ts`)

Core business logic for calculating customer reliability:

- **Score calculation**: 0-100 scale based on note severity with exponential penalties
  - Severity 4-5: `severity * 6` penalty
  - Severity 3: `severity * 4` penalty
  - Severity 1-2: `severity * 1` penalty

- **Score labels**: Excellent (90+), Good (75+), Fair (60+), Poor (40+), High Risk (<40)
- **Risk levels**: Low (75+), Medium (50-74), High (<50)
- **Trend analysis**: Compares recent 30 days vs previous 30 days to determine Improving/Declining/Stable/New
- **Analytics**: `calculateFullAnalytics()` returns comprehensive customer risk assessment

### Audit Logging (`lib/audit.ts`)

All user actions are logged to `audit_logs` table:
- Actions: VIEWED_PROFILE, CREATED_CUSTOMER, UPDATED_CUSTOMER, DELETED_CUSTOMER, CREATED_EVENT, DELETED_EVENT, EXPORTED_DATA, SEARCHED_CUSTOMERS
- Includes business_id, user_id, customer_id, and metadata
- Non-blocking: failures are logged but don't break app

### Styling

- Tailwind CSS 4.x with custom color palette
- Custom colors defined in `globals.css`:
  - `deep-navy`, `deep-blue` (backgrounds)
  - `forsure-blue` (primary brand)
  - `emerald`, `amber`, `critical` (status colors)
  - `cool-gray`, `slate-gray` (text)
- Radix UI components for accessible UI primitives
- `shadcn/ui` pattern with `components/ui/` directory

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Key Patterns

### Data Fetching
- Server Components fetch data directly using `createSupabaseServerClient()`
- Client Components use `createSupabaseBrowserClient()` in useEffect or event handlers
- Always check `getCurrentBusinessId()` to scope queries to current business

### Customer Scoring
- Notes have severity 1-5 (1=positive, 5=severe negative)
- Always use `calculateFullAnalytics()` for comprehensive customer risk data
- Score calculations are deterministic and side-effect free

### Verification Flow
- New users start as "unverified"
- Submit verification request → "pending"
- Admin reviews → "verified" or "rejected"
- Only verified businesses can access network features

### Type Safety
- TypeScript strict mode enabled
- Path alias `@/*` maps to project root
- Define types inline or colocate with components
