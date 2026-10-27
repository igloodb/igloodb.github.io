import { source } from "./site";
import { agentDoc } from "./agent-doc";
export type DocSection = {
  id: string;
  title: string;
  body: string[];
  code?: { title: string; language?: string; code: string };
  list?: string[];
  table?: { headings: string[]; rows: string[][] };
  note?: string;
};
export type Doc = {
  slug: string;
  title: string;
  group: string;
  description: string;
  source: string;
  sourceLabel?: string;
  sections: DocSection[];
};
export const docs: Doc[] = [
  {
    slug: "quickstart",
    title: "Quickstart",
    group: "Start here",
    description: "Run your first Arrow-native SQL queries with Igloo.",
    source: source("src/main.rs"),
    sections: [
      {
        id: "before-you-start",
        title: "Before you start",
        body: [
          "Igloo is an experimental, single-node SQL query engine. It runs SQL with Apache DataFusion and represents results as Apache Arrow record batches. The source currently requires Rust 1.88 or later and a linker/toolchain for your operating system.",
          "The fastest way to explore the engine is crypto-demo. It generates deterministic sample market data and runs a suite of analytical queries. No PostgreSQL server, configuration file, or ADBC driver is needed for this mode.",
          "For coding agents, the separate Build with AI agents guide covers native MCP, JSON commands and an in-memory demo in the agent interface update. That update may not yet be in a published release.",
        ],
      },
      {
        id: "run-the-demo",
        title: "1. Run the self-contained demo",
        body: [
          "Clone the engine repository and run the demo. The first build compiles DataFusion and its dependencies, so allow time and disk space for a substantial Rust build.",
        ],
        code: {
          title: "Terminal",
          code: "git clone https://github.com/igloodb/igloodb.git\ncd igloodb\ncargo run --locked -- crypto-demo",
        },
        note: "The demo writes Parquet data to ./crypto_ohlcv_data when the directory has no Parquet files. Use IGLOO_CRYPTO_PARQUET_PATH to select another directory.",
      },
      {
        id: "what-you-get",
        title: "2. Explore the results",
        body: [
          "The demo synthesizes one week of hourly OHLCV candles for BTC, ETH, and SOL, then computes latest close, daily volume, daily VWAP, SMA(24), rolling 24-hour log-return volatility, and maximum drawdown.",
          "These are deterministic example data, rather than live prices. Existing Parquet files in the target directory are reused. The crypto_ohlcv schema and SQL builders are defined in src/crypto_metrics.rs.",
        ],
        code: {
          title: "Use your own OHLCV data",
          code: "IGLOO_CRYPTO_PARQUET_PATH=/path/to/ohlcv \\\n  cargo run --locked -- crypto-demo",
        },
      },
      {
        id: "next-steps",
        title: "3. Connect your own data",
        body: [
          "To query PostgreSQL and Parquet together, configure sources and start the PostgreSQL wire server. Follow the PostgreSQL guide for a complete setup, or read the configuration reference for multi-source catalogs.",
          "The current Docker Compose setup starts the one-shot demo rather than the SQL server, ships no Parquet fixture, and uses a Rust image older than the declared minimum. The source-based workflows here avoid presenting that setup as a ready-to-run server.",
        ],
      },
    ],
  },
  agentDoc,
  {
    slug: "postgres",
    title: "Connect PostgreSQL",
    group: "Start here",
    description:
      "Configure live sources and query them through the PostgreSQL wire protocol.",
    source: source("src/server.rs"),
    sections: [
      {
        id: "prepare-data",
        title: "Prepare a PostgreSQL source",
        body: [
          "Have a reachable development PostgreSQL database and a PostgreSQL client such as psql. Create a small table in your own test database, or use an existing base table. Igloo discovers base tables in the configured schemas; views are skipped.",
        ],
        code: {
          title: "Run in your development PostgreSQL database",
          language: "sql",
          code: "CREATE TABLE public.customers (\n  id BIGINT PRIMARY KEY,\n  name TEXT\n);\nINSERT INTO public.customers VALUES (1, 'Alex'), (2, 'Sam');",
        },
      },
      {
        id: "configuration",
        title: "Configure the engine",
        body: [
          "In the engine repository root, save the following as igloo.toml. Create the two directories before starting. The parquet_path directory must exist. It may be empty when you only query PostgreSQL.",
          "The legacy table named iceberg reads local .parquet files with user_id: Int64 (non-null) and data: Utf8. Keep the OHLCV demo directory separate because its schema differs.",
        ],
        code: {
          title: "igloo.toml",
          language: "toml",
          code: 'parquet_path = "./local_parquet/"\ncdc_path = "./local_cdc/"\nlisten_addr = "127.0.0.1:5442"\n\n[[sources]]\nname = "app"\nschemas = ["public"]\n# Supply the URI with IGLOO_SOURCE_APP_URI.',
        },
      },
      {
        id: "start-server",
        title: "Start the SQL server",
        body: [
          "Set the source URI to your development database. Environment variables override file values. The serve command initializes the catalogs, result cache, and background CDC polling loop. Unlike plain cargo run, serve does not execute the standalone ADBC smoke test.",
        ],
        code: {
          title: "Terminal · from the engine checkout",
          code: "mkdir -p local_parquet local_cdc\nexport IGLOO_SOURCE_APP_URI='postgres://USER:PASSWORD@localhost:5432/DATABASE'\ncargo run --locked -- serve",
        },
        note: "The current server has no authentication or TLS. Keep listen_addr on localhost or a trusted, isolated development network. Authentication and TLS are roadmap work.",
      },
      {
        id: "query",
        title: "Connect with psql",
        body: [
          "In another terminal, use the configured port to connect to Igloo. Canonical table names contain the source, schema, and table. SHOW TABLES and information_schema expose the federated catalog.",
        ],
        code: {
          title: "Terminal",
          code: "psql -h 127.0.0.1 -p 5442 -U igloo -d igloo \\\n  -c 'SELECT * FROM app.public.customers;'\n\npsql -h 127.0.0.1 -p 5442 -U igloo -d igloo \\\n  -c 'SHOW TABLES;'",
        },
        note: "PostgreSQL wire compatibility covers simple queries and the extended query protocol. It does not imply full PostgreSQL SQL semantics, authentication, or compatibility with every BI tool. Client parameter types must match the inferred query types.",
      },
    ],
  },
  {
    slug: "configuration",
    title: "Configuration",
    group: "Build with Igloo",
    description:
      "Sources, catalogs, environment overrides, and cache settings.",
    source: source("igloo.example.toml"),
    sections: [
      {
        id: "loading",
        title: "Configuration loading",
        body: [
          "Igloo reads ./igloo.toml when present. Set IGLOO_CONFIG to use another file. Environment variables override file values. Required paths and sources are validated at startup; there are no silent localhost defaults.",
          "The environment is read directly. A .env file is not automatically loaded by the engine; export its variables using your shell or a dotenv tool.",
        ],
      },
      {
        id: "multi-source",
        title: "Multiple PostgreSQL sources",
        body: [
          "Declare one [[sources]] entry per PostgreSQL database. Each source becomes a DataFusion catalog. Use environment variables for connection strings so credentials stay out of the file. Source names use lowercase letters, digits, and underscores, starting with a letter.",
        ],
        code: {
          title: "igloo.toml",
          language: "toml",
          code: 'parquet_path = "./local_parquet/"\ncdc_path = "./local_cdc/"\nlisten_addr = "127.0.0.1:5442"\n\n[[sources]]\nname = "orders_db"\nschemas = ["public", "billing"]\ntables = ["orders", "customers"]\n\n[[sources]]\nname = "crm"\nschemas = ["public"]',
        },
        note: "Set IGLOO_SOURCE_ORDERS_DB_URI and IGLOO_SOURCE_CRM_URI before startup. The optional tables allowlist filters by table name. Omit it to discover all base tables in the selected schemas.",
      },
      {
        id: "environment",
        title: "Environment reference",
        body: [
          "The single-source shorthand uses postgres_uri and optional postgres_schemas in TOML, or DATABASE_URL / IGLOO_POSTGRES_URI in the environment. Do not combine the single-source and [[sources]] forms in the config file.",
        ],
        table: {
          headings: ["Variable", "Purpose", "Default / requirement"],
          rows: [
            [
              "IGLOO_CONFIG",
              "TOML config file path",
              "./igloo.toml if present",
            ],
            ["IGLOO_PARQUET_PATH", "Local Parquet directory", "Required"],
            ["IGLOO_CDC_PATH", "JSON event directory", "Required"],
            [
              "DATABASE_URL",
              "Primary PostgreSQL URI",
              "Wins over IGLOO_POSTGRES_URI",
            ],
            [
              "IGLOO_POSTGRES_URI",
              "Single-source PostgreSQL URI",
              "Required in single-source mode",
            ],
            ["IGLOO_POSTGRES_SCHEMAS", "Comma-separated schema list", "public"],
            [
              "IGLOO_SOURCE_<NAME>_URI",
              "Named source connection string",
              "Required if URI omitted in TOML",
            ],
            [
              "IGLOO_SOURCE_<NAME>_SCHEMAS",
              "Named source schema override",
              "public",
            ],
            [
              "IGLOO_LISTEN_ADDR",
              "PostgreSQL wire bind address",
              "Required for serve",
            ],
            ["IGLOO_CACHE_MAX_ENTRIES", "Positive cache entry limit", "1024"],
            ["IGLOO_CACHE_TTL_SECONDS", "Positive cache TTL", "300"],
            ["IGLOO_CDC_POLL_SECONDS", "Positive polling interval", "10"],
            [
              "IGLOO_CRYPTO_PARQUET_PATH",
              "OHLCV demo directory",
              "./crypto_ohlcv_data",
            ],
            ["RUST_LOG", "env_logger log level", "info"],
          ],
        },
      },
      {
        id: "aliases",
        title: "Catalog names and aliases",
        body: [
          "The canonical identifier is <source>.<schema>.<table>, such as orders_db.billing.invoices. These names are always unambiguous and appear in SHOW TABLES.",
          "Short aliases are allocated in configured source order: table, then schema__table, then source__schema__table. The first configured source keeps an available bare name; a later table is never silently substituted. Use canonical identifiers in shared queries.",
        ],
      },
    ],
  },
  {
    slug: "architecture",
    title: "Architecture",
    group: "Understand the engine",
    description: "Follow a query through the single-process Rust engine.",
    source: source("docs/ARCHITECTURE.md"),
    sections: [
      {
        id: "overview",
        title: "A small, composable engine",
        body: [
          "Igloo is currently one Rust crate with a library and a binary, running in a single process. Apache DataFusion provides SQL planning and execution; Apache Arrow provides in-memory schemas and record batches. PostgreSQL and local Parquet are the implemented data sources.",
          "The PostgreSQL path uses a custom DataFusion TableProvider backed by tokio-postgres. ADBC is a separate FFI example used by the one-shot demo, rather than the connector underneath DataFusion. Distributed scheduling is future work.",
        ],
      },
      {
        id: "query-flow",
        title: "The query path",
        body: [
          "In serve mode, a PostgreSQL wire request reaches the query handler. Cacheable, zero-parameter statements first look up the normalized SQL in the result cache. A hit returns the saved Arrow batches.",
          "On a miss, DataFusion plans against registered catalogs. PostgreSQL providers generate schema-qualified SELECT queries with supported projection and filter pushdown; the Parquet provider scans local files. DataFusion performs the remaining filtering, joins, and aggregation before collecting result batches.",
          "Eligible results enter the cache, then the server encodes them into the client’s requested PostgreSQL text or binary representation. Parameterized statements are bound and executed without result caching.",
        ],
        list: [
          "Client → PostgreSQL wire handler → result cache",
          "Cache miss → DataFusion → PostgreSQL / local Parquet",
          "Arrow record batches → cache (when eligible) → client",
          "Background JSON CDC polling → whole-cache invalidation",
        ],
      },
      {
        id: "modules",
        title: "Source map",
        body: ["The code is organized into focused modules inside src/."],
        table: {
          headings: ["Module", "Responsibility"],
          rows: [
            ["main.rs / lib.rs", "CLI dispatch and library entry points"],
            [
              "config.rs",
              "TOML, environment overrides, validation, secret redaction",
            ],
            ["server.rs", "PostgreSQL wire protocol and query handling"],
            [
              "datafusion_engine.rs",
              "SessionContext, table registration, query execution",
            ],
            [
              "catalog.rs",
              "PostgreSQL introspection and deterministic aliases",
            ],
            [
              "postgres_table.rs",
              "Custom TableProvider, scans, PostgreSQL-to-Arrow decoding",
            ],
            ["pushdown.rs", "Conservative expression-to-SQL translation"],
            [
              "cache_layer.rs",
              "Thread-safe Arrow result cache, SQL keys, LRU, TTL",
            ],
            [
              "cdc_sync.rs",
              "JSON event discovery, path deduplication, polling",
            ],
            ["crypto_metrics.rs", "OHLCV fixtures and analytical SQL builders"],
            ["adbc_postgres.rs", "Standalone experimental ADBC C driver FFI"],
            ["errors.rs", "Shared error types"],
          ],
        },
      },
      {
        id: "pushdown",
        title: "Conservative filter pushdown",
        body: [
          "Supported comparisons, null checks, literal IN / NOT IN lists, and AND expressions can be translated into PostgreSQL WHERE clauses. Unsupported expressions stay local. DataFusion re-applies pushed filters because the provider reports them as Inexact.",
          "String ordering predicates are kept local to avoid collation differences. Limit pushdown is gated when filters cannot all be translated. The differential test suite compares pushed and unpushed execution.",
        ],
      },
      {
        id: "storage",
        title: "Arrow and Parquet today",
        body: [
          "The table called iceberg is a DataFusion ListingTable over a plain directory of Parquet files. It has a fixed user_id / data schema. It has no Apache Iceberg manifests, snapshots, transactions, or materialized views.",
          "Actual Iceberg tables, persistent cache backends, and additional connectors are described in the roadmap.",
        ],
      },
    ],
  },
  {
    slug: "caching",
    title: "Caching & freshness",
    group: "Understand the engine",
    description: "What the result cache does, and how it becomes fresh again.",
    source: source("src/cache_layer.rs"),
    sections: [
      {
        id: "arrow-native",
        title: "Arrow-native results",
        body: [
          "The cache stores the actual Arrow RecordBatch values produced by a query. It is shared through Arc<Cache> and protected by a mutex. It tracks hits, misses, LRU evictions, TTL evictions, and entry count through stats().",
          "serve caches eligible SELECT / WITH statements without parameters. Parameterized statements bypass the cache so different bindings cannot share a result. The cache is process-local and is lost on restart.",
        ],
      },
      {
        id: "keys",
        title: "SQL keys",
        body: [
          "Keys are derived from a PostgreSQL-dialect parse and display round-trip, with quote-aware lexical normalization as a fallback. Whitespace, SQL keyword case, and trailing semicolons can normalize to the same key. String literal contents remain significant.",
          "This is SQL text normalization, rather than logical-plan fingerprinting. Semantically equivalent queries are not guaranteed to share a cache entry.",
        ],
      },
      {
        id: "limits",
        title: "LRU and TTL",
        body: [
          "The default capacity is 1,024 entries and the default TTL is 300 seconds. Both are configurable and must be positive. A new entry beyond capacity evicts the least recently used entry. Expired entries miss on access and are removed.",
          "The limit counts entries rather than bytes. It is not a memory budget: one large result may consume significant memory.",
        ],
        code: {
          title: "igloo.toml",
          language: "toml",
          code: "cache_max_entries = 1024\ncache_ttl_seconds = 300\ncdc_poll_seconds = 10",
        },
      },
      {
        id: "cdc",
        title: "File-based change events",
        body: [
          "In serve mode, a background task polls cdc_path. It reads newly discovered .json files and clears the entire result cache if any new event is found. Files are deduplicated by path for the lifetime of the listener.",
          "Event contents do not currently identify affected tables or drive row-level updates. Use a new filename for each event; rewriting a previously seen file does not create a new event.",
        ],
        code: {
          title: "Example · signal a change in a new file",
          code: "printf '%s\\n' '{\"event\":\"update\"}' > local_cdc/event-002.json",
        },
        note: "This is a local invalidation mechanism. Igloo does not yet subscribe to PostgreSQL WAL or ingest a real CDC stream. Source updates alone do not invalidate a cached result; freshness depends on new event files or TTL expiry.",
      },
      {
        id: "next",
        title: "Planned improvements",
        body: [
          "The roadmap includes logical replication, dependency-aware invalidation, plan-based cache keys, a byte budget, persistent backends, and observable freshness policies. These are not available in the current implementation.",
        ],
      },
    ],
  },
  {
    slug: "sql",
    title: "SQL & clients",
    group: "Build with Igloo",
    description:
      "Federation, local files, catalog discovery, and prepared queries.",
    source: source("src/datafusion_engine.rs"),
    sections: [
      {
        id: "federation",
        title: "Join PostgreSQL sources",
        body: [
          "Declare orders_db and crm in [[sources]], then query them using qualified names. The following query requires the illustrated orders and contacts tables in your own databases; they are not built-in fixtures.",
        ],
        code: {
          title: "Cross-source join",
          language: "sql",
          code: "SELECT o.id, c.email, o.total\nFROM orders_db.public.orders AS o\nJOIN crm.public.contacts AS c\n  ON o.contact_id = c.id\nWHERE o.total > 100\nORDER BY o.total DESC;",
        },
      },
      {
        id: "local-files",
        title: "Join Parquet and PostgreSQL",
        body: [
          "iceberg is the local Parquet-backed table. pg_table is a legacy alias registered when an introspected source has a my_pg_table table. Your Parquet files must match the fixed user_id: Int64, data: Utf8 schema. Prefer canonical names for new PostgreSQL queries.",
        ],
        code: {
          title: "Parquet + PostgreSQL",
          language: "sql",
          code: "SELECT i.user_id, i.data, p.extra_info\nFROM iceberg AS i\nJOIN pg_table AS p ON i.user_id = p.user_id\nWHERE i.user_id = 42;",
        },
      },
      {
        id: "catalogs",
        title: "Discover registered tables",
        body: [
          "Igloo enables DataFusion’s information_schema. PostgreSQL catalogs are created at startup from discovered base tables; unsupported column types are skipped with a warning.",
        ],
        code: {
          title: "Catalog discovery",
          language: "sql",
          code: "SHOW TABLES;\n\nSELECT table_catalog, table_schema, table_name\nFROM information_schema.tables;",
        },
      },
      {
        id: "prepared",
        title: "Prepared statements",
        body: [
          "The PostgreSQL endpoint supports Parse / Bind / Execute with numbered parameters. DataFusion infers parameter types from context when clients leave them unspecified. Text and binary result formats are supported.",
          "Match the client’s bound value type to the inferred type. For example, current Psycopg integer auto-encoding may choose int2 for a small value while the query expects int8; use psycopg.types.numeric.Int8 for a bigint column. The implementation does not guarantee every PostgreSQL driver behavior.",
          "Prepared statements with parameters bypass result caching. Use your client library’s parameter API rather than interpolating values into SQL.",
        ],
        code: {
          title: "Query text for a prepared statement",
          language: "sql",
          code: "SELECT * FROM app.public.customers WHERE id = $1;",
        },
      },
      {
        id: "boundaries",
        title: "Compatibility boundaries",
        body: [
          "The endpoint speaks the PostgreSQL wire protocol, but SQL is planned by DataFusion. PostgreSQL-specific functions, DDL, transactions, and extensions should not be assumed to work.",
          "Authentication, TLS, Arrow Flight SQL, REST/gRPC query endpoints, and documented BI-tool walkthroughs remain roadmap work. The pgwire server is a development endpoint.",
        ],
      },
    ],
  },
  {
    slug: "roadmap",
    title: "Project roadmap",
    group: "Project",
    description:
      "What is implemented, what is evolving, and where to contribute.",
    source: source("ROADMAP.md"),
    sections: [
      {
        id: "today",
        title: "Working today",
        body: [
          "Igloo v0.1.0 is an experimental single-node engine. The following capabilities are implemented in the source revision used for this website. This summary distinguishes shipped components from complete roadmap phases.",
        ],
        list: [
          "SQL execution over PostgreSQL and local Parquet through DataFusion",
          "Multiple PostgreSQL source catalogs and deterministic table aliases",
          "PostgreSQL simple and extended query protocols",
          "Arrow-native result caching with normalized SQL keys, LRU, and TTL",
          "Background JSON event polling with whole-cache invalidation",
          "Conservative PostgreSQL filter and projection pushdown",
          "Self-contained OHLCV analytics demo and market-metric SQL builders",
        ],
      },
      {
        id: "foundation",
        title: "Foundation & service",
        body: [
          "Configuration validation, source introspection, and a long-running server are in place. Further work includes a modular Cargo workspace, graceful shutdown, expanded type coverage, and schema drift handling. Numeric-to-Decimal128 mapping and additional client walkthroughs remain open.",
        ],
      },
      {
        id: "freshness",
        title: "Freshness & cache intelligence",
        body: [
          "The next layers described in the roadmap include PostgreSQL logical replication, table dependency tracking, targeted invalidation, incremental refresh, plan fingerprints, cache byte limits, and persistent storage. Current JSON event polling is the starting point.",
        ],
      },
      {
        id: "interfaces",
        title: "Interfaces & operations",
        body: [
          "Arrow Flight SQL, additional source connectors, metrics export, authentication, TLS, and production operations are planned. Existing PostgreSQL wire support should not be read as a claim of production readiness.",
        ],
      },
      {
        id: "future",
        title: "Longer-term direction",
        body: [
          "Real Apache Iceberg integration and distributed execution are future architecture goals. They are not part of the current runtime. The engine repository’s ROADMAP.md contains detailed acceptance criteria and is the source of truth for ongoing work.",
        ],
      },
    ],
  },
  {
    slug: "contributing",
    title: "Contributing",
    group: "Project",
    description: "Help build the engine or improve this website.",
    source: source("CONTRIBUTING.md"),
    sections: [
      {
        id: "start",
        title: "Start with the source",
        body: [
          "Igloo is open source under the MIT License. Review the architecture and roadmap, then find an issue or propose a focused change in the engine repository. Read CONTRIBUTING.md for the current development requirements.",
          "The website lives in a separate repository, igloodb/igloodb.github.io. Documentation fixes, accessibility improvements, and better examples are welcome there.",
        ],
      },
      {
        id: "engine-checks",
        title: "Engine checks",
        body: [
          "Use the Rust version specified by Cargo.toml. The standard workflow includes unit tests, formatting, and Clippy. When fixing a bug, add a meaningful regression test.",
        ],
        code: {
          title: "Engine repository",
          code: "cargo test --locked\ncargo fmt --all -- --check\ncargo clippy --all-targets --all-features --locked -- -D warnings",
        },
      },
      {
        id: "integration",
        title: "Integration tests",
        body: [
          "Live PostgreSQL suites are gated by IGLOO_TEST_POSTGRES_URI. Use a disposable database: tests create tables, and the multi-source suite creates an additional database on the same server. The configured user needs appropriate permissions.",
        ],
        code: {
          title: "Disposable development database only",
          code: "IGLOO_TEST_POSTGRES_URI='postgres://USER:PASSWORD@localhost:5432/igloo_test' \\\n  cargo test --locked",
        },
      },
      {
        id: "website",
        title: "Website development",
        body: [
          "The website uses Next.js static export, TypeScript, and React. It has no backend dependency and builds to out/ for GitHub Pages. Install the pinned pnpm version from package.json, then run:",
        ],
        code: {
          title: "Website repository",
          code: "pnpm install --frozen-lockfile\npnpm dev\n# Production validation:\npnpm build\npnpm check\npnpm test:e2e",
        },
      },
    ],
  },
];
