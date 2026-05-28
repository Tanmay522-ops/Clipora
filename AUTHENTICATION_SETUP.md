# Authentication Setup Guide for Cliporra

## ✅ What I Fixed

1. **Sign-up Page** - Replaced placeholder component with actual SignUpForm
2. **Environment Variables** - Created `.env.local` template with all required keys

## 🔧 Required Setup Steps

### Step 1: Set Up Clerk Authentication

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application or sign in
3. Get your keys:
   - **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** (starts with `pk_`)
   - **CLERK_SECRET_KEY** (starts with `sk_`)
4. Update `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
   CLERK_SECRET_KEY=your_secret_key_here
   ```

### Step 2: Set Up PostgreSQL Database

1. **Option A: Local PostgreSQL**
   - Install PostgreSQL locally
   - Create a database: `createdb cliporra`
   - Default connection: `postgresql://postgres:password@localhost:5432/cliporra`

2. **Option B: Cloud PostgreSQL (Recommended)**
   - Use Neon ([https://neon.tech](https://neon.tech)) - free PostgreSQL hosting
   - Create account and copy connection string
   - Update `.env.local`:
     ```
     DATABASE_URL=your_database_connection_string_here
     ```

### Step 3: Run Database Migrations

```bash
# Install dependencies (if not done)
npm install

# Generate Prisma client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev --name init

# Optional: View database in UI
npx prisma studio
```

### Step 4: Configure Clerk Settings (in Dashboard)

1. Go to Clerk Dashboard
2. Go to **User & Authentication** → **Email, Phone, Username**
3. Enable Email + Password authentication
4. Go to **Redirect URLs**
5. Add these redirect URLs:
   - `http://localhost:3000/callback` (development)
   - `http://localhost:3000/callback/sign-in` (development)
   - Your production URLs when deployed

### Step 5: Test Authentication

```bash
# Start development server
npm run dev

# Navigate to http://localhost:3000
# Test:
# 1. Click "Sign In" - email/password form should appear
# 2. Click "Sign Up" - registration form should appear
# 3. Try signing in with email/password or Google
```

## ✨ Authentication Flow

### Sign In

```
Email/Password → Clerk validates → Create session → Redirect to /callback/sign-in
→ onAuthenticateUser() creates/fetches user → Redirect to /dashboard
```

### Sign Up

```
Registration form → Generate Code (OTP sent to email) → Enter OTP →
onSignUpUser() creates user in DB → Create default workspace & subscription
→ Redirect to /group/create
```

## 🐛 Common Issues & Solutions

| Issue                                   | Solution                                                  |
| --------------------------------------- | --------------------------------------------------------- |
| "Oops! something went wrong" on sign-in | Check `.env.local` has correct Clerk keys                 |
| Database connection error               | Verify `DATABASE_URL` is correct and database exists      |
| "form_password_incorrect" error         | Email/password combination is wrong                       |
| OTP not received                        | Check email spam folder; verify Clerk email configuration |
| Redirect loop                           | Ensure redirect URLs are configured in Clerk Dashboard    |
| Google OAuth not working                | Configure Google OAuth credentials in Clerk Dashboard     |

## 📋 Checklist

- [ ] Clerk account created and keys copied to `.env.local`
- [ ] PostgreSQL database created and `DATABASE_URL` in `.env.local`
- [ ] `npm install` completed
- [ ] `npx prisma migrate dev --name init` executed successfully
- [ ] Development server starts with `npm run dev`
- [ ] Sign-in/Sign-up forms appear at `/sign-in` and `/sign-up`
- [ ] Can create a test account successfully

## 🚀 Next Steps After Auth Works

1. Configure Google OAuth in Clerk for OAuth sign-up/sign-in
2. Set up email templates in Clerk
3. Configure payment system for subscriptions
4. Test workspace creation and video upload functionality
