import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const inputPath = path.join(rootDir, "data", "products_seed.csv");
const outputPath = path.join(rootDir, "src", "data", "productsSeed.ts");

const text = (await fs.readFile(inputPath, "utf8")).replace(/^\uFEFF/, "").trim();
const [headerLine, ...lines] = text.split(/\r?\n/);
const headers = headerLine.split(";");

const rows = lines.map((line, index) => {
  const values = line.split(";");
  return Object.fromEntries(headers.map((header, columnIndex) => [header, values[columnIndex] ?? ""]));
});

const generated = `import type { Product } from "../domain/types";
import { mapProductRow } from "./productMapper";

const productRows = ${JSON.stringify(rows, null, 2)} as const;

export const localProducts: Product[] = productRows.map((row, index) => mapProductRow(row, index));
`;

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, generated, "utf8");

console.log(`Generated ${rows.length} products at ${path.relative(rootDir, outputPath)}`);
