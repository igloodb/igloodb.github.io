import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Highlight({ code }: { code: string }) {
  const tokens = code.split(
    /(--[^\n]*|'(?:[^']|'')*'|\b(?:SELECT|FROM|JOIN|ON|AS|WHERE|ORDER BY|GROUP BY|DESC|SUM|LIMIT|CREATE|TABLE|BIGINT|TEXT|INSERT|INTO|VALUES|SHOW|AND|WITH)\b|\b\d+\b)/gi,
  );
  return (
    <>
      {tokens.map((token, i) => (
        <span
          key={i}
          className={
            token.startsWith("--")
              ? "token-comment"
              : token.startsWith("'")
                ? "token-string"
                : /^(SELECT|FROM|JOIN|ON|AS|WHERE|ORDER BY|GROUP BY|DESC|SUM|LIMIT|CREATE|TABLE|BIGINT|TEXT|INSERT|INTO|VALUES|SHOW|AND|WITH)$/i.test(
                      token,
                    )
                  ? "token-keyword"
                  : /^\d+$/.test(token)
                    ? "token-number"
                    : undefined
          }
        >
          {token}
        </span>
      ))}
    </>
  );
}
export function CopyButton({
  text,
  label = "Copy code",
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied");
    } catch {
      setStatus("Select code to copy");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 2400);
  }
  return (
    <button
      className="copy-button"
      onClick={copy}
      aria-label={status || label}
      title={status || label}
    >
      {status === "Copied" ? <Check size={15} /> : <Copy size={15} />}
      <span aria-live="polite">{status || "Copy"}</span>
    </button>
  );
}
export function CodeBlock({
  code,
  title = "Terminal",
  language = "shell",
}: {
  code: string;
  title?: string;
  language?: string;
}) {
  return (
    <div className="code-block">
      <div className="code-heading">
        <span>{title}</span>
        <CopyButton text={code} />
      </div>
      <pre tabIndex={0} aria-label={title}>
        <code>{language === "sql" ? <Highlight code={code} /> : code}</code>
      </pre>
    </div>
  );
}
