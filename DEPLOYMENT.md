# Deployment

## Target stack

- Frontend: Vercel
- Backend: Render
- Database: Supabase PostgreSQL

## Backend on Render

1. Create a new Render Web Service from this repository.
2. Use the included [render.yaml](/workspaces/ATS/render.yaml) blueprint or create a manual Web Service.
3. Set these Render environment variables:
	- `ConnectionStrings__DefaultConnection`
	- `Jwt__Key`
	- `Jwt__Issuer` = `AestheticTechStore`
	- `Jwt__Audience` = `AestheticTechStoreUsers`
	- `Jwt__DurationInMinutes` = `1440`
4. Render will build the API from `backend/AestheticTechStore.Api` and expose a public URL.

## Frontend on Vercel

1. Import the `frontend/` folder into Vercel as the project root.
2. Set these Vercel environment variables:
	- `BACKEND_URL` = your Render API URL, for example `https://your-api.onrender.com`
	- `NEXT_PUBLIC_APP_URL` = your Vercel domain
	- `NEXT_PUBLIC_SUPABASE_URL`
	- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
	- `SUPABASE_URL`
	- `SUPABASE_PUBLISHABLE_KEY`
	- `SUPABASE_SECRET_KEY`
	- `SUPABASE_JWKS_URL`

## Database

Use Supabase PostgreSQL for production.
Set `ConnectionStrings__DefaultConnection` in Render to your Supabase connection string.

## Prisma scaffold

If you want to use Prisma later, the standalone scaffold lives in [prisma-service/](prisma-service).

Required environment variables for that scaffold:

- `DATABASE_URL`
- `DIRECT_URL`

Useful commands:

```bash
cd prisma-service
npm install
npm run prisma:generate
npm run prisma:validate
```

## Notes

- The frontend calls `/api/...` and Next.js rewrites those requests to the backend URL in `BACKEND_URL`.
- The backend uses the Supabase connection string from `ConnectionStrings__DefaultConnection`.
- The root [render.yaml](/workspaces/ATS/render.yaml) is the Render blueprint for the backend.