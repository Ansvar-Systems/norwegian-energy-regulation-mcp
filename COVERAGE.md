# Coverage -- Norwegian Energy Regulation MCP

Current coverage of Norwegian energy sector regulatory data.

**Last updated:** 2026-04-04

---

## Sources

| Source | Authority | Records | Content |
|--------|-----------|---------|---------|
| **NVE** | Norwegian Water Resources and Energy Directorate | 124 regulations | Energiloven, concession rules, water resources, renewable energy, dam safety |
| **DSB** | Directorate for Civil Protection | 30 regulations | Electrical safety (el-tilsynsloven), gas safety, emergency preparedness |
| **RME** | Energy Regulatory Authority | 19 regulations | Network tariff methodology, market supervision, third-party access |
| **Statnett** | Norwegian TSO | 73 grid codes | FOSA/FOS grid codes, balancing rules, frequency regulation, grid connection, Nord Pool integration |
| **RME (decisions)** | Energy Regulatory Authority | 54 decisions | Revenue caps, tariff determinations, methodology approvals, benchmarking |
| **Total** | | **300 records** | ~420 KB SQLite database |

---

## Regulation Types

| Type | Norwegian Term | Count | Regulators |
|------|-------------|-------|------------|
| `forskrift` | Forskrift (Regulation) | 100 | NVE, RME, DSB |
| `retningslinje` | Retningslinje (Guideline) | 32 | NVE, RME |
| `lov` | Lov (Act/Law) | 31 | Stortinget via NVE |
| `veiledning` | Veiledning (Guidance) | 10 | NVE, DSB |

## Grid Code Types

| Type | Description | Count |
|------|-------------|-------|
| `technical_regulation` | Technical requirements (FOSA) for generation, consumption, and storage | 27 |
| `grid_connection` | Grid connection requirements for transmission and distribution | 21 |
| `market_regulation` | Market rules for electricity trading and Nord Pool integration | 11 |
| `balancing` | Balancing market rules, frequency regulation, and reserves | 8 |
| `ancillary_services` | System services (FCR-N, FCR-D, aFRR, mFRR) | 6 |

## Decision Types

| Type | Description | Count |
|------|-------------|-------|
| `benchmark` | Benchmarking of network operator efficiency (DEA) | 19 |
| `revenue_cap` | Revenue cap (inntektsramme) determinations for network operators | 18 |
| `methodology` | Methodology approvals for tariff calculation and cost allocation | 12 |
| `market_monitoring` | Market monitoring and surveillance reports | 3 |
| `complaint` | Consumer and industry complaint rulings | 2 |

---

## What Is NOT Included

This is a seed dataset. The following are not yet covered:

- **Full text of original documents** -- records contain summaries, not complete legal text from lovdata.no
- **Court decisions** -- Energiklagenemnda rulings and court decisions are not included
- **Historical and repealed regulations** -- only current in-force regulations are covered
- **EU energy directives** -- EU Electricity Directive, Gas Directive, Renewable Energy Directive, etc. are covered by the [EU Regulations MCP](https://github.com/Ansvar-Systems/EU_compliance_MCP), not this server
- **Stortinget proceedings** -- parliamentary energy debates and committee reports are not included
- **Municipal energy plans** -- local authority energy and climate plans are not covered
- **Individual tariff schedules** -- utility-specific tariff sheets are not included (only RME approval decisions)

---

## Limitations

- **Seed dataset** -- 300 records across regulations, grid codes, and decisions
- **Norwegian text only** -- all regulatory content is in Norwegian. English search queries may return limited results.
- **Summaries, not full legal text** -- records contain representative summaries, not the complete official text from lovdata.no or regulator websites.
- **Quarterly manual refresh** -- data is updated manually. Recent regulatory changes may not be reflected.
- **No real-time tracking** -- amendments and repeals are not tracked automatically.

---

## Planned Improvements

Full automated ingestion is planned from:

- **lovdata.no** -- Norwegian legislation (lover, forskrifter)
- **nve.no** -- NVE regulations, concession decisions, water resource management
- **nve.no/reguleringsmyndigheten** -- RME network tariff decisions, methodology documents
- **statnett.no** -- Statnett grid codes (FOSA/FOS), balancing rules, market regulations
- **dsb.no** -- DSB safety regulations, electrical safety, emergency preparedness

---

## Language

All content is in Norwegian. The following search terms are useful starting points:

| Norwegian Term | English Equivalent |
|-------------|-------------------|
| energiloven | energy act |
| nettleie | network tariff |
| inntektsramme | revenue cap |
| konsesjon | concession |
| elsikkerhet | electrical safety |
| vannkraft | hydropower |
| nettilknytning | grid connection |
| frekvens | frequency |
| systemdrift | system operation |
| balansetjenester | balancing services |
| reservemarked | reserve market |
| vindkraft | wind power |
| fjernvarme | district heating |
| beredskap | emergency preparedness |
