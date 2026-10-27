export const REPOSITORY = "https://github.com/igloodb/igloodb";
export const SITE_URL = "https://igloodb.github.io";
export const SOURCE_COMMIT = "163320482d98bc3d6c49eb85acb0f511461a8284";
export const source = (path: string) =>
  REPOSITORY + "/blob/" + SOURCE_COMMIT + "/" + path;

export const examples = [
  {
    id: "federation",
    label: "Join across sources",
    filename: "federated_query.sql",
    description:
      "One SQL statement. Two PostgreSQL databases. A single result, assembled by DataFusion.",
    code: "-- Query two independent PostgreSQL sources\nSELECT o.id, c.email, o.total\nFROM orders_db.public.orders AS o\nJOIN crm.public.contacts AS c\n  ON o.contact_id = c.id\nWHERE o.total > 100\nORDER BY o.total DESC;",
    columns: ["id", "email", "total"],
    rows: [
      ["1042", "alex@example.com", "249.00"],
      ["1038", "sam@example.com", "185.50"],
      ["1031", "jules@example.com", "129.00"],
    ],
    sources: ["orders_db", "crm"],
  },
  {
    id: "parquet",
    label: "Postgres + Parquet",
    filename: "parquet_join.sql",
    description:
      "Join the local Parquet-backed iceberg table with live PostgreSQL data using ordinary SQL.",
    code: "-- Combine a Parquet dataset with PostgreSQL\nSELECT i.user_id, i.data, p.extra_info\nFROM iceberg AS i\nJOIN pg_table AS p\n  ON i.user_id = p.user_id\nWHERE i.user_id = 42;",
    columns: ["user_id", "data", "extra_info"],
    rows: [
      ["42", "page_view", "premium"],
      ["42", "checkout", "premium"],
    ],
    sources: ["Parquet", "PostgreSQL"],
  },
  {
    id: "analytics",
    label: "Market analytics",
    filename: "market_metrics.sql",
    description:
      "Explore the OHLCV dataset used by crypto-demo. DataFusion handles aggregation over Arrow batches.",
    code: "-- Volume-weighted average price per asset\nSELECT asset,\n  SUM(close * volume) / SUM(volume) AS vwap\nFROM crypto_ohlcv\nGROUP BY asset\nORDER BY asset;",
    columns: ["asset", "vwap"],
    rows: [
      ["BTC", "64320.42"],
      ["ETH", "3412.18"],
      ["SOL", "142.65"],
    ],
    sources: ["OHLCV Parquet"],
  },
];
