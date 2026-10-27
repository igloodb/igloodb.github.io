import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { Layout } from "../../components/layout";
import { docs } from "../../lib/docs";
export default function DocsIndex() {
  return (
    <Layout title="Documentation" path="/docs/">
      <main className="container docs-index section-space" id="main">
        <p className="eyebrow">
          <BookOpen size={15} />
          THE IGLOO HANDBOOK
        </p>
        <h1>
          A little context.
          <br />A lot to build on.
        </h1>
        <p>Get running, connect your data, and understand the engine.</p>
        <div className="docs-index-grid">
          {docs.map((doc) => (
            <Link href={"/docs/" + doc.slug + "/"} key={doc.slug}>
              <span className="eyebrow">{doc.group}</span>
              <h2>
                {doc.title}
                <ArrowUpRight size={19} />
              </h2>
              <p>{doc.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
