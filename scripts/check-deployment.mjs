import assert from "node:assert/strict";

const site = new URL(process.env.SITE_URL || "https://igloodb.github.io/");
const expected = process.env.EXPECTED_SITE_COMMIT;
if (!expected) throw new Error("EXPECTED_SITE_COMMIT is required");

async function read(path) {
  const url = new URL(path, site);
  url.searchParams.set("revision", expected);
  const response = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  assert.equal(response.status, 200, `${path} must return HTTP 200`);
  return response.text();
}

// A Pages deployment can complete before every CDN edge serves its new files.
let lastError;
for (let attempt = 1; attempt <= 12; attempt++) {
  try {
    const deployment = JSON.parse(await read("deployment.json"));
    assert.equal(deployment.site_commit, expected, "Pages must serve the deployed commit");
    const [home, guide, index, skill, connectors] = await Promise.all([
      read(""), read("docs/agents.md"), read("llms.txt"), read("skills/igloo-query/SKILL.md"), read("docs/connectors.md"),
    ]);
    assert(home.includes("All your data.") && home.includes("One SQL"), "Homepage must retain the SQL product introduction");
    assert(home.includes("MCP") && home.includes("ADBC"), "Homepage must include the new source-preview features");
    assert(guide.includes("git clone --branch codex/agent-native-access"), "Agent guide must include a working source checkout");
    assert(guide.includes(deployment.agent_source_commit), "Agent guide must pin its source revision");
    assert(index.includes("https://igloodb.github.io/docs/agents.md"), "llms.txt must link to the agent guide");
    assert(skill.includes("name: igloo-query"), "Published skill must be discoverable");
    assert(connectors.includes("Database-specific validation pending") && connectors.includes("igloo_connectors"), "Connector guide must distinguish evidence from candidate coverage");
    assert(connectors.includes(deployment.agent_source_commit), "Connector guide must pin its source revision");
    console.log(`Verified ${site.href} at ${expected}: homepage, pinned agent and connector guides, llms.txt, and query skill.`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.log(`Pages verification attempt ${attempt}/12: ${error.message}`);
    if (attempt < 12) await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
throw lastError;
