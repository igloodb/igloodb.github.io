import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Braces,
  Check,
  ChevronRight,
  Database,
  Layers3,
  RefreshCw,
  Terminal,
} from "lucide-react";
import { Layout } from "../components/layout";
import { GithubMark, IglooMark } from "../components/brand";
import { EngineIllustration } from "../components/engine-illustration";
import { Playground } from "../components/playground";
import { CodeBlock } from "../components/code-block";
import { REPOSITORY } from "../lib/site";

export default function Home() {
  return (
    <Layout>
      <main id="main">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <Link className="release-note" href="/docs/agents/">
                <span className="release-version">PREVIEW</span>
                <span>New: MCP, JSON &amp; database connectors</span>
                <ChevronRight size={13} />
              </Link>
              <h1>
                All your data.
                <br />
                One SQL <span>engine.</span>
              </h1>
              <p>
                Bring PostgreSQL and Parquet together.
                <br className="desktop-break" /> Query with familiar SQL. Cache
                results in Arrow.
                <br className="desktop-break" /> Built in Rust, for a more
                connected view.
              </p>
              <div className="hero-actions">
                <Link className="button" href="/docs/quickstart/">
                  Start building <ArrowUpRight size={17} />
                </Link>
                <a className="button secondary" href={REPOSITORY}>
                  <GithubMark size={18} />
                  Explore on GitHub
                </a>
              </div>
              <div className="hero-footnote">
                <span className="status-dot" />
                Open source & MIT licensed
                <span className="footnote-separator">/</span>Experimental, by
                design
              </div>
            </div>
            <EngineIllustration />
          </div>
          <div className="container hero-bottom">
            <span>LESS FRAGMENTATION. MORE POSSIBILITIES.</span>
            <a href="#features">
              Meet your query engine <ArrowDown size={14} />
            </a>
          </div>
        </section>
        <div className="technology-strip">
          <div className="container technology-inner">
            <p>
              Good foundations.
              <br />
              <strong>Open standards.</strong>
            </p>
            <div className="technology">
              <Braces size={23} />
              <span>Rust</span>
            </div>
            <div className="technology">
              <Blocks size={23} />
              <span>Apache DataFusion</span>
            </div>
            <div className="technology">
              <ArrowUpRight size={27} />
              <span>Apache Arrow</span>
            </div>
            <div className="technology">
              <Database size={22} />
              <span>PostgreSQL</span>
            </div>
            <div className="technology">
              <Layers3 size={22} />
              <span>Parquet</span>
            </div>
          </div>
        </div>
        <section className="features-section section-space" id="features">
          <div className="container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <span className="tiny-cross">+</span> SMALL ENGINE. SHARED
                  CONTEXT.
                </p>
                <h2>
                  Data lives in different places.
                  <br />
                  Your questions shouldn’t have to.
                </h2>
              </div>
              <p>
                Igloo brings live databases and local files into one
                <br className="desktop-break" /> query engine, with a result
                cache close at hand.
              </p>
            </div>
            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-number">
                  01 <span>CONNECT</span>
                </div>
                <div className="mini-federation" aria-hidden="true">
                  <span>
                    <Database size={16} />
                    orders_db
                  </span>
                  <span className="join-symbol">⋈</span>
                  <span>
                    <Database size={16} />
                    crm
                  </span>
                </div>
                <h3>Your sources, one query.</h3>
                <p>
                  Join multiple PostgreSQL databases and local Parquet datasets.
                  The source preview adds ADBC drivers and named Parquet tables
                  with inferred schemas.
                </p>
                <Link href="/docs/connectors/">
                  Explore federation <ArrowUpRight size={15} />
                </Link>
              </article>
              <article className="feature-card">
                <div className="feature-number">
                  02 <span>REUSE</span>
                </div>
                <div className="mini-cache" aria-hidden="true">
                  <div>
                    <span>query</span>
                    <span className="cache-arrow">→</span>
                    <span className="mini-cache-hit">
                      <Check size={12} />
                      Arrow cache
                    </span>
                  </div>
                  <div className="cache-blocks">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
                <h3>Keep the work you’ve done.</h3>
                <p>
                  Cache Arrow record batches in memory with LRU eviction and
                  TTL. New JSON change events clear the cache for the next
                  query.
                </p>
                <Link href="/docs/caching/">
                  Understand the cache <ArrowUpRight size={15} />
                </Link>
              </article>
              <article className="feature-card">
                <div className="feature-number">
                  03 <span>QUERY</span>
                </div>
                <div className="mini-terminal" aria-hidden="true">
                  <span>
                    <i />
                    <i />
                    <i />
                  </span>
                  <code>
                    <b>psql</b> -p 5442
                    <br />
                    <em>igloo&gt;</em> SELECT …
                  </code>
                </div>
                <h3>Familiar tools, new context.</h3>
                <p>
                  A PostgreSQL wire endpoint for simple and prepared queries.
                  The source preview adds MCP and a JSON CLI for agents to
                  discover tables, inspect plans, and run read-only queries.
                </p>
                <Link href="/docs/postgres/">
                  Connect a SQL client <ArrowUpRight size={15} />
                </Link>
              </article>
            </div>
          </div>
        </section>
        <Playground />
        <section className="how-section section-space" id="how-it-works">
          <div className="container">
            <div className="how-intro">
              <p className="eyebrow">
                <span className="tiny-cross">+</span> UNDER THE HOOD
              </p>
              <h2>
                One process.
                <br />
                Thoughtfully connected.
              </h2>
              <p>
                Small, understandable building blocks. Apache DataFusion plans
                the query; Apache Arrow carries the data.
              </p>
              <Link className="text-link" href="/docs/architecture/">
                Take the architecture tour <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="how-steps">
              <article>
                <span className="step-number">01</span>
                <div>
                  <h3>Connect your sources</h3>
                  <p>
                    Define PostgreSQL catalogs in TOML. Tables are discovered
                    automatically, alongside a local Parquet-backed table.
                  </p>
                </div>
                <Database size={23} />
              </article>
              <article>
                <span className="step-number">02</span>
                <div>
                  <h3>Plan, push down, execute</h3>
                  <p>
                    DataFusion plans SQL and combines sources. Supported filters
                    run closer to PostgreSQL; joins and remaining work run in
                    the engine.
                  </p>
                </div>
                <Blocks size={23} />
              </article>
              <article>
                <span className="step-number">03</span>
                <div>
                  <h3>Cache results, respond to change</h3>
                  <p>
                    Reuse Arrow batches for eligible queries. The background
                    listener polls for JSON events and invalidates the cache.
                  </p>
                </div>
                <RefreshCw size={23} />
              </article>
            </div>
          </div>
        </section>
        <section className="quickstart-section" id="get-started">
          <div className="container quickstart-grid">
            <div>
              <p className="eyebrow">
                <span className="tiny-cross">+</span> FROM SOURCE TO SQL
              </p>
              <h2>
                Give your curiosity
                <br />a query engine.
              </h2>
              <p>
                Start with the self-contained market analytics demo.
                <br className="desktop-break" />
                No database setup. Just Rust and a little curiosity.
              </p>
              <Link className="text-link" href="/docs/quickstart/">
                Read the full quickstart <ArrowRight size={16} />
              </Link>
              <span className="requirements">
                <Terminal size={14} />
                Requires Rust 1.88+ · first build compiles DataFusion
              </span>
            </div>
            <CodeBlock
              title="Your terminal"
              code={
                "git clone https://github.com/igloodb/igloodb.git\ncd igloodb\ncargo run --locked -- crypto-demo"
              }
            />
          </div>
        </section>
        <section className="project-section section-space">
          <div className="container">
            <div className="project-top">
              <div>
                <p className="eyebrow">
                  <span className="tiny-cross">+</span> BUILT IN THE OPEN
                </p>
                <h2>
                  A clear view of
                  <br />
                  where we are. And what’s next.
                </h2>
              </div>
              <p>
                Igloo is early, experimental, and open to contribution.
                <br className="desktop-break" /> Help shape the engine one
                useful piece at a time.
              </p>
            </div>
            <div className="project-grid">
              <div className="project-status">
                <span className="status-label">
                  <span className="status-dot" />
                  IN THE ENGINE TODAY
                </span>
                <h3>A working foundation.</h3>
                <ul>
                  <li>
                    <Check size={16} />
                    Single-node SQL federation
                  </li>
                  <li>
                    <Check size={16} />
                    Arrow-native LRU + TTL cache
                  </li>
                  <li>
                    <Check size={16} />
                    PostgreSQL wire protocol
                  </li>
                  <li>
                    <Check size={16} />
                    File-based CDC invalidation
                  </li>
                  <li>
                    <Check size={16} />
                    MCP + JSON CLI (source preview)
                  </li>
                  <li>
                    <Check size={16} />
                    ADBC + named Parquet (source preview)
                  </li>
                </ul>
              </div>
              <div className="project-roadmap">
                <span className="status-label">
                  <span className="planned-dot" />
                  ON THE ROADMAP
                </span>
                <h3>A bigger horizon.</h3>
                <p>
                  Real CDC streams. Dependency-aware caching. Iceberg tables.
                  More tested database drivers. Distributed execution.
                </p>
                <Link href="/docs/roadmap/">
                  See the project roadmap <ArrowUpRight size={16} />
                </Link>
              </div>
              <a className="contribute-card" href={REPOSITORY}>
                <GithubMark size={27} />
                <h3>
                  Good software
                  <br />
                  starts with a conversation.
                </h3>
                <p>
                  Read the code, open an issue,
                  <br />
                  or make your first contribution.
                </p>
                <span>
                  Build with us <ArrowUpRight size={17} />
                </span>
              </a>
            </div>
          </div>
        </section>
        <section className="closing-section">
          <div className="container closing-inner">
            <div className="closing-brand">
              <IglooMark />
              <div>
                <h2>Bring your data together.</h2>
                <p>Start small. Query something interesting.</p>
              </div>
            </div>
            <Link className="button" href="/docs/quickstart/">
              Get started with Igloo <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
