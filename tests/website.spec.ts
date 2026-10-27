import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function expectAccessible(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  ).toEqual([]);
}

const slugs = [
  "quickstart",
  "agents",
  "connectors",
  "postgres",
  "configuration",
  "architecture",
  "caching",
  "sql",
  "roadmap",
  "contributing",
];

test("homepage explains the implemented engine, loads cleanly, and meets accessibility checks", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Your data.Ready for agents.",
  );
  await expect(page.getByText("Experimental, by design")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Connect your agent" }),
  ).toHaveAttribute("href", "/docs/agents/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expectAccessible(page);
  expect(errors).toEqual([]);
});

test("query examples demonstrate hits, whole-cache invalidation, and keyboard tabs", async ({
  page,
}) => {
  await page.goto("/#playground");
  const status = page.locator(".result-message");
  await page.getByRole("button", { name: "Run sample" }).click();
  await expect(status).toContainText("Cache miss → execute → store");
  await page.getByRole("button", { name: "Run sample" }).click();
  await expect(status).toContainText("Cache hit → return saved batches");
  await page.getByRole("tab", { name: "Postgres + Parquet" }).click();
  await page.getByRole("button", { name: "Run sample" }).click();
  await expect(status).toContainText("Cache miss");
  await page.getByRole("button", { name: "Simulate CDC event" }).click();
  await expect(status).toContainText("All samples are invalidated");
  await page.getByRole("tab", { name: "Join across sources" }).click();
  await page.getByRole("button", { name: "Run sample" }).click();
  await expect(status).toContainText("Cache miss");
  await page.getByRole("tab", { name: "Join across sources" }).focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "Market analytics" }),
  ).toBeFocused();
  await expect(page.locator(".editor-code")).toContainText(
    "SUM(close * volume)",
  );
  await expect(
    page.getByRole("cell", { name: "BTC", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Home");
  await expect(
    page.getByRole("tab", { name: "Join across sources" }),
  ).toBeFocused();
});

test("documentation search finds content, handles empty results, and closes accessibly", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Search documentation" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const input = page.getByRole("textbox", { name: "Search documentation" });
  await expect(input).toBeFocused();
  await input.fill("no-such-igloo-page");
  await expect(dialog).toContainText("No matching pages");
  await input.fill("cache");
  await input.fill("Snowflake");
  await expect(dialog.getByRole("link", { name: "Database connectors" })).toBeVisible();
  await input.fill("cache");
  await expectAccessible(page);
  await dialog.getByRole("link", { name: "Caching & freshness" }).click();
  await expect(page).toHaveURL(/\/docs\/caching\/$/);
  await expect(dialog).not.toBeVisible();
  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
});

for (const slug of slugs) {
  test(
    "documentation " +
      slug +
      " supports direct navigation and accessible content",
    async ({ page }) => {
      const response = await page.goto("/docs/" + slug + "/");
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(".doc-provenance")).toContainText(["agents", "connectors", "postgres", "configuration", "architecture", "roadmap"].includes(slug) ? "unreleased" : "1633204");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await expectAccessible(page);
    },
  );
}

test("copy buttons copy the actual command", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "Clipboard permission is browser-specific",
  );
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/quickstart/");
  await page.getByRole("button", { name: "Copy code" }).first().click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "cargo run --locked -- crypto-demo",
  );
});

test("agents can discover the same documentation and skill without rendering JavaScript", async ({ request }) => {
  const index = await request.get("/llms.txt");
  expect(index.ok()).toBe(true);
  expect(await index.text()).toContain("https://igloodb.github.io/docs/agents.md");
  expect(await index.text()).toContain("https://igloodb.github.io/docs/connectors.md");
  const guide = await request.get("/docs/agents.md");
  expect(guide.ok()).toBe(true);
  const text = await guide.text();
  expect(text).toContain("igloo_schema");
  expect(text).toContain("[mcp_servers.igloo]");
  expect(text).toContain("exact decimal strings");
  expect(text).toContain("git clone --branch codex/agent-native-access");
  const deployment = await request.get("/deployment.json");
  expect(deployment.ok()).toBe(true);
  expect(text).toContain((await deployment.json()).agent_source_commit);
  const full = await request.get("/llms-full.txt");
  expect(full.ok()).toBe(true);
  expect(await full.text()).toContain(text);
  const skill = await request.get("/skills/igloo-query/SKILL.md");
  expect(skill.ok()).toBe(true);
  expect(await skill.text()).toContain("name: igloo-query");
});

test("mobile menu and documentation selector navigate, and missing pages recover", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Open navigation" }).click();
    await expect(
      page.getByRole("button", { name: "Close navigation" }),
    ).toHaveAttribute("aria-expanded", "true");
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: "Documentation" })
      .click();
    await page.getByText("Browse documentation", { exact: true }).click();
    await page
      .getByRole("navigation", { name: "Documentation pages" })
      .getByRole("link", { name: "Architecture", exact: true })
      .click();
    await expect(page.locator("h1")).toHaveText("Architecture");
  }
  await page.goto("/missing-page/");
  await expect(
    page.getByRole("heading", { name: "This query came up empty." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to Igloo" }).click();
  await expect(page).toHaveURL("/");
});
