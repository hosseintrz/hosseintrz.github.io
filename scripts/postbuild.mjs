#!/usr/bin/env node
/**
 * Post-build pipeline (runs after `astro build`):
 *   1. Serve dist/ locally.
 *   2. Screenshot every /og/<slug>/ card page into /og/<slug>.png (Open Graph images).
 *   3. Print /resume/ to /resume.pdf (same source data as the web resume).
 *   4. Index the site with Pagefind for the command palette search.
 * Uses the system Chrome (`channel: 'chrome'`) — no browser download needed.
 */
import { createServer } from "node:http";
import { stat, readFile, mkdir } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium } from "@playwright/test";

const DIST = new URL("../dist", import.meta.url).pathname;
const PORT = 41721;
const BASE = `http://127.0.0.1:${PORT}`;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".pdf": "application/pdf",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", BASE);
    let path = decodeURIComponent(url.pathname);
    let file = normalize(join(DIST, path));
    if (!file.startsWith(normalize(DIST))) {
      res.writeHead(403).end();
      return;
    }
    if (path.endsWith("/")) file = join(file, "index.html");
    let f = file;
    try {
      const s = await stat(f);
      if (s.isDirectory()) f = join(f, "index.html");
    } catch {
      // SPA-ish fallback: try adding /index.html or .html
      const alt = join(file, "index.html");
      try {
        await stat(alt);
        f = alt;
      } catch {
        res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
        return;
      }
    }
    const body = await readFile(f);
    res.writeHead(200, { "Content-Type": MIME[extname(f)] ?? "application/octet-stream" });
    res.end(body);
  } catch (err) {
    res.writeHead(500).end(String(err));
  }
});

async function main() {
  await new Promise((resolve) => server.listen(PORT, "127.0.0.1", resolve));
  console.log(`[postbuild] serving ${DIST} at ${BASE}`);

  const browser = await chromium.launch({ channel: "chrome" });
  try {
    // ---- 1. OG images ----
    const manifest = JSON.parse(await readFile(join(DIST, "og-manifest.json"), "utf8"));
    const ctx = await browser.newContext({
      viewport: { width: manifest.size.width, height: manifest.size.height },
      deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    for (const item of manifest.items) {
      const out = join(DIST, item.png);
      await mkdir(join(out, ".."), { recursive: true });
      await page.goto(`${BASE}${item.html}`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const frame = page.locator(".card-frame");
      await frame.screenshot({ path: out, type: "png" });
      console.log(`[postbuild] og: ${item.png}`);
    }
    await ctx.close();

    // ---- 2. Resume PDF ----
    const pdfPage = await browser.newPage();
    await pdfPage.goto(`${BASE}/resume/`, { waitUntil: "networkidle" });
    await pdfPage.evaluate(() => document.fonts.ready);
    await pdfPage.pdf({
      path: join(DIST, "resume.pdf"),
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "14mm", right: "14mm" },
    });
    console.log("[postbuild] pdf: /resume.pdf");
    await pdfPage.close();

    // ---- 3. Pagefind index ----
    const pagefind = await import("pagefind");
    const { index, errors: indexErrors } = await pagefind.createIndex({});
    const { errors: dirErrors, page_count: pageCount } = await index.addDirectory({
      path: DIST,
    });
    const allErrors = [...indexErrors, ...dirErrors];
    if (allErrors.length > 0) {
      console.error("[postbuild] pagefind errors:", allErrors);
      process.exitCode = 1;
    } else {
      // pagefind's JS API treats outputPath as the pagefind output directory itself
      // (unlike the CLI's --site flag); write into dist/pagefind/.
      const writeResult = await index.writeFiles({ outputPath: join(DIST, "pagefind") });
      if (writeResult.errors.length > 0) {
        console.error("[postbuild] pagefind write errors:", writeResult.errors);
        process.exitCode = 1;
      } else {
        console.log(`[postbuild] pagefind: ${pageCount} pages → dist/pagefind/`);
      }
    }
    await pagefind.close();
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error("[postbuild] failed:", err);
  process.exit(1);
});
