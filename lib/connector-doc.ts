import type { Doc } from "./docs";
import { AGENT_SOURCE_COMMIT, AGENT_SOURCE_URL } from "./site";

export const connectorDoc: Doc = {
  slug: "connectors",
  title: "Database connectors",
  group: "Start here",
  description: "Broad database coverage through native adapters, compatible ADBC drivers, and open data formats.",
  source: AGENT_SOURCE_URL + "/docs/CONNECTORS.md",
  sourceLabel: "connector preview " + AGENT_SOURCE_COMMIT.slice(0, 7) + " (unreleased)",
  sections: [
    {
      id: "coverage-goal",
      title: "One interface across database families",
      body: [
        "Igloo's goal is a common SQL and agent interface across databases, warehouses and lakehouses. Coverage grows through native adapters, compatible ADBC drivers, open-format snapshots, and planned replication or bridge integrations. All routes share DataFusion catalogs and the same MCP/JSON query contract.",
        "This preview adds a generic ADBC adapter and named local Parquet sources with inferred schemas. PostgreSQL and SQLite ADBC 1.7.0 have live integration coverage. Other drivers are validation candidates; an installed driver does not establish certified Igloo compatibility.",
      ],
      note: "Broad database support is the product direction. It is not a claim that every database, authentication mode or server version already works. The source preview is pinned in the agent quickstart.",
    },
    {
      id: "routes",
      title: "Three implemented routes",
      body: ["Choose a route that matches the source. Native PostgreSQL remains available alongside ADBC and named local Parquet catalogs."],
      table: {
        headings: ["Route", "Configuration", "Current behavior"],
        rows: [
          ["Native PostgreSQL", "[[sources]]", "Existing introspection, aliases and tested conservative pushdown"],
          ["Generic ADBC", "[[adbc_sources]]", "Metadata discovery and streamed Arrow batches from a compatible trusted driver"],
          ["Local Parquet snapshots", "[[parquet_sources]]", "Inferred schemas and multiple named tables; no fixed two-column restriction"],
        ],
      },
    },
    {
      id: "matrix",
      title: "Database coverage and evidence",
      body: ["Verification currently covers Linux x86_64, SQLite/PostgreSQL ADBC 1.7.0 and PostgreSQL 15. The tests exercise metadata, allowlists, NULLs, quoted identifiers, projections, counts and joins, including native PostgreSQL joined to its ADBC route and SQLite joined to a distinct Parquet schema."],
      table: {
        headings: ["Database / source", "Route", "Igloo status"],
        rows: [
          ["PostgreSQL", "Native and ADBC", "Live integration tests"],
          ["SQLite", "ADBC", "Live integration tests"],
          ["Local Parquet", "Named snapshots", "Schema inference and join tests"],
          ["MySQL / SQL Server / Oracle", "Compatible ADBC driver", "Database-specific validation pending"],
          ["Snowflake / BigQuery / Redshift", "Compatible ADBC driver", "Database-specific validation pending"],
          ["Databricks / DuckDB / ClickHouse", "Compatible ADBC driver", "Database-specific validation pending"],
          ["Trino / Presto / Flight SQL services", "Compatible ADBC driver", "Database-specific validation pending"],
          ["Cassandra / Teradata / SingleStore", "Compatible ADBC driver", "Database-specific validation pending"],
          ["Iceberg catalogs", "Snapshot-aware reader", "Planned; manifests and deletes not yet implemented"],
          ["MongoDB / DB2 / other non-ADBC sources", "Native adapter or replicated table", "Planned; no direct connector claim"],
          ["JDBC / ODBC-only systems", "Bridge or native adapter", "Planned; no bridge implemented"],
        ],
      },
    },
    {
      id: "adbc-config",
      title: "Configure a compatible ADBC driver",
      body: [
        "Install a trusted driver outside Igloo and supply its absolute shared-library path. The current Rust manager loads the ADBC 1.1.0 C ABI. dbc can manage installation, but Igloo does not automatically resolve dbc manifests; use the driver's setup guide to locate its library.",
        "One source represents one remote database/catalog. Metadata uses GetObjects and GetTableSchema. Set catalog explicitly if discovery returns multiple catalogs. Schema/table allowlists are exact and rechecked locally; a missing explicit table fails startup. Base tables are registered as source.schema.table; an absent remote schema uses public locally. ADBC does not add short aliases.",
      ],
      code: {
        title: "igloo.toml · driver-specific values required",
        language: "toml",
        code: '[[adbc_sources]]\nname = "warehouse"\ndriver = "/absolute/path/to/adbc_driver.so"\n# Or set IGLOO_SOURCE_WAREHOUSE_DRIVER.\n# Supply IGLOO_SOURCE_WAREHOUSE_URI when the driver uses a URI.\ncatalog = "analytics"\nschemas = ["public"]\ntables = ["customers", "orders"]\ndialect = "ansi" # ansi, mysql, mssql: identifier quoting only\n\n[adbc_sources.options_env]\nusername = "WAREHOUSE_USER"\npassword = "WAREHOUSE_PASSWORD"',
      },
      note: "Credentials and TLS/timeout options are driver-specific. Database options use options/options_env; connection options use connection_options/connection_options_env. Use restricted source roles. Drivers are trusted native code configured by the operator, never supplied from model input.",
    },
    {
      id: "sqlite-example",
      title: "A SQLite source without PostgreSQL",
      body: [
        "Install SQLite ADBC 1.7.0 through its trusted distribution, then set IGLOO_SOURCE_LOCAL_DB_DRIVER to the native library's absolute path. For example, the Linux adbc-driver-sqlite Python wheel includes libadbc_driver_sqlite.so. Python distributes the library; the Rust adapter does not require Python at query time.",
        "Use an existing SQLite file with a customers table and save this TOML. No PostgreSQL source, dummy Parquet directory, CDC path or model key is required. Run igloo schema, then query local_db.public.customers or connect the same configuration through igloo mcp.",
      ],
      code: {
        title: "igloo.toml · existing SQLite database",
        language: "toml",
        code: '[[adbc_sources]]\nname = "local_db"\nuri = "/absolute/path/to/demo.sqlite"\ntables = ["customers"]\n# Set IGLOO_SOURCE_LOCAL_DB_DRIVER in the environment.',
      },
    },
    {
      id: "parquet",
      title: "Named Parquet snapshots with inferred schemas",
      body: [
        "Each named Parquet source is a catalog with tables in its public schema. Point tables at local Parquet files or directories. Schemas are inferred; customer/order schemas can be joined with native or ADBC data without editing Rust.",
        "These are consistent exported snapshots. The optional legacy parquet_path still registers the old fixed-schema iceberg table, but it is not needed for named sources. S3/object-store support is not added by this local connector.",
      ],
      code: {
        title: "igloo.toml · local snapshots",
        language: "toml",
        code: '[[parquet_sources]]\nname = "lake"\ntables = [\n  { name = "orders", path = "/data/snapshot/orders.parquet" },\n  { name = "customers", path = "/data/snapshot/customers/" }\n]\n# Query lake.public.orders and lake.public.customers.',
      },
      note: "A raw Iceberg data directory is not a complete snapshot. Reading manifests, snapshots, delete files and schema evolution is required for correct Iceberg semantics. Do not point this reader at raw Iceberg data and assume those semantics.",
    },
    {
      id: "query-vs-replication",
      title: "Live querying and replication are separate paths",
      body: [
        "Columnar/dbc illustrates the standards-based driver route for database access. OLake illustrates source replication into Iceberg and Parquet. Igloo can build on compatible drivers for live queries, while a real lakehouse reader would let it query correctly replicated data from additional sources.",
        "ADBC is not a CDC protocol. Igloo does not yet implement transaction-log replication, checkpoints, deletes, schema-change recovery or an OLake integration. Real Iceberg catalog/snapshot reads and interoperability tests are next work. A deliberately exported consistent local Parquet snapshot is usable today.",
      ],
      links: [
        { label: "Columnar database access", href: "https://columnar.tech/" },
        { label: "dbc driver documentation", href: "https://docs.columnar.tech/dbc/" },
        { label: "OLake replication and open formats", href: "https://olake.io/" },
        { label: "ADBC specification", href: "https://arrow.apache.org/adbc/current/format/specification.html" },
      ],
    },
    {
      id: "agent-discovery",
      title: "Discover connector coverage from an agent",
      body: [
        "Run igloo connectors for offline JSON coverage, or call igloo_connectors through MCP. This distinguishes tested integrations, driver candidates and planned routes. Use igloo_schema to inspect the tables actually registered by a configured instance, including their connector type.",
        "Generic ADBC leaves filters and joins in DataFusion and uses database-specific quoting only for generated SELECT projections. Scans stream Arrow batches through a two-batch queue on blocking workers. This does not bound a driver's batch size or remote work, and dropping a timed-out query cannot interrupt a blocked C call. Configure source-side timeouts. Source pooling, coordinated snapshots and automatic schema refresh remain future work.",
      ],
      code: { title: "Terminal · built preview", code: "./target/debug/igloo connectors\n./target/debug/igloo schema\n./target/debug/igloo query --sql 'SELECT * FROM local_db.public.customers ORDER BY id'" },
    },
  ],
};
