import { readdir, readFile, access, stat } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("out");
async function walk(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? walk(path.join(folder, entry.name))
          : path.join(folder, entry.name),
      ),
    )
  ).flat();
}
const files = (await walk(root)).filter((file) => file.endsWith(".html"));
const problems = [];
for (const file of files) {
  const html = await readFile(file, "utf8");
  if (!/<title(?:\s[^>]*)?>/.test(html) || !html.includes('name="description"'))
    problems.push(file + ": missing page metadata");
  if (/Welcome to Nextra|My Project|shuding\/nextra-docs-template/.test(html))
    problems.push(file + ": template content remains");
  const ids = new Set(
    [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
  );
  if (ids.size !== [...html.matchAll(/\sid="([^"]+)"/g)].length)
    problems.push(file + ": duplicate IDs");
  for (const match of html.matchAll(
    /(?:href|src)="([^"#?]+)(?:\?[^"#]*)?(?:#([^"]*))?"/g,
  )) {
    const [attribute, url, hash] = match;
    if (/^(https?:|data:|mailto:|tel:|javascript:)/.test(url)) continue;
    const decoded = decodeURIComponent(url);
    const target = decoded.startsWith("/")
      ? path.resolve(root, "." + decoded)
      : path.resolve(path.dirname(file), decoded);
    if (!target.startsWith(root + path.sep) && target !== root) {
      problems.push(file + ": path escapes output: " + attribute);
      continue;
    }
    const candidates = url.endsWith("/")
      ? [path.join(target, "index.html")]
      : [target, path.join(target, "index.html")];
    let found = "";
    for (const candidate of candidates) {
      try {
        if ((await stat(candidate)).isFile()) {
          found = candidate;
          break;
        }
      } catch {}
    }
    if (!found) problems.push(file + ": broken asset/link " + url);
    if (hash && found.endsWith(".html")) {
      const targetHtml = await readFile(found, "utf8");
      if (!targetHtml.includes('id=\"' + decodeURIComponent(hash) + '\"'))
        problems.push(file + ": broken fragment " + url + "#" + hash);
    }
  }
  for (const match of html.matchAll(/href="#([^"]+)"/g))
    if (!ids.has(match[1]))
      problems.push(file + ": broken fragment #" + match[1]);
}
for (const required of [
  "index.html",
  "404.html",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
  "social-card.png",
  "llms.txt",
  "deployment.json",
  "llms-full.txt",
  "docs/agents.md",
  "docs/connectors.md",
  "skills/igloo-query/SKILL.md",
]) {
  try {
    await access(path.join(root, required));
  } catch {
    problems.push("Missing " + required);
  }
}
// Agent discovery must resolve within the static export, including text assets.
for (const name of ["llms.txt", "llms-full.txt"]) {
  const content = await readFile(path.join(root, name), "utf8");
  for (const match of content.matchAll(/https:\/\/igloodb\.github\.io(\/[^\s)]+)/g)) {
    const target = path.join(root, match[1]);
    try {
      await access(match[1].endsWith("/") ? path.join(target, "index.html") : target);
    } catch {
      problems.push(name + ": broken discovery link " + match[0]);
    }
  }
}
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(
  "Checked " +
    files.length +
    " exported pages: metadata, assets, local links, fragments, and template removal passed.",
);
