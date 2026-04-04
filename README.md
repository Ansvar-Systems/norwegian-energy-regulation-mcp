# Norwegian Energy Regulation MCP

MCP server for Norwegian energy sector regulations -- NVE concession rules, RME network tariffs, Statnett grid codes, DSB safety rules.

[![npm version](https://badge.fury.io/js/@ansvar%2Fnorwegian-energy-regulation-mcp.svg)](https://www.npmjs.com/package/@ansvar/norwegian-energy-regulation-mcp)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Covers four Norwegian energy regulators with full-text search across regulations, grid codes, and regulatory decisions. All data is in Norwegian.

Built by [Ansvar Systems](https://ansvar.eu) -- Stockholm, Sweden

---

## Regulators Covered

| Regulator | Role | Website |
|-----------|------|---------|
| **NVE** (Norges vassdrags- og energidirektorat) | Concessions, water resources, renewable energy, dam safety, energy regulation | [nve.no](https://nve.no) |
| **RME** (Reguleringsmyndigheten for energi) | Network tariffs, revenue caps, market supervision, third-party access | [nve.no/reguleringsmyndigheten](https://nve.no/reguleringsmyndigheten) |
| **Statnett SF** (Norwegian TSO) | Electricity transmission, grid codes (FOSA/FOS), balancing market, Nord Pool integration | [statnett.no](https://statnett.no) |
| **DSB** (Direktoratet for samfunnssikkerhet og beredskap) | Electrical safety, gas safety, emergency preparedness | [dsb.no](https://dsb.no) |

---

## Quick Start

### Use Remotely (No Install Needed)

**Endpoint:** `https://mcp.ansvar.eu/norwegian-energy-regulation/mcp`

| Client | How to Connect |
|--------|---------------|
| **Claude Desktop** | Add to `claude_desktop_config.json` (see below) |
| **Claude Code** | `claude mcp add norwegian-energy-regulation --transport http https://mcp.ansvar.eu/norwegian-energy-regulation/mcp` |

**Claude Desktop** -- add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "norwegian-energy-regulation": {
      "type": "url",
      "url": "https://mcp.ansvar.eu/norwegian-energy-regulation/mcp"
    }
  }
}
```

### Use Locally (npm)

```bash
npx @ansvar/norwegian-energy-regulation-mcp
```

Or add to Claude Desktop config for stdio:

```json
{
  "mcpServers": {
    "norwegian-energy-regulation": {
      "command": "npx",
      "args": ["-y", "@ansvar/norwegian-energy-regulation-mcp"]
    }
  }
}
```

---

## Tools

| Tool | Description |
|------|-------------|
| `no_energy_search_regulations` | Full-text search across energy regulations from NVE, RME, and DSB |
| `no_energy_get_regulation` | Get a specific regulation by reference string (e.g., `LOV-1990-06-29-50`) |
| `no_energy_search_grid_codes` | Search Statnett grid codes (FOSA/FOS), balancing rules, and market regulations |
| `no_energy_get_grid_code` | Get a specific grid code document by database ID |
| `no_energy_search_decisions` | Search RME network tariff decisions, revenue caps, and methodology approvals |
| `no_energy_about` | Return server metadata: version, regulators, tool list, data coverage |
| `no_energy_list_sources` | List data sources with record counts and provenance URLs |
| `no_energy_check_data_freshness` | Check data freshness and staleness status for each source |

Full tool documentation: [TOOLS.md](TOOLS.md)

---

## Data Coverage

| Source | Records | Content |
|--------|---------|---------|
| NVE | 124 regulations | Energiloven, concession rules, water resources, renewable energy, dam safety |
| DSB | 30 regulations | Electrical safety, gas safety, emergency preparedness |
| RME | 19 regulations | Network tariff methodology, market supervision, third-party access |
| Statnett | 73 grid codes | FOSA/FOS grid codes, balancing rules, frequency regulation, Nord Pool integration |
| RME (decisions) | 54 decisions | Revenue caps, benchmarking, methodology approvals, market monitoring |
| **Total** | **300 records** | ~420 KB database |

**Language note:** All regulatory content is in Norwegian. Search queries work best in Norwegian (e.g., `energiloven`, `nettleie`, `inntektsramme`, `konsesjon`).

Full coverage details: [COVERAGE.md](COVERAGE.md)

---

## Data Sources

See [sources.yml](sources.yml) for machine-readable provenance metadata.

---

## Docker

```bash
docker build -t norwegian-energy-regulation-mcp .
docker run --rm -p 3000:3000 -v /path/to/data:/app/data norwegian-energy-regulation-mcp
```

Set `NO_ENERGY_DB_PATH` to use a custom database location (default: `data/no-energy.db`).

---

## Development

```bash
npm install
npm run build
npm run seed         # populate sample data
npm run dev          # HTTP server on port 3000
```

---

## Further Reading

- [TOOLS.md](TOOLS.md) -- full tool documentation with examples
- [COVERAGE.md](COVERAGE.md) -- data coverage and limitations
- [sources.yml](sources.yml) -- data provenance metadata
- [DISCLAIMER.md](DISCLAIMER.md) -- legal disclaimer
- [PRIVACY.md](PRIVACY.md) -- privacy policy
- [SECURITY.md](SECURITY.md) -- vulnerability disclosure

---

## License

Apache-2.0 -- [Ansvar Systems AB](https://ansvar.eu)

See [LICENSE](LICENSE) for the full license text.

See [DISCLAIMER.md](DISCLAIMER.md) for important legal disclaimers about the use of this regulatory data.

---

[ansvar.ai/mcp](https://ansvar.ai/mcp) -- Full MCP server catalog
