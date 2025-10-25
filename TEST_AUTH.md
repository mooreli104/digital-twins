# Testing Supabase Authentication

## What I Just Built

I've implemented a complete authentication system for FarmTwin:

### Files Created/Modified:
1. **[frontend/src/services/supabase.js](frontend/src/services/supabase.js)** - Auth functions (signIn, signUp, signOut)
2. **[frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx)** - Global auth state management
3. **[frontend/src/pages/Login.jsx](frontend/src/pages/Login.jsx)** - Login/signup UI
4. **[frontend/src/App.jsx](frontend/src/App.jsx)** - Auth-aware app wrapper
5. **[frontend/src/pages/Dashboard.jsx](frontend/src/pages/Dashboard.jsx)** - Added logout button

## How to Test

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

This will install all packages including `@supabase/supabase-js`.

### Step 2: Verify Environment Variables

Make sure your `frontend/.env` file has your Supabase credentials:

```bash
cat frontend/.env
```

You should see:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Start the Frontend

```bash
cd frontend
npm run dev
```

The app should start at **http://localhost:5173**

### Step 4: Test Authentication Flow

#### A. Sign Up (Create New Account)

1. Click "Don't have an account? Sign up"
2. Enter email: `test@example.com`
3. Enter password: `password123` (minimum 6 characters)
4. Click "Sign Up"
5. **Expected**: Alert saying "Check your email to confirm your account!"

#### B. Check Supabase Dashboard

1. Go to your Supabase project dashboard
2. Click "Authentication" → "Users"
3. **Expected**: You should see your test user listed

#### C. Confirm Email (Optional)

- If email confirmation is enabled, check your email and click the confirmation link
- If disabled (recommended for testing), skip this step

#### D. Sign In

1. On the login page, enter your email and password
2. Click "Sign In"
3. **Expected**: You should be redirected to the Dashboard

#### E. Verify Logged In State

On the Dashboard, you should see:
- "Logged in as: test@example.com" at the top
- A "Sign Out" button in the header
- A green checkmark saying "Auth test successful!"

#### F. Sign Out

1. Click "Sign Out" button
2. **Expected**: You should be redirected back to the login page

## What to Check in Browser Console

Open Developer Tools (F12) and check the Console tab:

### On Successful Login:
```
Login successful: {user object}
Logged in: {user object}
```

### On Successful Signup:
```
Signup successful: {user object}
```

### On Errors:
You'll see error messages in red - common ones:
- "Invalid login credentials" - wrong email/password
- "User already registered" - email already exists
- Network errors - check your VITE_SUPABASE_URL

## Troubleshooting

### Error: "Invalid API key"
- Check your `VITE_SUPABASE_ANON_KEY` in `.env`
- Make sure it's the **anon public** key, not the service role key

### Error: "fetch failed" or network error
- Check your `VITE_SUPABASE_URL` is correct
- Format should be: `https://xxxxx.supabase.co` (no trailing slash)
- Make sure you have internet connection

### Login page doesn't show
- Check browser console for errors
- Verify `npm install` completed successfully
- Make sure all new files were created

### "User already registered"
- This email is already in use
- Try a different email or use the "Sign in" option

### Email confirmation required
- Go to Supabase Dashboard → Authentication → Settings
- Under "Email Auth", disable "Confirm email" for testing
- Or check your email inbox for confirmation link

## Quick Verification Checklist

- [ ] Frontend starts without errors (`npm run dev`)
- [ ] Login page displays at http://localhost:5173
- [ ] Can switch between "Sign In" and "Sign Up" modes
- [ ] Can create new account (sign up)
- [ ] New user appears in Supabase Dashboard
- [ ] Can sign in with created account
- [ ] Dashboard shows "Logged in as: your-email"
- [ ] "Sign Out" button works and returns to login

## What's Next After Auth Works

Once authentication is working, you can move on to:

1. **Python Simulator** - Generate sensor data to Redis
2. **Backend WebSocket** - Stream data to frontend
3. **Dashboard Components** - Display live sensor readings

But for now, let's just verify that auth is working!

## Expected Flow

```
User not logged in → Login Page
    ↓ (enter credentials)
User clicks "Sign In" → Supabase auth
    ↓ (success)
Dashboard Page (shows logout button + placeholder content)
    ↓ (click logout)
Login Page (logged out successfully)
```

---

**Try it now!** Run `npm run dev` in the frontend folder and visit http://localhost:5173
