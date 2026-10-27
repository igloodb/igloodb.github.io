# Igloo: source analysis and website scope

Reviewed engine: [igloodb/igloodb at 1633204](https://github.com/igloodb/igloodb/tree/163320482d98bc3d6c49eb85acb0f511461a8284).

The source repository's GitHub description still describes a distributed engine with Iceberg CDC. The README, architecture evolution notes, Rust implementation, and roadmap show a smaller current runtime. The website follows implemented behavior and explicitly separates future direction.

## Objective and audience

Igloo aims to provide one SQL access layer over independent data sources, reduce repeated query work with an Arrow-native result cache, and eventually make cache freshness responsive to source changes. The current audience is developers experimenting with Rust, DataFusion, federated SQL, and caching. It is an experimental service rather than a production distributed database.

The website should answer, in order: what it is, which data it queries, what a real query looks like, how the components work, how to run it, and what remains to build. A working first experience is more useful than aspirational capability lists or unsupported benchmark claims.

## Implemented functionality

| Area | Evidence | Current contract |
| --- | --- | --- |
| Entrypoints | `src/main.rs`, `src/lib.rs` | One crate, library and binary. Plain invocation runs a one-shot join and ADBC smoke test; `serve` is a long-running SQL server; `crypto-demo` is self-contained. |
| Configuration | `src/config.rs`, `igloo.example.toml` | Fail-fast TOML + environment overrides, required Parquet/CDC locations and PostgreSQL sources, redacted secrets, named multi-source entries. |
| SQL planning | `src/datafusion_engine.rs`, Cargo.toml | DataFusion 44, Arrow 53, Tokio, Rust minimum 1.88. SQL execution returns Arrow record batches. |
| PostgreSQL | `src/catalog.rs`, `src/postgres_table.rs` | `information_schema` base-table discovery, one shared tokio-postgres connection per source, canonical catalogs, deterministic aliases, schema-qualified scans. Views are skipped; unsupported columns are warned/skipped. |
| Federation | `tests/multi_source.rs`, `tests/postgres_federation.rs` | Multiple PostgreSQL databases plus Parquet, cross-source joins, catalog discovery. Canonical identifiers are `<source>.<schema>.<table>`. |
| Pushdown | `src/pushdown.rs`, `tests/pushdown.rs` | Supported predicate translation and projection; Inexact classification causes local re-filtering. String ordering stays local. Limit pushdown is gated to avoid dropping valid rows. |
| Parquet | `register_iceberg_table` | Local ListingTable called `iceberg`; fixed `user_id: Int64` and `data: Utf8` schema. No Iceberg catalog, manifests, snapshots, or materialized views. |
| Result caching | `src/cache_layer.rs`, `src/server.rs` | Thread-safe, process-local Arrow batches. SQL parse/display normalization with lexical fallback; configurable entry-count LRU and TTL. Default 1,024 entries, 300 seconds. No byte budget or logical-plan keys. |
| Cache eligibility | `src/server.rs` | Eligible SELECT/WITH requests without parameters can cache. Parameterized queries bypass caching. Both simple and zero-parameter extended queries share the cache path. |
| CDC | `src/cdc_sync.rs`, `src/main.rs` | Background polling in serve mode; default interval 10 seconds. Newly seen JSON filenames invalidate the whole cache. Paths are deduplicated in memory. No WAL subscription or dependency-aware invalidation. |
| Client interface | `src/server.rs`, `tests/pgwire_server.rs` | PostgreSQL simple and extended protocol; prepared parameters, type inference, text/binary formats. Unauthenticated plaintext. Protocol compatibility is not full PostgreSQL semantics or universal BI certification. |
| ADBC | `src/adbc_postgres.rs`, `src/main.rs` | Standalone dynamically loaded C-driver FFI example on the one-shot demo path. Not underneath DataFusion; not required to run serve/crypto-demo. |
| Analytics demo | `src/crypto_metrics.rs` | Deterministic BTC/ETH/SOL hourly OHLCV generation, latest close, daily volume/VWAP, SMA(24), rolling 24h log-return volatility, maximum drawdown. Existing Parquet is reused. |

## Source structure

The thin binary dispatches into config, engine, cache, CDC, server, and demo modules. The engine owns a DataFusion SessionContext. Catalog introspection builds Arrow schemas; custom PostgreSQL providers and a Parquet ListingTable expose data to the planner. Pushdown translation is a separate pure module. The pgwire handler handles caching and parameter decoding around engine execution. CDC is an independent invalidation task. Errors are shared through `src/errors.rs`.

The live PostgreSQL integration suites cover catalogs, pushdown equivalence, cross-source queries, and the wire server. They are gated by `IGLOO_TEST_POSTGRES_URI`; the multi-source suite needs a disposable server on which it can create databases. No engine files are changed by this website work.

## Query lifecycle

1. A client connects to the configured pgwire listener and sends SQL.
2. An eligible zero-parameter query looks up its normalized SQL in the in-memory cache.
3. On a miss, DataFusion plans the query against the configured source catalogs.
4. PostgreSQL scans apply supported pushdown; local Parquet supplies columnar data.
5. DataFusion performs the remaining filtering, joins, and aggregates and collects Arrow batches.
6. Eligible results populate the cache and are encoded for the client.
7. The background listener clears the cache when a new JSON event filename appears. Queries otherwise remain cached until TTL expiry or LRU eviction.

Parameterized requests are bound to typed values and executed without result caching.

## Onboarding issues reflected in documentation

- `crypto-demo` branches before configuration loading and does not call the ADBC test. It is the reliable self-contained introduction.
- The engine does not automatically load `.env`; exporting variables or a dotenv tool is required.
- The Compose file runs plain `igloo`, rather than `igloo serve`, and exposes no pgwire port. The Dockerfile uses Rust 1.87 while Cargo.toml declares 1.88. The shipped dummy directory has a JSON file but no Parquet dataset. The website does not advertise it as a complete server installation.
- An empty, existing Parquet directory is enough for a PostgreSQL-only serving setup. OHLCV data has a different schema and must not be reused as the `iceberg` table directory.
- The legacy `pg_table` alias requires an introspected `my_pg_table`; it is not a built-in source table. Examples identify the required schemas.
- Current client parameter decoding requires appropriate types; small default Psycopg integers may encode as int2 against an inferred int8 column. The client guide documents Int8 for bigint fields.
- Source updates do not themselves invalidate the cache today. JSON file creation or TTL is required. Existing file paths are not processed again on modification.

## Roadmap boundaries

The roadmap includes plan fingerprinting, byte budgets, replication ingestion, table-dependent invalidation, incremental refresh, cache persistence, Arrow Flight SQL, other connectors, observability, authentication/TLS, real Iceberg integration, and distributed execution. The website never labels these as currently available. No customer logos, adoption statistics, latency measurements, or speedup ratios are invented.

## Website implementation

The original site repository was an untouched Nextra demonstration with unrelated counters and Satori pages. It is replaced with a custom static Next.js site, preserving the repository and original license. Dependencies are pinned and the lockfile is committed. There are no server-only routes or third-party integrations.

The homepage has a connected narrative: engine overview and architecture illustration, concrete capabilities, three SQL examples with an explicitly simulated cache lifecycle, a query-flow explanation, a verified quickstart, current/future project status, and contribution paths. Eight full documentation pages plus an index provide deeper references. Native dialog search indexes the same structured documentation used to render pages. Responsive navigation, keyboard tabs, focus states, reduced motion, copy buttons, metadata, original SVG branding, a social card, sitemap, robots, and an accessible 404 complete the site.

CI builds and validates static output, runs desktop/mobile browser tests with automated accessibility checks, and deploys the `out/` artifact to GitHub Pages on main. Pull requests run checks without publishing.
