import { describe, expect, it } from "vitest";
import { accentColorCss, readableTextColor } from "../src/color.js";

describe("accentColorCss", () => {
  it("maps palette names to theme variables", () => {
    expect(accentColorCss("orange")).toBe("var(--orange-color)");
    expect(accentColorCss("deep-purple")).toBe("var(--deep-purple-color)");
  });

  it("passes through raw CSS colors", () => {
    expect(accentColorCss("#8e24aa")).toBe("#8e24aa");
    expect(accentColorCss("rgb(1, 2, 3)")).toBe("rgb(1, 2, 3)");
  });

  it("falls back when unset", () => {
    expect(accentColorCss(undefined)).toBe("var(--primary-color)");
  });
});

describe("readableTextColor", () => {
  it("uses white text on dark backgrounds", () => {
    expect(readableTextColor("rgb(33, 33, 33)")).toBe("#fff");
    expect(readableTextColor("rgb(63, 81, 181)")).toBe("#fff"); // indigo
  });

  it("uses black text on light backgrounds", () => {
    expect(readableTextColor("rgb(255, 235, 59)")).toBe("rgba(0, 0, 0, 0.87)"); // yellow
    expect(readableTextColor("rgb(255, 255, 255)")).toBe("rgba(0, 0, 0, 0.87)");
  });

  it("defaults to white when unparsable", () => {
    expect(readableTextColor("nonsense")).toBe("#fff");
  });
});
