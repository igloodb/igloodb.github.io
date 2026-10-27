import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Info,
} from "lucide-react";
import { Layout } from "../../components/layout";
import { CodeBlock } from "../../components/code-block";
import { docs, type Doc } from "../../lib/docs";
const groups = Array.from(new Set(docs.map((doc) => doc.group)));
export default function Documentation({ doc }: { doc: Doc }) {
  const index = docs.findIndex((item) => item.slug === doc.slug);
  return (
    <Layout
      title={doc.title}
      description={doc.description}
      path={"/docs/" + doc.slug + "/"}
    >
      <main id="main" className="container docs-layout">
        <aside className="docs-sidebar">
          <Link href="/docs/quickstart/" className="docs-label">
            <BookOpen size={16} />
            DOCUMENTATION
          </Link>
          <nav aria-label="Documentation">
            {groups.map((group) => (
              <div className="docs-nav-group" key={group}>
                <h2>{group}</h2>
                {docs
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <Link
                      key={item.slug}
                      href={"/docs/" + item.slug + "/"}
                      aria-current={doc.slug === item.slug ? "page" : undefined}
                    >
                      {item.title}
                      {doc.slug === item.slug && <ArrowRight size={13} />}
                    </Link>
                  ))}
              </div>
            ))}
          </nav>
          <a className="docs-source-link" href={doc.source}>
            View engine source <ArrowUpRight size={14} />
          </a>
        </aside>
        <article className="docs-article">
          <div className="docs-breadcrumb">
            <Link href="/">Igloo</Link>
            <span>/</span>
            <span>Documentation</span>
            <span>/</span>
            <span>{doc.title}</span>
          </div>
          <details className="mobile-docs-nav">
            <summary>
              Browse documentation <ChevronDown size={16} />
            </summary>
            <nav aria-label="Documentation pages">
              {docs.map((item) => (
                <Link
                  key={item.slug}
                  href={"/docs/" + item.slug + "/"}
                  aria-current={doc.slug === item.slug ? "page" : undefined}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </details>
          <div className="doc-title">
            <p className="eyebrow">{doc.group}</p>
            <h1>{doc.title}</h1>
            <p>{doc.description}</p>
            <p className="doc-text-links">
              <a href={"/docs/" + doc.slug + ".md"}>Read as Markdown</a>
              {doc.slug === "agents" && <> · <a href="/skills/igloo-query/SKILL.md">Agent skill</a> · <a href="/llms.txt">llms.txt</a></>}
            </p>
          </div>
          {doc.sections.map((section) => (
            <section id={section.id} key={section.id} className="doc-section">
              <h2>
                <a href={"#" + section.id}>
                  {section.title}
                  <span aria-hidden="true">#</span>
                </a>
              </h2>
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              {section.list && (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.code && <CodeBlock {...section.code} />}
              {section.table && (
                <div
                  className="doc-table"
                  tabIndex={0}
                  role="region"
                  aria-label={section.title + " reference table"}
                >
                  <table>
                    <caption className="sr-only">
                      {section.title} reference
                    </caption>
                    <thead>
                      <tr>
                        {section.table.headings.map((heading) => (
                          <th key={heading} scope="col">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>
                              {j === 0 ? <code>{cell}</code> : cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {section.note && (
                <aside className="doc-callout">
                  <Info size={19} />
                  <p>{section.note}</p>
                </aside>
              )}
            </section>
          ))}
          <div className="doc-provenance">
            <p>
              Grounded in the engine source at{" "}
              <a href={doc.source}>
                {doc.sourceLabel || "1633204"} <ArrowUpRight size={11} />
              </a>
              . {doc.sourceLabel ? "The quickstart pins this experimental source revision; it is not a tagged release." : "Check the repository for subsequent changes."}
            </p>
            <a href="https://github.com/igloodb/igloodb.github.io/issues/new">
              Suggest an improvement <ArrowUpRight size={13} />
            </a>
          </div>
          <nav className="doc-pagination" aria-label="Next and previous pages">
            {index > 0 ? (
              <Link href={"/docs/" + docs[index - 1].slug + "/"}>
                <small>
                  <ArrowLeft size={12} />
                  Previous
                </small>
                <strong>{docs[index - 1].title}</strong>
              </Link>
            ) : (
              <span />
            )}
            {index < docs.length - 1 ? (
              <Link
                className="next"
                href={"/docs/" + docs[index + 1].slug + "/"}
              >
                <small>
                  Next
                  <ArrowRight size={12} />
                </small>
                <strong>{docs[index + 1].title}</strong>
              </Link>
            ) : (
              <Link className="next" href="/docs/quickstart/">
                <small>
                  Back to the start
                  <ArrowRight size={12} />
                </small>
                <strong>Quickstart</strong>
              </Link>
            )}
          </nav>
        </article>
        <aside className="docs-toc">
          <p>ON THIS PAGE</p>
          <nav aria-label="On this page">
            {doc.sections.map((section) => (
              <a key={section.id} href={"#" + section.id}>
                {section.title}
              </a>
            ))}
          </nav>
          <div>
            <span className="status-dot" />
            Experimental · v0.1.0
          </div>
        </aside>
      </main>
    </Layout>
  );
}
export const getStaticPaths: GetStaticPaths = () => ({
  paths: docs.map((doc) => ({ params: { slug: doc.slug } })),
  fallback: false,
});
export const getStaticProps: GetStaticProps = ({ params }) => ({
  props: { doc: docs.find((doc) => doc.slug === params?.slug) },
});
