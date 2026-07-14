import { describe, expect, it } from "vitest";
import { nextCalver } from "../scripts/calver.mjs";

describe("nextCalver", () => {
  const july2026 = new Date(2026, 6, 14);

  it("bumps patch within the same month", () => {
    expect(nextCalver("2026.7.0", july2026)).toBe("2026.7.1");
    expect(nextCalver("2026.7.12", july2026)).toBe("2026.7.13");
  });

  it("resets patch on a new month", () => {
    expect(nextCalver("2026.6.5", july2026)).toBe("2026.7.0");
  });

  it("resets patch on a new year", () => {
    expect(nextCalver("2025.12.3", july2026)).toBe("2026.7.0");
  });

  it("handles missing/invalid current version", () => {
    expect(nextCalver(undefined, july2026)).toBe("2026.7.0");
    expect(nextCalver("1.0.0-beta", july2026)).toBe("2026.7.0");
  });
});
