import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the housing explainer", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>How Oak Park Makes Housing Affordable<\/title>/i);
  assert.match(html, /Today’s “luxury” housing is tomorrow’s affordable housing/);
  assert.match(html, /Almost none of the affordable housing Oak Park depends on began as a public program/);
  assert.match(html, /Building plunged in the 1980s and 90s/);
  assert.match(html, /ONE NEW HOME · THREE MOVES/);
  assert.match(html, /Household A moves into the new building/);
  assert.match(html, /This works/);
  assert.match(html, /A DUAL APPROACH/);
  assert.match(html, /Build more homes/);
  assert.doesNotMatch(html, /THE POLICY CHOICE/);
  assert.doesNotMatch(html, /HOUSING IS A CHAIN/);
  assert.match(html, /Start the engine again/);
  assert.doesNotMatch(html, /pre.?1940|1938|59%/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});
