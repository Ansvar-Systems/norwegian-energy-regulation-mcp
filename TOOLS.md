# Tools -- Norwegian Energy Regulation MCP

8 tools for searching and retrieving Norwegian energy sector regulations.

All data is in Norwegian. Tool descriptions and parameter names are in English.

---

## 1. no_energy_search_regulations

Search across Norwegian energy regulations from NVE, RME, and DSB. Returns lover (acts), forskrifter (regulations), veiledninger (guidance), and retningslinjer (guidelines). Supports Norwegian-language queries.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query in Norwegian or English (e.g., `energiloven`, `konsesjon`, `elsikkerhet`, `vannkraft`, `nettleie`) |
| `regulator` | string | No | Filter by regulator: `nve`, `rme`, `dsb` |
| `type` | string | No | Filter by regulation type: `lov`, `forskrift`, `veiledning`, `retningslinje` |
| `status` | string | No | Filter by status: `in_force`, `repealed`, `draft`. Defaults to all. |
| `limit` | number | No | Maximum results (default 20, max 100) |

**Returns:** Array of matching regulations with reference, title, text, type, status, effective date, and URL.

**Example:**

```json
{
  "query": "energiloven",
  "regulator": "nve",
  "status": "in_force"
}
```

**Data sources:** NVE (nve.no), RME (nve.no/reguleringsmyndigheten), DSB (dsb.no), lovdata.no.

**Limitations:** Summaries, not full legal text. Norwegian-language content only.

---

## 2. no_energy_get_regulation

Get a specific Norwegian energy regulation by its reference string. Returns the full record including text, metadata, and URL.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `reference` | string | Yes | Regulation reference (e.g., `LOV-1990-06-29-50`) |

**Returns:** Single regulation record with all fields, or an error if not found.

**Example:**

```json
{
  "reference": "LOV-1990-06-29-50"
}
```

**Data sources:** lovdata.no, nve.no, dsb.no.

**Limitations:** Exact match on reference string. Partial matches are not supported -- use `no_energy_search_regulations` for fuzzy search.

---

## 3. no_energy_search_grid_codes

Search Statnett grid codes (FOSA/FOS), balancing rules, Nord Pool integration, and capacity allocation. Covers systemdrift, balansetjenester, frekvens, nettilknytning, and reservemarked.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query (e.g., `systemdrift`, `balansetjenester`, `frekvens`, `nettilknytning`, `reservemarked`) |
| `code_type` | string | No | Filter by code type: `technical_regulation`, `market_regulation`, `grid_connection`, `balancing`, `ancillary_services` |
| `limit` | number | No | Maximum results (default 20, max 100) |

**Returns:** Array of matching grid code documents with reference, title, text, code type, version, effective date, and URL.

**Example:**

```json
{
  "query": "systemdrift",
  "code_type": "technical_regulation"
}
```

**Data sources:** Statnett (statnett.no).

**Limitations:** Summaries of technical regulations, not the full PDF documents. Norwegian-language content only.

---

## 4. no_energy_get_grid_code

Get a specific Statnett grid code document by its database ID. The ID is returned in search results from `no_energy_search_grid_codes`.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `document_id` | number | Yes | Grid code document ID (from search results) |

**Returns:** Single grid code record with all fields, or an error if not found.

**Example:**

```json
{
  "document_id": 2
}
```

**Data sources:** Statnett (statnett.no).

**Limitations:** Requires a valid database ID. Use `no_energy_search_grid_codes` to find IDs.

---

## 5. no_energy_search_decisions

Search RME network tariff decisions, revenue cap (inntektsramme) determinations, and market methodology approvals. Covers nettleie, inntektsramme, tariffering, and tredjepartstilgang.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query (e.g., `nettleie`, `inntektsramme`, `tariffering`, `tredjepartstilgang`) |
| `decision_type` | string | No | Filter by decision type: `tariff`, `revenue_cap`, `methodology`, `benchmark`, `complaint`, `market_monitoring` |
| `limit` | number | No | Maximum results (default 20, max 100) |

**Returns:** Array of matching decisions with reference, title, text, decision type, date decided, parties, and URL.

**Example:**

```json
{
  "query": "inntektsramme",
  "decision_type": "revenue_cap"
}
```

**Data sources:** RME (nve.no/reguleringsmyndigheten).

**Limitations:** Summaries of decisions, not full legal text. Norwegian-language content only.

---

## 6. no_energy_about

Return metadata about this MCP server: version, list of regulators covered, tool list, and data coverage summary. Takes no parameters.

**Parameters:** None.

**Returns:** Server name, version, description, list of regulators (id, name, URL), and tool list (name, description).

**Example:**

```json
{}
```

**Data sources:** N/A (server metadata).

**Limitations:** None.

---

## 7. no_energy_list_sources

List data sources with record counts, provenance URLs, and last refresh dates.

**Parameters:** None.

**Returns:** Array of data sources with id, name, URL, record count, data type, last refresh date, and refresh frequency.

**Example:**

```json
{}
```

**Data sources:** N/A (server metadata).

**Limitations:** None.

---

## 8. no_energy_check_data_freshness

Check data freshness for each source. Reports staleness status and provides update instructions.

**Parameters:** None.

**Returns:** Freshness table with source, last refresh date, frequency, and status (Current/Due/OVERDUE).

**Example:**

```json
{}
```

**Data sources:** N/A (server metadata).

**Limitations:** None.
