import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import test from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const typescript = require("typescript");
const source = await readFile(
  path.join(projectRoot, "src/lib/upload-service.ts"),
  "utf8",
);
const { outputText } = typescript.transpileModule(source, {
  compilerOptions: {
    module: typescript.ModuleKind.ES2022,
    target: typescript.ScriptTarget.ES2022,
  },
});
const service = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
);

test("retries nested transient network errors and returns a later success", async () => {
  let attempts = 0;
  const result = await service.retryTransientRequest(
    async () => {
      attempts += 1;
      if (attempts === 1) {
        const timeout = Object.assign(new Error("network timeout"), {
          code: "UND_ERR_CONNECT_TIMEOUT",
        });
        const fetchError = Object.assign(new Error("fetch failed"), {
          cause: timeout,
        });
        const databaseError = Object.assign(new Error("database request failed"), {
          sourceError: fetchError,
        });
        throw databaseError;
      }
      return "ok";
    },
    1,
  );

  assert.equal(result, "ok");
  assert.equal(attempts, 2);
});

test("does not retry non-transient errors", async () => {
  let attempts = 0;
  await assert.rejects(
    service.retryTransientRequest(async () => {
      attempts += 1;
      throw Object.assign(new Error("query rejected"), { code: "42P01" });
    }),
    /query rejected/,
  );
  assert.equal(attempts, 1);
});

test("service logs omit provider error messages", () => {
  const originalError = console.error;
  let logged;
  console.error = (...parts) => {
    logged = parts;
  };
  try {
    service.logServiceError(
      "safe context",
      Object.assign(new Error("sensitive-token-value"), { code: "ECONNRESET" }),
    );
  } finally {
    console.error = originalError;
  }

  assert.deepEqual(logged, [
    "safe context",
    { name: "Error", code: "ECONNRESET" },
  ]);
  assert.equal(JSON.stringify(logged).includes("sensitive-token-value"), false);
});
