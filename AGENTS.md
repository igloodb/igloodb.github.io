# Working on the Igloo website

This is a static Next.js Pages Router site, not the database runtime. Read
`README.md` for development and publishing. The paired engine source is in
`../igloodb` when available.

- Edit homepage content in `pages/index.tsx`, shared navigation/metadata in
  `components/layout.tsx`, and styles in `styles/globals.css`.
- `lib/docs.ts` holds documentation; `lib/agent-doc.ts` holds the unreleased agent
  interface guide. Existing engine claims are pinned to `lib/site.ts`'s revision.
  Agent claims require the corresponding engine changes; mark them unreleased
  until a released revision can be pinned. Do not invent working connectors,
  performance claims, vectors, memory, authentication or CDC integrations.
- `pnpm docs:generate` derives Markdown, llms.txt, llms-full.txt and the query skill
  from documentation sources. Edit the source/generator rather than generated
  public files. `pnpm build` runs generation automatically.
- When adding a guide, update the sitemap and route coverage list. Keep Markdown
  routes and agent discovery links accessible in the static export.
- The browser playground is an illustrative simulation; do not present it as a
  live query engine or introduce credentials into this static site.

Use the Node/pnpm versions in the README and the frozen lockfile. Run `pnpm build`,
`pnpm check`, and the existing Playwright suite for affected flows. Chromium can
be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`. Stop development servers
before building because they share `.next` with production builds. Do not publish
or deploy merely to verify a local edit.
