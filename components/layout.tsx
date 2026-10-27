import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Menu,
  Search,
  X,
} from "lucide-react";
import { IglooMark, GithubMark } from "./brand";
import { docs } from "../lib/docs";
import { REPOSITORY, SITE_URL } from "../lib/site";

export function SearchDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const results = docs.filter((doc) =>
    (
      doc.title +
      " " +
      doc.description +
      " " +
      doc.sections.map((s) => [s.title, ...s.body, ...(s.list || []), ...(s.table?.rows.flat() || []), s.code?.code || "", ...(s.links?.map((link) => link.label) || [])].join(" ")).join(" ")
    )
      .toLowerCase()
      .includes(query.toLowerCase().trim()),
  );
  function open() {
    dialog.current?.showModal();
    input.current?.focus();
  }
  function close() {
    dialog.current?.close();
  }
  useEffect(() => {
    function handle(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) close();
        else open();
      }
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);
  useEffect(() => {
    close();
  }, [router.asPath]);
  return (
    <>
      <button
        className="search-trigger"
        onClick={open}
        aria-label="Search documentation"
      >
        <Search size={17} />
        <span>Search docs</span>
        <kbd>⌘ K</kbd>
      </button>
      <dialog
        className="search-dialog"
        ref={dialog}
        aria-labelledby="search-title"
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        <div className="search-input-row">
          <Search size={21} />
          <label className="sr-only" id="search-title" htmlFor="docs-search">
            Search documentation
          </label>
          <input
            id="docs-search"
            ref={input}
            placeholder="Search the Igloo docs…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
          <button
            className="icon-button"
            onClick={close}
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>
        <div className="search-results">
          <p className="eyebrow" aria-live="polite">
            {query ? results.length + " results" : "Explore the documentation"}
          </p>
          {results.length ? (
            results.map((doc) => (
              <Link
                key={doc.slug}
                href={"/docs/" + doc.slug + "/"}
                className="search-result"
                onClick={close}
              >
                <BookOpen size={19} />
                <span>
                  <strong>{doc.title}</strong>
                  <small>{doc.description}</small>
                </span>
                <ArrowRight size={17} />
              </Link>
            ))
          ) : (
            <p className="search-empty">
              No matching pages. Try “cache”, “Postgres”, or “configuration”.
            </p>
          )}
        </div>
        <div className="search-foot">
          Use Tab to navigate{" "}
          <span>
            <kbd>esc</kbd> to close
          </span>
        </div>
      </dialog>
    </>
  );
}
function Header() {
  const [menu, setMenu] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setMenu(false);
  }, [router.asPath]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label="Igloo home">
          <IglooMark />
          <span>
            igloo<span className="brand-dot">.</span>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="/#features">Why Igloo</Link>
          <Link href="/docs/connectors/">Connectors</Link>
          <Link href="/docs/agents/">For AI agents</Link>
          <Link
            href="/docs/quickstart/"
            aria-current={
              router.pathname.startsWith("/docs") ? "page" : undefined
            }
          >
            Documentation
          </Link>
        </nav>
        <div className="header-actions">
          <SearchDialog />
          <a
            className="github-nav"
            href={REPOSITORY}
            aria-label="Igloo on GitHub"
          >
            <GithubMark />
          </a>
          <Link href="/docs/quickstart/" className="button small">
            Get started <ArrowUpRight size={15} />
          </Link>
          <button
            className="menu-toggle icon-button"
            aria-label={menu ? "Close navigation" : "Open navigation"}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
        {menu && (
          <nav
            className="mobile-nav"
            id="mobile-nav"
            aria-label="Mobile navigation"
          >
            <Link href="/#features">Why Igloo</Link>
            <Link href="/docs/connectors/">Connectors</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/docs/agents/">For AI agents</Link>
            <Link href="/docs/quickstart/">Documentation</Link>
            <Link href="/docs/roadmap/">Roadmap</Link>
            <a href={REPOSITORY}>
              GitHub <ArrowUpRight size={15} />
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div>
          <Link href="/" className="brand">
            <IglooMark />
            <span>
              igloo<span className="brand-dot">.</span>
            </span>
          </Link>
          <p>
            SQL context for developers
            <br />
            and their AI agents.
          </p>
        </div>
        <div className="footer-links">
          <div>
            <h3>Explore</h3>
            <Link href="/#features">Why Igloo</Link>
            <Link href="/#playground">Query walkthrough</Link>
            <Link href="/docs/architecture/">Architecture</Link>
          </div>
          <div>
            <h3>Build</h3>
            <Link href="/docs/quickstart/">Quickstart</Link>
            <Link href="/docs/agents/">Agent guide</Link>
            <Link href="/docs/connectors/">Database connectors</Link>
            <Link href="/docs/configuration/">Configuration</Link>
            <Link href="/docs/sql/">SQL reference</Link>
          </div>
          <div>
            <h3>Open source</h3>
            <a href={REPOSITORY}>
              GitHub <ArrowUpRight size={12} />
            </a>
            <Link href="/docs/contributing/">Contribute</Link>
            <Link href="/docs/roadmap/">Roadmap</Link>
            <a href="/llms.txt">llms.txt</a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          Built in the open. Released under the{" "}
          <a href={REPOSITORY + "/blob/main/LICENSE"}>MIT License</a>.
        </span>
        <span>
          <span className="status-dot" />
          Experimental · v0.1.0
        </span>
      </div>
    </footer>
  );
}
export function Layout({
  children,
  title,
  description,
  path = "/",
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  path?: string;
}) {
  const fullTitle = title
    ? title + " — Igloo"
    : "Igloo — SQL context for developers and AI agents.";
  const summary =
    description ||
    "One SQL interface across your databases. Native PostgreSQL, compatible ADBC drivers, and Parquet snapshots for AI agents and developers. MCP, JSON, and typed discovery. Experimental and open source.";
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={summary} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f6f8f5" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="canonical" href={SITE_URL + path} />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="Agent documentation index" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Igloo" />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={summary} />
        <meta property="og:url" content={SITE_URL + path} />
        <meta property="og:image" content={SITE_URL + "/social-card.png"} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      {children}
      <Footer />
    </>
  );
}
