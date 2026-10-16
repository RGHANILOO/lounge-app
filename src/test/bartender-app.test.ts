import { describe, it, expect } from "vite-plus/test";
import cocktailsData from "../data/cocktails.json";

describe("Bartender PWA Recipe Logic", () => {
  it("loads cocktail recipes correctly from JSON", () => {
    expect(cocktailsData.length).toBeGreaterThan(0);
    expect(cocktailsData[0]).toHaveProperty("name");
    expect(cocktailsData[0]).toHaveProperty("ingredients");
  });

  it("filters cocktails by ingredient name", () => {
    const query = "El Jimador".toLowerCase();
    const filtered = cocktailsData.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.ingredients.some((i) => i.toLowerCase().includes(query)),
    );
    expect(filtered.length).toBeGreaterThan(0);
  });
});
