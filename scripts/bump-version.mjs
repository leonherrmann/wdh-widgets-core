#!/usr/bin/env node
/**
 * Bump the CalVer version in package.json and src/version.ts.
 *
 * Usage:
 *   node scripts/bump-version.mjs          # bump files only
 *   node scripts/bump-version.mjs --tag    # bump + git commit + annotated tag
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { nextCalver } from "./calver.mjs";

const tag = process.argv.includes("--tag");

const pkgPath = new URL("../package.json", import.meta.url);
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
const next = nextCalver(pkg.version);

pkg.version = next;
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

const versionPath = new URL("../src/version.ts", import.meta.url);
const versionSrc = readFileSync(versionPath, "utf8");
writeFileSync(
  versionPath,
  versionSrc.replace(/"\d{4}\.\d{1,2}\.\d+"/, `"${next}"`)
);

console.log(`version: ${pkg.name} → ${next}`);

if (tag) {
  execSync(`git add package.json src/version.ts`, { stdio: "inherit" });
  execSync(`git commit -m "Release v${next}"`, { stdio: "inherit" });
  execSync(`git tag -a v${next} -m "v${next}"`, { stdio: "inherit" });
  console.log(`tagged v${next} — push with: git push && git push --tags`);
}
