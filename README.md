# CeraMatch AI

Mobile-first MVP for a skincare recommendation app. The current prototype uses a detailed questionnaire to suggest a morning and evening routine based on skin type, skin concerns, sensitivity, current care habits, budget, and product preferences.

The long-term product direction is a React Native app with a curated Polish cosmetics database, AI-assisted routine explanations, and optional photo analysis in a later phase.

## Current Prototype

- Detailed skincare questionnaire
- Rule-based skin profile analysis
- Morning and evening routine recommendation
- Serum plus cream closure in every routine
- Product suggestions grouped by routine step
- Three product options from different brands per step
- No photo analysis in the MVP

Open `index.html` in a browser to try the static prototype.

## Planned Stack

- React Native with Expo for the mobile app
- Supabase/PostgreSQL for the product and recommendation database
- Optional FastAPI service when recommendation logic becomes more advanced
- Optional AI layer for explaining routines and future image analysis

## Product Database Direction

The first version of the database is manually curated. The seed CSV is stored in `data/products_seed.csv`, with schema notes in `docs/product-database.md`. Each product should store not only product details, but also why and when it should be recommended.

Suggested fields:

- brand
- product_name
- category
- price_range
- skin_types
- skin_concerns
- key_ingredients
- avoid_if
- fragrance_free
- barrier_friendly
- recommended_step
- usage_frequency
- short_reason
- source_notes

## Safety Note

This app provides cosmetic routine suggestions only. It does not diagnose skin diseases or replace dermatological consultation.
