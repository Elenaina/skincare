# Supabase Setup

This project starts with Supabase as a low-cost backend for product data.

## Why Supabase

- PostgreSQL database with a dashboard for manual product curation.
- Generated API for the React Native app.
- Auth and Row Level Security when user accounts are added.
- Easy migration path to a custom FastAPI service later.

## App Configuration

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Then fill:

```text
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Only publishable/anon keys belong in the app. Never put a Supabase service role key in React Native.

## Database

Run `supabase/schema.sql` in the Supabase SQL editor.

The app reads from `public.products`. Row Level Security is enabled, and active products are publicly readable because the product catalog is not user-private.

User survey history is stored separately in `public.survey_results`. Those rows are protected by RLS and scoped to the authenticated user.

## Importing Products

For MVP, import `data/products_seed.csv` into the `products` table. Convert pipe-separated fields into arrays for these columns:

- `skin_types`
- `skin_concerns`
- `key_ingredients`

If importing through the dashboard is easier, start with text columns and normalize with SQL later. The app also includes a local generated seed so development is not blocked by Supabase setup.

## Recommendation Boundary

Supabase stores data. The deterministic recommendation algorithm currently lives in `src/domain/recommendations.ts`.

AI should not choose products directly. AI can later explain the already selected routine in natural language.
