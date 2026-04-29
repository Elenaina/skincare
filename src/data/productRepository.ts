import { supabase } from "../lib/supabase";
import type { Product } from "../domain/types";
import { mapProductRow } from "./productMapper";
import { localProducts } from "./productsSeed";

const productColumns = [
  "id",
  "brand",
  "product_name",
  "category",
  "subcategory",
  "price_pln",
  "size_ml",
  "skin_types",
  "skin_concerns",
  "key_ingredients",
  "avoid_if",
  "fragrance_free",
  "pregnancy_safe",
  "barrier_friendly",
  "comedogenic_risk",
  "recommended_step",
  "usage_time",
  "usage_frequency",
  "short_reason",
  "source_url",
  "is_active",
].join(",");

export async function getProducts(): Promise<Product[]> {
  if (!supabase) return localProducts;

  const { data, error } = await supabase
    .from("products")
    .select(productColumns)
    .eq("is_active", true)
    .order("brand", { ascending: true });

  if (error) {
    console.warn("Supabase products query failed. Falling back to local seed.", error.message);
    return localProducts;
  }

  return ((data ?? []) as unknown[]).map((row, index) => mapProductRow(row as Parameters<typeof mapProductRow>[0], index));
}
