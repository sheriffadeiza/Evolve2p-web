# API Environment Configuration

This document explains how to switch between development and production API environments for the Evolve2p frontend.

## Available Environments

The frontend can connect to two different backend environments:

1. **Development**: `http://127.0.0.1:8000` (local Django server)
2. **Production**: `https://evolve2p-backend.vercel.app` (Vercel deployment)

## How to Switch Environments

### Method 1: Using npm scripts

We've added convenient npm scripts to switch between environments:

```bash
# Switch to development environment (localhost:8000)
npm run use-dev-api

# Switch to production environment (Vercel)
npm run use-prod-api

# Toggle between environments
npm run toggle-api
```

### Method 2: Manual configuration

You can also manually edit the `.env.local` file:

1. Open `.env.local` in your editor
2. For **development** environment:
   - Make sure `NEXT_PUBLIC_USE_LOCAL_API=true` is uncommented
3. For **production** environment:
   - Comment out or remove `NEXT_PUBLIC_USE_LOCAL_API=true`

## How It Works

The environment configuration is managed through:

1. `.env.local` - Contains environment variables
2. `config/api.ts` - Central configuration file that exports API endpoints
3. Components use the endpoints from `config/api.ts` instead of hardcoded URLs

The system uses the following logic:
- If `NEXT_PUBLIC_USE_LOCAL_API=true`, it uses the development URL
- Otherwise, it uses the production URL from `NEXT_PUBLIC_API_URL`

## Checking Current Environment

To check which environment you're currently using, run the app and check the console output or look at the `.env.local` file.

## Troubleshooting

If you're having issues with the API connection:

1. Make sure the backend server is running (for development environment)
2. Check that the `.env.local` file has the correct configuration
3. Restart the Next.js development server after changing environments
4. Clear browser cache if you're experiencing stale data

## Development Workflow

When working on the frontend:

1. Start the local backend server:
   ```bash
   cd ../Evolve2p-backend
   python manage.py runserver
   ```

2. Switch to development environment:
   ```bash
   npm run use-dev-api
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

When testing with the production backend:

1. Switch to production environment:
   ```bash
   npm run use-prod-api
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```
