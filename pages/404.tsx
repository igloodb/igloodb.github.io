import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Layout } from "../components/layout";
import { IglooMark } from "../components/brand";
export default function NotFound() {
  return (
    <Layout title="Page not found" path="/404.html">
      <main id="main" className="not-found container">
        <IglooMark />
        <p className="eyebrow">404 / A LITTLE OFF THE TRAIL</p>
        <h1>This query came up empty.</h1>
        <p>That page may have moved. Your next step is close by.</p>
        <div>
          <Link className="button" href="/">
            Back to Igloo
            <ArrowRight size={16} />
          </Link>
          <Link className="button secondary" href="/docs/">
            Browse the docs
          </Link>
        </div>
      </main>
    </Layout>
  );
}
