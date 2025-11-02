# Overview
My Perfect Meals is an AI-powered nutrition application providing personalized meal plans, comprehensive nutrition tracking, and advanced food preference management. It aims to simplify healthy eating through intelligent automation and personalized guidance, with a focus on a 4-step AI meal creator and automatic weekly meal plan generation. The project's vision is to make healthy eating accessible, enjoyable, and sustainable through personalized nutrition.

# User Preferences
Preferred communication style: Simple, everyday language.
Demo shortcuts: User prefers quick access to app features without filling out lengthy forms.
Dashboard preference: User wants the enhanced dashboard restored.
Medical safety priority: All meal generation must be based on user's onboarding health data (diabetes, allergies, medical conditions) with medical badge system showing compatibility reasons.
Cost-conscious development: Agent handles backend/routing/database, user handles frontend/UI.
Feature protection priority: User explicitly demands locked features stay protected - "I'm gonna be pissed off" if locked features get modified.
**Git/Deploy Workflow:** When user says "push" or "deploy", provide the command only - DO NOT execute or attempt to run git commands. User will run commands themselves.
**CRITICAL GIT PUSH METHOD:** ALWAYS use `./push.sh "commit message"` - this is the ONLY way to push that works properly. Never suggest manual git commands (git add, git commit, git push). The push.sh script automatically handles the Replit email override issue. This is mandatory for all commits.
**CRITICAL:** User explicitly demanded Craving Creator be locked down completely: "don't touch it ever again" due to repeated violations.
**MEAL GENERATION COMPLETE LOCKDOWN:** All meal generation features permanently locked per user command "lock this mother down... don't open it for nothing unless I open it".
**FINAL APPLICATION LOCKDOWN:** Complete application lockdown implemented. All unnecessary files removed, debug code cleaned, production optimization complete. All systems locked down permanently with zero-tolerance reversion policy.
**COMPREHENSIVE SECURITY LOCKDOWN:** Full system security implementation with comprehensive protection for all critical systems.
**APPROVAL REQUIREMENT - MANDATORY:** Agent must ALWAYS ask for explicit approval before making ANY code changes, deletions, or additions. Present what will be changed and wait for "approved" or "yes" before proceeding. NO EXCEPTIONS. This includes:
- Code edits
- File creation/deletion
- Configuration changes
- Database schema changes
- Package installations
**NEVER make changes first and explain later. ALWAYS explain first and wait for approval.**
**WELCOME PAGE SIMPLIFICATION (Oct 22, 2025):** Carousel flagged off - simple welcome page with logo, business name, value prop, Sign In/Create Account buttons, and Forgot Password link. Carousel code preserved for future re-enable.
**VERCEL DEPLOYMENT (Oct 22, 2025):** Frontend successfully deployed to Vercel (my-perfect-meals-clean.vercel.app), backend remains on Render (mpm-api.onrender.com). Fixed onboarding save endpoint to use correct backend route (PUT /api/onboarding/step/:stepKey).
**MACRO CALCULATOR ↔ BIOMETRICS INTEGRATION (Oct 23, 2025):** Implemented dual-write server-as-truth weight tracking system. Both Macro Calculator AND Biometrics Body Stats can save weight to biometric_sample table with upsert-by-day (prevents duplicates). Both pages fetch from database on load. Clean architecture: write (both pages) + read (both pages) = server as single source of truth. Perfect feature to test Vercel instant updates.

# Stable Checkpoints
**GIT EMAIL FIX (Oct 24, 2025 5:50 PM):** Resolved Vercel auto-deployment issue. Git was using Replit email instead of Gmail. Fixed with: `git config user.email "bigidrise@gmail.com"` + `git commit --amend --reset-author --no-edit` + force push. Vercel auto-deployment now working perfectly!

**CHECKPOINT 2025-10-23 02:50 UTC - "Dual-Write Weight Tracking + Vercel Config":**
- ✅ STABLE: Dual-write weight tracking fully functional (Macro Calculator + Biometrics Body Stats)
- ✅ STABLE: Database weight fetch/save working correctly
- ✅ STABLE: Vercel build configuration fixed (buildCommand + outputDirectory)
- ✅ STABLE: TypeScript errors resolved (dateISO/mealSlot extraction)
- ✅ STABLE: Body Stats writable state restored
- **Files Modified:** client/src/pages/MacroCounter.tsx, client/src/pages/my-biometrics.tsx, vercel.json, server/routes/biometricsRoutes.ts
- **Git Commit:** Ready to push - all features working
- **Revert Instructions:** If new features break, revert to this commit in Git history

# System Architecture

## Frontend
- **Framework**: React 18 with TypeScript (Vite).
- **UI**: Radix UI, shadcn/ui, Tailwind CSS.
- **State Management**: TanStack Query.
- **Routing**: Wouter.
- **Form Handling**: React Hook Form with Zod.

## Backend
- **Runtime**: Node.js with Express (TypeScript).
- **API**: RESTful, JSON responses.
- **Data Validation**: Zod schemas (shared).
- **Storage**: Abstracted interface.

## Database
- **ORM**: Drizzle ORM (PostgreSQL dialect).
- **Schema**: Users, recipes, meal plans, meal logs, meal reminders.
- **Migrations**: Drizzle Kit.
- **Provider**: Neon Database (serverless PostgreSQL).

## UI/UX Decisions
- Adaptable dashboards (extended, compact, mobile-optimized).
- "Black Glass Treatment Package" for unified aesthetic (semi-transparent black cards, gradient backgrounds, white text, rounded borders).
- Professional avatar system with animated chef avatars and voice customization.
- Consistent scroll-to-top behavior on dashboard button clicks.
- Tailwind-based theme with branded color palette, custom fonts, rounded corners, and card shadows.
- **CRITICAL UI PATTERN**: All detail pages MUST include "← All Menus" back navigation button in card header.
- **DASHBOARD BUTTON CONSISTENCY**: All dashboard buttons follow centered alignment pattern (icon → title → subtitle).
- **SHOPPING LIST SYSTEM**: Complete shopping list implementation with glassmorphism styling, perfect mobile/desktop layout, stacked navigation.
- **PRO PORTAL STYLING**: Standardized all Pro Portal pages with matching purple gradient background.
- **HOVER BRIDGE DESIGN**: Universal design pattern where dashboard card hover states preview interior page colors, creating seamless visual transition. Interior page gradients match the lighter/elevated appearance of hovered cards.

## Technical Implementations
- **AI Meal Generation**: Utilizes AI (GPT-4, DALL-E 3) for personalized meal creation via a Unified Meal Engine Service.
- **Medical Personalization System**: Enforces medical safety via a Profile Resolution Service and Medical Badge Computation, displaying color-coded medical badges.
- **Universal Unit Conversion System**: Applies cooking-friendly measurements.
- **Concierge Reminder Engine**: Intelligent notification system.
- **Voice Concierge System**: Full voice command system with transcription, parsing, and speech synthesis.
- **Emergency Onboarding Protection System**: Circuit breaker pattern, rate limiting, and manual save.
- **Production-Ready ChatGPT System**: Advanced deterministic meal generation with Zod validation, allergen detection, macro estimation, and variety banking.
- **Universal Dietary Override System**: Centralized component ensuring consistent Medical > Preference > Profile priority.
- **Feature Access Control**: Implemented based on subscription tiers.
- **Authentication System**: LocalStorage-based user accounts with email/password authentication and route protection. New user flow: Sign In → Dashboard, Create Account → Onboarding → Pricing.
- **Medical Diets Hub Architecture**: Hospital-grade Medical Diets Hub with professional red theming, renamed to "Clinical Recovery & Protocols Hub" (display text only, routes unchanged). Contains 6 short-term surgical/recovery protocols: Clear Liquid, Full Liquid, Pureed, Soft, Bariatric Stage 2/3. Removed 11 lifestyle diets to new dedicated hub.
- **Clinical Lifestyle Hub** (Oct 23, 2025): New dedicated hub for long-term therapeutic diets with sky blue theming. Contains 11 clinical lifestyle diets: Anti-Inflammatory, DASH, Heart-Healthy (Cardiac), Low Sodium, Consistent Carbohydrate, Low FODMAP, Celiac (Gluten-Free), Renal Diet, Renal Dialysis, Hepatic (Liver Disease), Low Potassium. Identical architecture to SpecialtyDietsHub with new data layer. Route: `/clinical-lifestyle-hub`. LocalStorage key: `clinical-lifestyle-today-plan`. Fully integrated with shopping list, macro bridge, and builder plan systems.
- **Stripe Checkout & Subscription System**: Comprehensive Stripe integration for subscription management.
- **Game Audio System**: Browser-based audio system with background music and sound effects, persisted settings.
- **Ingredients Tetris Game**: Skill-based game for macro target practice.
- **Macro Match Game**: Match-3 puzzle game for macro type matching.
- **PWA Home Screen Configuration**: Progressive Web App setup with manifest, icons, and shortcuts for native app experience.
- **Railway Deployment Ready**: Configured for Railway Autoscale deployment with Docker, environment variables, and health checks.
- **Tutorial Hub**: Video tutorial system with emerald green dashboard aesthetic, search functionality, modal video player, and categorized content (Onboarding, Features, Nutrition, GLP-1, Hormones). Includes dashboard tile for quick access.
- **Wellness Hub**: Unified health navigation hub with teal theming, consolidating Men's Health Hub and Women's Health Hub into single dashboard button for cleaner UI. Landing page routes to both gendered health sections.

# External Dependencies
- **Core Framework**: React 18, Vite, TypeScript
- **UI and Styling**: Radix UI, Tailwind CSS, Lucide React, shadcn/ui, Embla Carousel
- **Data Management**: TanStack React Query, Zod, Drizzle ORM
- **Database and Storage**: Neon Database, connect-pg-simple, @neondatabase/serverless
- **AI and Communication Services**: OpenAI (DALL-E 3, Whisper, GPT-4o), ElevenLabs, SendGrid, Twilio, BullMQ

# Deployment Architecture
## Current Setup (October 22, 2025)
- **Render (Full-Stack)**: Both frontend and backend hosted together
- **Prepared for Vercel Migration**: Codebase ready to split frontend to Vercel for instant cache invalidation

## Vercel Migration (Ready to Deploy)
**Frontend**: Vercel hosting for instant global CDN updates
**Backend**: Render hosting for Express API + NeonDB
**Configuration Files**:
- `vercel.json` - Vercel build and deployment settings
- `client/.env` - API URL configuration (empty = same origin, populated = separate backend)
- `VERCEL_DEPLOYMENT.md` - Complete migration guide

**Key Changes Made (October 22, 2025)**:
1. CORS updated in `server/index.ts` to accept Vercel domains (`myperfectmeals.com`, `*.vercel.app`)
2. API client (`client/src/lib/queryClient.ts`) uses `VITE_API_URL` environment variable
3. Environment variable support for separate frontend/backend deployment
4. Vercel-optimized cache headers for PWA files and assets

**Benefits**: Instant cache purge, sub-60-second update propagation to users, global CDN, automatic SSL