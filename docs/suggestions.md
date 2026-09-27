# Suggestions — ecommerce_mern

> 2026-09-26 hardening pass: server-side admin/ownership guards (`utils/authGuard.js`),
> server-recomputed order totals, server-built Stripe line items, dead-code removal,
> `getUserId` GET route, credential cleanup, and a vitest suite are implemented.
> What remains is the true identity upgrade below.

## 🔴 Vulnerabilities

- (2026-09-26) Identity is header-based (`x-user-id`, client-supplied) — the guards raise the bar (opaque ids, DB-backed roles) but headers are forgeable. Upgrade path: verify Firebase ID tokens with `firebase-admin` (`FIREBASE_SERVICE_ACCOUNT`) and derive identity from the verified token in `authGuard.js`; the client already centralizes axios, so sending `Authorization: Bearer <idToken>` is a small change.

## 🟢 Improvements

- (2026-09-26) Extend the vitest suite beyond `computeOrderTotal` (cart quantity rules, checkout snapshot validation) as flows evolve.
