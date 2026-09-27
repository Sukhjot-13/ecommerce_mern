// Pure order-total helpers (unit-tested; no DB access here).
//
// computeOrderTotal(lines): lines = [{ price, quantity }]. Prices/quantities
// are coerced to numbers; invalid lines throw so callers return 400 instead
// of persisting garbage.
function toNumber(value, field) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(`Invalid ${field}: ${value}`);
  }
  return n;
}

function computeOrderTotal(lines) {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new Error("Order must contain at least one item");
  }
  let total = 0;
  for (const line of lines) {
    const price = toNumber(line.price, "price");
    const quantity = toNumber(line.quantity, "quantity");
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`Invalid quantity: ${line.quantity}`);
    }
    total += price * quantity;
  }
  // Bankers don't care; buyers do — round to cents.
  return Math.round(total * 100) / 100;
}

module.exports = { computeOrderTotal };
