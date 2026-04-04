/**
 * Seed the Norwegian Energy Regulation database with sample data for testing.
 *
 * Inserts representative regulations, grid codes, and decisions from:
 *   - NVE (energy concessions, water resources)
 *   - RME (network tariff decisions, revenue caps)
 *   - Statnett (grid codes, balancing rules)
 *   - DSB (electrical/gas safety)
 *
 * Usage:
 *   npx tsx scripts/seed-sample.ts
 *   npx tsx scripts/seed-sample.ts --force   # drop and recreate
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";
import { dirname } from "node:path";
import { SCHEMA_SQL } from "../src/db.js";

const DB_PATH = process.env["NO_ENERGY_DB_PATH"] ?? "data/no-energy.db";
const force = process.argv.includes("--force");

const dir = dirname(DB_PATH);
if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
}

if (force && existsSync(DB_PATH)) {
  unlinkSync(DB_PATH);
  console.log(`Deleted existing database at ${DB_PATH}`);
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.exec(SCHEMA_SQL);

console.log(`Database initialised at ${DB_PATH}`);

// -- Regulators --

const regulators = [
  {
    id: "nve",
    name: "NVE",
    full_name: "Norges vassdrags- og energidirektorat (NVE)",
    url: "https://nve.no",
    description:
      "Norwegian Water Resources and Energy Directorate — responsible for energy concessions, water resource management, dam safety, flood preparedness, renewable energy licensing, and energy market oversight.",
  },
  {
    id: "rme",
    name: "RME",
    full_name: "Reguleringsmyndigheten for energi (RME)",
    url: "https://nve.no/reguleringsmyndigheten",
    description:
      "Energy regulatory authority within NVE — independent regulator for network tariffs, revenue caps, market supervision, third-party access, cross-border capacity allocation, and consumer protection in the energy sector.",
  },
  {
    id: "statnett",
    name: "Statnett",
    full_name: "Statnett SF (Norwegian TSO)",
    url: "https://statnett.no",
    description:
      "Norwegian transmission system operator — manages the central grid (sentralnettet), sets grid codes (FOSA/FOS), balancing rules, ancillary services, capacity allocation, and Nord Pool market integration.",
  },
  {
    id: "dsb",
    name: "DSB",
    full_name: "Direktoratet for samfunnssikkerhet og beredskap (DSB)",
    url: "https://dsb.no",
    description:
      "Norwegian Directorate for Civil Protection — responsible for electrical installation safety, gas safety, fire and explosion prevention, product safety, and preparedness in the energy sector.",
  },
];

const insertRegulator = db.prepare(
  "INSERT OR IGNORE INTO regulators (id, name, full_name, url, description) VALUES (?, ?, ?, ?, ?)",
);

for (const r of regulators) {
  insertRegulator.run(r.id, r.name, r.full_name, r.url, r.description);
}
console.log(`Inserted ${regulators.length} regulators`);

// -- Regulations (NVE + DSB) --

const regulations = [
  // NVE — primary energy legislation
  {
    regulator_id: "nve",
    reference: "LOV-1990-06-29-50",
    title: "Lov om produksjon, omforming, overfoering, omsetning, fordeling og bruk av energi m.m. (energiloven)",
    text: "Energiloven er den sentrale loven for regulering av det norske kraftmarkedet. Loven regulerer konsesjon for bygging og drift av elektriske anlegg, organisering av kraftmarkedet, nettvirksomhet og monopolkontroll, leveringsplikt og forsyningssikkerhet, og systemansvaret til Statnett. Loven gir NVE myndighet til aa utstede konsesjoner og foere tilsyn med energisektoren. RME er opprettet som en uavhengig reguleringsmyndighet innenfor NVE i samsvar med EUs tredje energipakke.",
    type: "lov",
    status: "in_force",
    effective_date: "1991-01-01",
    url: "https://lovdata.no/lov/1990-06-29-50",
  },
  {
    regulator_id: "nve",
    reference: "LOV-2000-11-24-82",
    title: "Lov om vassdrag og grunnvann (vannressursloven)",
    text: "Vannressursloven regulerer forvaltning av vassdrag og grunnvann i Norge. Loven fastsetter regler for konsesjon til vassdragstiltak, minstevannfoering, flomforebygging, damsikkerhet, og miljoeforholdene i vassdrag. NVE er tilsynsmyndighet og konsesjonsmyndighet for vassdragstiltak. Loven stiller krav til at vassdragstiltak skal vaere til netto nytte for samfunnet, og at miljoehensynene skal tillegges betydelig vekt i konsesjonsvurderingen.",
    type: "lov",
    status: "in_force",
    effective_date: "2001-01-01",
    url: "https://lovdata.no/lov/2000-11-24-82",
  },
  {
    regulator_id: "nve",
    reference: "FOR-1990-12-07-959",
    title: "Forskrift om produksjon, omforming, overfoering, omsetning, fordeling og bruk av energi m.m. (energilovforskriften)",
    text: "Energilovforskriften er den sentrale forskriften til energiloven. Den regulerer konsesjonsplikt for elektriske anlegg, omsetningskonsesjon for kraftomsetning, nettvirksomhetens plikter, tariffer og vilkaar for tilgang til nettet, systemansvaret og balanseavregning, leveringskvalitet, og beredskap i kraftforsyningen. Forskriften fastsetter detaljerte regler for RMEs regulering av nettvirksomheten og Statnetts systemansvar.",
    type: "forskrift",
    status: "in_force",
    effective_date: "1991-01-01",
    url: "https://lovdata.no/forskrift/1990-12-07-959",
  },
  {
    regulator_id: "nve",
    reference: "FOR-2019-06-28-1000",
    title: "Forskrift om beredskap i kraftforsyningen (kraftberedskapsforskriften)",
    text: "Kraftberedskapsforskriften stiller krav til beredskap i kraftforsyningen. Alle KBO-enheter (enheter i kraftforsyningens beredskapsorganisasjon) skal utarbeide risikovurderinger, beredskapsplaner, og gjennomfoere oevelser. Forskriften stiller saerskilte krav til IKT-sikkerhet, fysisk sikring av kritisk infrastruktur, og rapportering av uoenskede hendelser til NVE. Forskriften er oppdatert med krav knyttet til NIS2-direktivet og CER-direktivet.",
    type: "forskrift",
    status: "in_force",
    effective_date: "2019-07-01",
    url: "https://lovdata.no/forskrift/2019-06-28-1000",
  },
  {
    regulator_id: "nve",
    reference: "FOR-2004-11-30-1557",
    title: "Forskrift om leveringskvalitet i kraftsystemet",
    text: "Forskriften stiller krav til leveringskvaliteten i kraftsystemet, herunder spenningskvalitet, leveringspaaletelighet, og informasjonsplikt. Nettselskapene skal rapportere avbrudd og avbruddsvarighet til NVE gjennom FASIT-systemet. Forskriften setter grenser for spenningsvariasjoner, overharmoniske, flimmer, og kortvarige avbrudd. Ved langvarige avbrudd har sluttbrukere rett til direkte kompensasjon fra nettselskapet.",
    type: "forskrift",
    status: "in_force",
    effective_date: "2005-01-01",
    url: "https://lovdata.no/forskrift/2004-11-30-1557",
  },
  // DSB — safety regulations
  {
    regulator_id: "dsb",
    reference: "FOR-1998-11-06-1060",
    title: "Forskrift om sikkerhet ved arbeid i og drift av elektriske anlegg (FSE)",
    text: "FSE stiller krav til sikkerhet ved arbeid i og drift av elektriske anlegg. Forskriften regulerer organisering av sikkerhet, arbeidsrutiner for hoey- og lavspenningsanlegg, bruk av personlig verneutstyr, krav til faglig kompetanse, og rapportering av ulykker. Eier av elektriske anlegg er ansvarlig for at arbeid utfoeres i samsvar med forskriften. DSB foerer tilsyn med etterlevelse.",
    type: "forskrift",
    status: "in_force",
    effective_date: "1999-01-01",
    url: "https://lovdata.no/forskrift/1998-11-06-1060",
  },
  {
    regulator_id: "dsb",
    reference: "FOR-2010-12-16-1815",
    title: "Forskrift om elektriske lavspenningsanlegg (FEL)",
    text: "FEL stiller krav til prosjektering, utfoerelse, endring og vedlikehold av elektriske lavspenningsanlegg. Forskriften implementerer relevante IEC/CENELEC-standarder og stiller krav til beskyttelse mot elektrisk stoet, termiske virkninger, overstroemmer, og overspenninger. Anlegg skal utfoeres av registrerte elektroentreprenoeerer med kvalifisert personell. DSB foerer tilsyn og kan gi paalegg om utbedring eller frakobling av farlige anlegg.",
    type: "forskrift",
    status: "in_force",
    effective_date: "2011-07-01",
    url: "https://lovdata.no/forskrift/2010-12-16-1815",
  },
];

const insertRegulation = db.prepare(`
  INSERT INTO regulations (regulator_id, reference, title, text, type, status, effective_date, url)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertRegsAll = db.transaction(() => {
  for (const r of regulations) {
    insertRegulation.run(
      r.regulator_id, r.reference, r.title, r.text, r.type, r.status, r.effective_date, r.url,
    );
  }
});
insertRegsAll();
console.log(`Inserted ${regulations.length} regulations`);

// -- Grid codes (Statnett) --

const gridCodes = [
  {
    reference: "FOSA 2024",
    title: "Forskrift om systemansvaret i kraftsystemet (FOSA)",
    text: "FOSA regulerer Statnetts systemansvar for det norske kraftsystemet. Forskriften fastsetter regler for balanseavregning, frekvensstyring, driftssikkerhet, spenningsregulering, systemvern, og koordinering med tilgrensende systemansvarlige (Sverige, Finland, Danmark). Statnett skal opprettholde frekvensen paa 50 Hz innenfor tillatte avvik, og har rett til aa gi paalegg om produksjonsendringer for aa opprettholde driftssikkerheten.",
    code_type: "technical_regulation",
    version: "2024",
    effective_date: "2024-01-01",
    url: "https://lovdata.no/forskrift/2002-05-07-448",
  },
  {
    reference: "FOS 2024",
    title: "Forskrift om systemansvaret (FOS) — balansering og reservemarked",
    text: "FOS regulerer balansetjenester og reservemarkeder i det nordiske kraftsystemet. Statnett anskaffer frekvensreserver (FCR-N, FCR-D, aFRR, mFRR) gjennom markedsbaserte mekanismer og bilaterale avtaler. Balanseansvarlige aktorer er ansvarlige for aa opprettholde balanse mellom sin produksjon og sitt forbruk. Ubalanseavregning skjer paa kvartbasis med ubalansepris basert paa marginalprising av aktiverte reserver.",
    code_type: "balancing",
    version: "2024",
    effective_date: "2024-01-01",
    url: "https://statnett.no/for-aktorer-i-kraftbransjen/systemansvaret/",
  },
  {
    reference: "Statnett tilknytningsvilkaar 2023",
    title: "Statnetts vilkaar for tilknytning til sentralnettet",
    text: "Statnetts tilknytningsvilkaar fastsetter tekniske krav for nye produksjonsanlegg og forbruksanlegg som tilknyttes sentralnettet (132 kV og over). Kravene omfatter aktiv og reaktiv effektregulering, frekvensrespons, feilhaandtering (fault ride-through), spenningskvalitet, kommunikasjon med systemoperatoeren, og krav til vernutstyr. Kravene er harmonisert med EU-nettregler (RfG, DCC, HVDC) og Nordisk grid code.",
    code_type: "grid_connection",
    version: "2023",
    effective_date: "2023-01-01",
    url: "https://statnett.no/for-aktorer-i-kraftbransjen/tilknytning/",
  },
];

const insertGridCode = db.prepare(`
  INSERT INTO grid_codes (reference, title, text, code_type, version, effective_date, url)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertGridAll = db.transaction(() => {
  for (const g of gridCodes) {
    insertGridCode.run(g.reference, g.title, g.text, g.code_type, g.version, g.effective_date, g.url);
  }
});
insertGridAll();
console.log(`Inserted ${gridCodes.length} grid codes`);

// -- Decisions (RME) --

const decisions = [
  {
    reference: "RME-2024-001",
    title: "Vedtak om inntektsramme for Elvia AS for 2024",
    text: "RME har fastsatt inntektsrammen for Elvia AS for 2024 til 8.450 millioner kroner. Inntektsrammen er beregnet paa grunnlag av effektivitetskrav, investeringsbehov, og driftsomkostninger. RME har lagt til grunn et effektivitetskrav paa 1,8 prosent for driftsomkostninger. Elvia AS er Norges stoerste nettselskap og leverer stroem til om lag 1,5 millioner kunder i Oslo, Innlandet og Viken.",
    decision_type: "revenue_cap",
    date_decided: "2024-03-01",
    parties: "Elvia AS",
    url: "https://nve.no/reguleringsmyndigheten/nettleie/inntektsrammer/",
  },
  {
    reference: "RME-2024-002",
    title: "Vedtak om tarifferingsmodell for sentralnettet",
    text: "RME har godkjent Statnetts tarifferingsmodell for sentralnettet. Modellen fordeler sentralnettets kostnader mellom produsenter og forbrukere basert paa marginaltapssatser, effektledd, og fastledd. RME stiller krav om at tariffen skal gi riktige prissignaler for lokalisering av ny produksjon og forbruk, og at tariffstrukturen skal vaere i samsvar med EUs grensekryssforordning.",
    decision_type: "methodology",
    date_decided: "2024-06-15",
    parties: "Statnett SF",
    url: "https://nve.no/reguleringsmyndigheten/nettleie/tariffer/",
  },
  {
    reference: "RME-2023-005",
    title: "Vedtak om effektivitetsmaalning av nettselskaper — benchmarking 2023",
    text: "RME har gjennomfoert den aarlige effektivitetsmaaling (benchmarking) av norske nettselskaper. Benchmarkingen sammenligner selskapenes kostnadseffektivitet basert paa DEA-modeller (Data Envelopment Analysis). Gjennomsnittlig effektivitetsscore for bransjen er 93 prosent. Resultatene brukes som grunnlag for fastsetting av individuelle effektivitetskrav i inntektsrammereguleringen.",
    decision_type: "benchmark",
    date_decided: "2023-10-01",
    parties: "Alle norske nettselskaper",
    url: "https://nve.no/reguleringsmyndigheten/nettleie/effektivitet/",
  },
];

const insertDecision = db.prepare(`
  INSERT INTO decisions (reference, title, text, decision_type, date_decided, parties, url)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertDecAll = db.transaction(() => {
  for (const d of decisions) {
    insertDecision.run(d.reference, d.title, d.text, d.decision_type, d.date_decided, d.parties, d.url);
  }
});
insertDecAll();
console.log(`Inserted ${decisions.length} decisions`);

// -- Summary --

const stats = {
  regulators: (db.prepare("SELECT count(*) as cnt FROM regulators").get() as { cnt: number }).cnt,
  regulations: (db.prepare("SELECT count(*) as cnt FROM regulations").get() as { cnt: number }).cnt,
  grid_codes: (db.prepare("SELECT count(*) as cnt FROM grid_codes").get() as { cnt: number }).cnt,
  decisions: (db.prepare("SELECT count(*) as cnt FROM decisions").get() as { cnt: number }).cnt,
  regulations_fts: (db.prepare("SELECT count(*) as cnt FROM regulations_fts").get() as { cnt: number }).cnt,
  grid_codes_fts: (db.prepare("SELECT count(*) as cnt FROM grid_codes_fts").get() as { cnt: number }).cnt,
  decisions_fts: (db.prepare("SELECT count(*) as cnt FROM decisions_fts").get() as { cnt: number }).cnt,
};

console.log(`\nDatabase summary:`);
console.log(`  Regulators:       ${stats.regulators}`);
console.log(`  Regulations:      ${stats.regulations} (FTS: ${stats.regulations_fts})`);
console.log(`  Grid codes:       ${stats.grid_codes} (FTS: ${stats.grid_codes_fts})`);
console.log(`  Decisions:        ${stats.decisions} (FTS: ${stats.decisions_fts})`);
console.log(`\nDone. Database ready at ${DB_PATH}`);

db.close();
