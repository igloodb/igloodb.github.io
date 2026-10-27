import { useState } from "react";
import {
  ArrowRight,
  CircleCheck,
  CornerDownRight,
  Database,
  Play,
  RotateCcw,
} from "lucide-react";
import { examples } from "../lib/site";
import { CopyButton, Highlight } from "./code-block";
export function Playground() {
  const [selected, setSelected] = useState(0);
  const [cache, setCache] = useState<Record<string, boolean>>({});
  const [result, setResult] = useState<
    "ready" | "miss" | "hit" | "invalidated"
  >("ready");
  const example = examples[selected];
  function select(index: number) {
    setSelected(index);
    setResult("ready");
  }
  function run() {
    setResult(cache[example.id] ? "hit" : "miss");
    setCache({ ...cache, [example.id]: true });
  }
  function invalidate() {
    setCache({});
    setResult("invalidated");
  }
  return (
    <section className="playground-section" id="playground">
      <div className="container">
        <div className="section-heading playground-heading">
          <div>
            <p className="eyebrow">
              <span className="tiny-cross">+</span> THE QUERY EXPERIENCE
            </p>
            <h2>
              Different sources.
              <br />
              Same familiar SQL.
            </h2>
          </div>
          <p>
            Follow a query from your sources to the cache.
            <br />
            No new language to learn.
          </p>
        </div>
        <div className="query-tabs" role="tablist" aria-label="Query examples">
          {examples.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              id={"tab-" + item.id}
              aria-controls="query-panel"
              aria-selected={selected === index}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
                ) {
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? examples.length - 1
                        : (selected +
                            (event.key === "ArrowRight" ? 1 : -1) +
                            examples.length) %
                          examples.length;
                  select(next);
                  document.getElementById("tab-" + examples[next].id)?.focus();
                }
              }}
            >
              {item.label}
              <ArrowRight size={14} />
            </button>
          ))}
        </div>
        <div
          className="query-workbench"
          id="query-panel"
          role="tabpanel"
          aria-labelledby={"tab-" + example.id}
        >
          <div className="query-editor">
            <div className="editor-bar">
              <span>
                <span className="file-dot" />
                {example.filename}
              </span>
              <CopyButton text={example.code} />
            </div>
            <div className="editor-code">
              <div className="line-numbers" aria-hidden="true">
                {example.code.split("\n").map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <pre tabIndex={0}>
                <code>
                  <Highlight code={example.code} />
                </code>
              </pre>
            </div>
            <div className="editor-bottom">
              <span>PostgreSQL dialect</span>
              <button className="button lime small" onClick={run}>
                <Play size={13} fill="currentColor" />
                Run sample
              </button>
            </div>
          </div>
          <div className="query-output">
            <div className="editor-bar">
              <span>
                <Database size={15} />
                Result preview
              </span>
              <span className="sample-badge">SAMPLE DATA</span>
            </div>
            <div className="result-table-wrap">
              <table>
                <caption className="sr-only">
                  Illustrative {example.label} results
                </caption>
                <thead>
                  <tr>
                    {example.columns.map((column) => (
                      <th key={column} scope="col">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {example.rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="result-message" aria-live="polite">
              {result === "ready" ? (
                <>
                  <CornerDownRight size={20} aria-hidden="true" />
                  <p>
                    Ready when you are.
                    <small>
                      Run this sample to follow the cache lifecycle.
                    </small>
                  </p>
                </>
              ) : result === "miss" ? (
                <>
                  <CircleCheck size={20} />
                  <p>
                    Cache miss → execute → store
                    <small>Arrow batches are now cached. Run it again.</small>
                  </p>
                </>
              ) : result === "hit" ? (
                <>
                  <CircleCheck size={20} />
                  <p>
                    Cache hit → return saved batches
                    <small>The query reuses its cached result.</small>
                  </p>
                </>
              ) : (
                <>
                  <RotateCcw size={20} />
                  <p>
                    New CDC event → cache cleared
                    <small>
                      All samples are invalidated. The next run is a miss.
                    </small>
                  </p>
                </>
              )}
            </div>
            <div className="result-bottom">
              <span>{example.rows.length} illustrative rows</span>
              <button onClick={invalidate}>
                <RotateCcw size={13} />
                Simulate CDC event
              </button>
            </div>
          </div>
        </div>
        <div className="workbench-caption">
          <span>
            <span className="status-dot" />
            Interactive illustration · runs in your browser, without an Igloo
            server
          </span>
          <span>Actual query examples. Illustrative results.</span>
        </div>
        <p className="example-description">{example.description}</p>
      </div>
    </section>
  );
}
