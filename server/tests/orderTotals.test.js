import { describe, it, expect } from "vitest";
import { computeOrderTotal } from "../utils/orderTotals.js";

describe("computeOrderTotal", () => {
  it("sums price x quantity across lines", () => {
    expect(
      computeOrderTotal([
        { price: 10, quantity: 2 },
        { price: 5.5, quantity: 1 },
      ])
    ).toBe(25.5);
  });

  it("coerces numeric strings", () => {
    expect(computeOrderTotal([{ price: "9.99", quantity: "3" }])).toBe(29.97);
  });

  it("rounds to cents", () => {
    expect(computeOrderTotal([{ price: 0.1, quantity: 3 }])).toBe(0.3);
  });

  it("rejects an empty order", () => {
    expect(() => computeOrderTotal([])).toThrow();
  });

  it("rejects zero/negative/fractional quantities", () => {
    expect(() => computeOrderTotal([{ price: 5, quantity: 0 }])).toThrow();
    expect(() => computeOrderTotal([{ price: 5, quantity: -1 }])).toThrow();
    expect(() => computeOrderTotal([{ price: 5, quantity: 1.5 }])).toThrow();
  });

  it("rejects negative or non-numeric prices", () => {
    expect(() => computeOrderTotal([{ price: -1, quantity: 1 }])).toThrow();
    expect(() => computeOrderTotal([{ price: "free", quantity: 1 }])).toThrow();
  });
});
