# Production Secrets Checklist

Set these values in your host or CI secrets store before deployment.

## Backend

- `ConnectionStrings__DefaultConnection`
- `Jwt__Key`
- `Jwt__Issuer`
- `Jwt__Audience`
- `Jwt__DurationInMinutes`

## Frontend

- `BACKEND_URL`
- `NEXT_PUBLIC_APP_URL`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_JWKS_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Prisma service

- `DATABASE_URL`
- `DIRECT_URL`
- `PORT` if you run the service separately

## Deployment workflow

- `Render` service settings for the backend
- `Vercel` project settings for the frontend

For Vercel, set `BACKEND_URL` to the public Render service URL.

For Render, set `ConnectionStrings__DefaultConnection` and `Jwt__Key` as secret environment variables.