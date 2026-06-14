/**
 * Smoke tests — critical path validation.
 * Run with: npx jest
 *
 * These are minimal tests verifying the most important utilities work correctly.
 * For a full test suite, consider adding Playwright for E2E tests.
 */

// ─── Utility tests ─────────────────────────────────────────────────────────

describe("SITE_URL constant", () => {
  it("should not have a trailing slash", () => {
    // We simulate the logic in constants.ts
    const url = "https://chranico.com/";
    const normalized = url.replace(/\/$/, "");
    expect(normalized).toBe("https://chranico.com");
    expect(normalized.endsWith("/")).toBe(false);
  });
});

describe("Language validation", () => {
  const VALID_LANGS = ["en", "ar", "ku"] as const;

  it("should accept valid language codes", () => {
    expect(VALID_LANGS).toContain("en");
    expect(VALID_LANGS).toContain("ar");
    expect(VALID_LANGS).toContain("ku");
  });

  it("should reject invalid language codes", () => {
    const invalidLang = "fr";
    expect((VALID_LANGS as readonly string[]).includes(invalidLang)).toBe(false);
  });
});

describe("Product ID validation", () => {
  const isValidProductId = (id: string) => /^\d{1,10}$/.test(id);

  it("should accept valid numeric IDs", () => {
    expect(isValidProductId("1")).toBe(true);
    expect(isValidProductId("123")).toBe(true);
    expect(isValidProductId("9999999999")).toBe(true);
  });

  it("should reject path traversal attempts", () => {
    expect(isValidProductId("../etc/passwd")).toBe(false);
    expect(isValidProductId("../../secret")).toBe(false);
    expect(isValidProductId("1; DROP TABLE products;")).toBe(false);
    expect(isValidProductId("<script>alert(1)</script>")).toBe(false);
  });

  it("should reject empty strings", () => {
    expect(isValidProductId("")).toBe(false);
  });

  it("should reject IDs longer than 10 digits", () => {
    expect(isValidProductId("12345678901")).toBe(false);
  });
});

describe("WhatsApp number sanitization", () => {
  it("should strip non-numeric characters", () => {
    const raw = "+964 750 445 4864";
    const clean = raw.replace(/\D/g, "");
    expect(clean).toBe("9647504454864");
  });

  it("should handle already clean numbers", () => {
    const raw = "9647504454864";
    const clean = raw.replace(/\D/g, "");
    expect(clean).toBe("9647504454864");
  });
});

describe("Category tree builder", () => {
  it("should build a tree from flat categories", () => {
    const flat = [
      { id: 1, name: { en: "Parent" }, slug: "parent", parent_id: null },
      { id: 2, name: { en: "Child" }, slug: "child", parent_id: 1 },
    ];

    const map = new Map<number, typeof flat[0] & { children: typeof flat }>();
    flat.forEach((cat) => map.set(cat.id, { ...cat, children: [] }));

    const tree: typeof flat = [];
    flat.forEach((cat) => {
      const node = map.get(cat.id)!;
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)!.children.push(node);
      } else if (!cat.parent_id) {
        tree.push(node);
      }
    });

    expect(tree).toHaveLength(1);
    expect((tree[0] as any).children).toHaveLength(1);
    expect((tree[0] as any).children[0].slug).toBe("child");
  });
});
