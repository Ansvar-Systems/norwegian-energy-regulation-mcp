/**
 * Combined ingestion for all 4 Norwegian energy regulators.
 *
 * Inserts regulatory content sourced from:
 *   - NVE (nve.no) — lover, forskrifter, veiledninger
 *   - RME (nve.no/reguleringsmyndigheten) — tariff decisions, methodologies
 *   - Statnett (statnett.no) — grid codes, balancing rules
 *   - DSB (dsb.no) — electrical and gas safety rules
 *
 * Usage:
 *   npx tsx scripts/ingest-all.ts
 *   npx tsx scripts/ingest-all.ts --force   # drop and recreate
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { dirname } from "node:path";
import { SCHEMA_SQL } from "../src/db.js";

const DB_PATH = process.env["NO_ENERGY_DB_PATH"] ?? "data/no-energy.db";
const force = process.argv.includes("--force");

const dir = dirname(DB_PATH);
if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
if (force && existsSync(DB_PATH)) {
  unlinkSync(DB_PATH);
  console.log(`Deleted ${DB_PATH}`);
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(SCHEMA_SQL);

// ═══════════════════════════════════════════════════════════════
// REGULATORS
// ═══════════════════════════════════════════════════════════════

const regulators = [
  { id: "nve", name: "NVE", full_name: "Norges vassdrags- og energidirektorat (NVE)", url: "https://nve.no", description: "Norwegian Water Resources and Energy Directorate — energy concessions, water resource management, dam safety, flood preparedness, renewable energy licensing, energy market oversight, NIS2/CER competent authority for energy sector" },
  { id: "rme", name: "RME", full_name: "Reguleringsmyndigheten for energi (RME)", url: "https://nve.no/reguleringsmyndigheten", description: "Energy regulatory authority within NVE — network tariffs, revenue caps, market supervision, third-party access, cross-border capacity allocation, consumer protection" },
  { id: "statnett", name: "Statnett", full_name: "Statnett SF (Norwegian TSO)", url: "https://statnett.no", description: "Norwegian TSO — central grid (sentralnettet), grid codes (FOSA/FOS), balancing, ancillary services, capacity allocation, Nord Pool integration" },
  { id: "dsb", name: "DSB", full_name: "Direktoratet for samfunnssikkerhet og beredskap (DSB)", url: "https://dsb.no", description: "Norwegian Directorate for Civil Protection — electrical installation safety, gas safety, fire/explosion prevention, product safety, preparedness" },
];

const insertReg = db.prepare("INSERT OR IGNORE INTO regulators (id, name, full_name, url, description) VALUES (?, ?, ?, ?, ?)");
for (const r of regulators) insertReg.run(r.id, r.name, r.full_name, r.url, r.description);
console.log(`Inserted ${regulators.length} regulators`);

// ═══════════════════════════════════════════════════════════════
// REGULATIONS (NVE + RME + DSB)
// ═══════════════════════════════════════════════════════════════

db.prepare("DELETE FROM regulations").run();

const insertRegulation = db.prepare(`
  INSERT INTO regulations (regulator_id, reference, title, text, type, status, effective_date, url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// Placeholder: replace with corpus import when available
// e.g., import { CORPUS_REGULATIONS } from "./data/corpus-regulations.js";
const allRegs: string[][] = [];

const insertRegBatch = db.transaction(() => {
  for (const r of allRegs) {
    insertRegulation.run(r[0], r[1], r[2], r[3], r[4], r[5], r[6], r[7]);
  }
});
insertRegBatch();
const nveCount = allRegs.filter(r => r[0] === "nve").length;
const dsbCount = allRegs.filter(r => r[0] === "dsb").length;
const rmeCount = allRegs.filter(r => r[0] === "rme").length;
console.log(`Inserted ${nveCount} NVE + ${dsbCount} DSB + ${rmeCount} RME = ${allRegs.length} regulations`);

// ═══════════════════════════════════════════════════════════════
// GRID CODES (Statnett)
// ═══════════════════════════════════════════════════════════════

db.prepare("DELETE FROM grid_codes").run();

const insertGridCode = db.prepare(`
  INSERT INTO grid_codes (reference, title, text, code_type, version, effective_date, url) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Placeholder: replace with corpus import when available
const allGridCodes: string[][] = [];

const insertGCBatch = db.transaction(() => {
  for (const g of allGridCodes) {
    insertGridCode.run(g[0], g[1], g[2], g[3], g[4], g[5], g[6]);
  }
});
insertGCBatch();
console.log(`Inserted ${allGridCodes.length} Statnett grid codes`);

// ═══════════════════════════════════════════════════════════════
// DECISIONS (RME)
// ═══════════════════════════════════════════════════════════════

db.prepare("DELETE FROM decisions").run();

const insertDecision = db.prepare(`
  INSERT INTO decisions (reference, title, text, decision_type, date_decided, parties, url) VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Placeholder: replace with corpus import when available
const allDecisions: string[][] = [];

const insertDecBatch = db.transaction(() => {
  for (const d of allDecisions) {
    insertDecision.run(d[0], d[1], d[2], d[3], d[4], d[5], d[6]);
  }
});
insertDecBatch();
console.log(`Inserted ${allDecisions.length} RME decisions`);

// ═══════════════════════════════════════════════════════════════
// REBUILD FTS INDEXES
// ═══════════════════════════════════════════════════════════════

db.exec("INSERT INTO regulations_fts(regulations_fts) VALUES('rebuild')");
db.exec("INSERT INTO grid_codes_fts(grid_codes_fts) VALUES('rebuild')");
db.exec("INSERT INTO decisions_fts(decisions_fts) VALUES('rebuild')");

// ═══════════════════════════════════════════════════════════════
// DB METADATA
// ═══════════════════════════════════════════════════════════════

db.exec(`CREATE TABLE IF NOT EXISTS db_metadata (
  key   TEXT PRIMARY KEY,
  value TEXT,
  last_updated TEXT DEFAULT (datetime('now'))
)`);

const stats = {
  regulators: (db.prepare("SELECT count(*) as n FROM regulators").get() as { n: number }).n,
  regulations: (db.prepare("SELECT count(*) as n FROM regulations").get() as { n: number }).n,
  grid_codes: (db.prepare("SELECT count(*) as n FROM grid_codes").get() as { n: number }).n,
  decisions: (db.prepare("SELECT count(*) as n FROM decisions").get() as { n: number }).n,
  nve: (db.prepare("SELECT count(*) as n FROM regulations WHERE regulator_id = 'nve'").get() as { n: number }).n,
  dsb: (db.prepare("SELECT count(*) as n FROM regulations WHERE regulator_id = 'dsb'").get() as { n: number }).n,
  rme_regs: (db.prepare("SELECT count(*) as n FROM regulations WHERE regulator_id = 'rme'").get() as { n: number }).n,
};

const insertMeta = db.prepare("INSERT OR REPLACE INTO db_metadata (key, value) VALUES (?, ?)");
insertMeta.run("schema_version", "1.0");
insertMeta.run("tier", "free");
insertMeta.run("domain", "norwegian-energy-regulation");
insertMeta.run("build_date", new Date().toISOString().split("T")[0]);
insertMeta.run("regulations_count", String(stats.regulations));
insertMeta.run("grid_codes_count", String(stats.grid_codes));
insertMeta.run("decisions_count", String(stats.decisions));
insertMeta.run("total_records", String(stats.regulations + stats.grid_codes + stats.decisions));

console.log(`\nDatabase summary:`);
console.log(`  Regulators:         ${stats.regulators}`);
console.log(`  Regulations:        ${stats.regulations} (NVE: ${stats.nve}, DSB: ${stats.dsb}, RME: ${stats.rme_regs})`);
console.log(`  Grid codes:         ${stats.grid_codes} (Statnett)`);
console.log(`  Decisions:          ${stats.decisions} (RME)`);
console.log(`  Total documents:    ${stats.regulations + stats.grid_codes + stats.decisions}`);
console.log(`\nDone. Database at ${DB_PATH}`);

db.close();
