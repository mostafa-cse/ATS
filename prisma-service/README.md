# Prisma Service

This folder is a standalone Prisma scaffold for future Node-based data access.
The schema mirrors the ATS domain entities so it can be evolved into a real data layer later.

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies:

```bash
npm install
```

3. Generate the Prisma client:

```bash
npm run prisma:generate
```

4. Validate the schema:

```bash
npm run prisma:validate
```

5. Run the demo service:

```bash
npm run dev
```

The service exposes:

- `GET /health`
- `GET /catalog-summary`