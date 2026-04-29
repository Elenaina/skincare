# Product Database

The seed database lives in `data/products_seed.csv`.

It is designed as a curated recommendation database, not just a product catalog. Each row should explain when a product is useful, what skin concerns it supports, and when it should be avoided.

## Current Source Summary

- Products: 129
- Brands: BasicLab, Geek & Gorgeous, AA, Tolpa, Dermika, CeraVe, Bandi, Bielenda, Bielenda Professional, Ziaja, Cetaphil, Eveline, Samarite, Yasumi
- Main categories: serum, cream, SPF, cleansing, toner, exfoliant, mask
- Main routine steps: cleansing, serum, cream, SPF, makeup removal, exfoliation, mask

## CSV Columns

| Column | Purpose |
| --- | --- |
| `brand` | Product brand. |
| `product_name` | Commercial product name. |
| `category` | Broad product type, e.g. serum, krem, SPF. |
| `subcategory` | More precise product family, e.g. regenerating, anti-aging, brightening. |
| `price_pln` | Current or approximate product price in PLN. |
| `size_ml` | Product size in milliliters when applicable. |
| `skin_types` | Pipe-separated skin types. |
| `skin_concerns` | Pipe-separated skin concerns the product can support. |
| `key_ingredients` | Pipe-separated key ingredients or ingredient groups. |
| `avoid_if` | Contraindications or routine conflicts. Blank means no specific warning has been entered yet. |
| `fragrance_free` | Whether the product is fragrance-free. |
| `pregnancy_safe` | Whether the product is considered pregnancy-safe for cosmetic recommendation purposes. |
| `barrier_friendly` | Whether it is suitable when the skin barrier is weakened. |
| `comedogenic_risk` | Low/medium/high comedogenic risk estimate. |
| `recommended_step` | Routine step where the product belongs. |
| `usage_time` | Morning/evening use guidance. |
| `usage_frequency` | Suggested frequency. |
| `short_reason` | Human-readable recommendation reason. |
| `source_url` | Source or reference URL for manual audit. |

## Supabase/PostgreSQL Shape

For MVP import, the CSV can be loaded into a single `products` table first. Once the app logic becomes richer, split repeated fields into lookup tables.

Recommended first table:

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  product_name text not null,
  category text not null,
  subcategory text,
  price_pln numeric(10,2),
  size_ml numeric(10,2),
  skin_types text[] not null default '{}',
  skin_concerns text[] not null default '{}',
  key_ingredients text[] not null default '{}',
  avoid_if text,
  fragrance_free boolean,
  pregnancy_safe boolean,
  barrier_friendly boolean,
  comedogenic_risk text,
  recommended_step text not null,
  usage_time text,
  usage_frequency text,
  short_reason text,
  source_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

## Normalization Later

When needed, split into:

- `brands`
- `products`
- `ingredients`
- `product_ingredients`
- `skin_types`
- `skin_concerns`
- `product_recommendation_rules`

The MVP can stay simpler until recommendation logic needs weighting, exclusions, and ingredient-level matching.

## Data Quality Notes

- `avoid_if` is intentionally often blank. This should be enriched over time, especially for acids, retinoids, vitamin C, pregnancy, and sensitive skin.
- `skin_types`, `skin_concerns`, and `key_ingredients` use `|` separators and should become arrays during import.
- Before production use, category and routine-step values should be normalized to app constants.
