# Suggestions — ecommerce_mern

## 🔴 Vulnerabilities

- (2026-09-26) Admin enforcement is client-side only: `AdminRoutes`/`Header` check `gUser.role === "admin"`, but `POST /api/v1/products` and `POST /api/v1/categories` have no server-side role check — any caller can create products/categories.
- (2026-09-26) Client-supplied identity is trusted: cart (`id`), orders (`userId` body + `?userId` query), and reviews (`user`) accept arbitrary user ids with no ownership check — one user can read/mutate another's cart and orders (IDOR).
- (2026-09-26) `orderTotal` is accepted from the client in both `createOrder` and the MyCart checkout flow; recompute totals server-side (from cart/product prices or the verified PaymentIntent amount).
- (2026-09-26) `createCheckoutSession` forwards client-provided `line_items` to Stripe unverified; build line items server-side from product prices.
- (2026-09-26) `client/README.md` publishes a default admin email/password (`admin@admin.com`/`123456`); rotate/remove if that account exists in any real database.

## 🟢 Improvements

- (2026-09-26) `server/README.md` omits `CLIENT_URL` and `SERVER_URL` although both are used (`paymentController.js`) and present in `server/.env.example`; sync the lists.
- (2026-09-26) No test suite exists (no `tests/` dir, no `test` script); add at least API smoke tests for auth-adjacent flows (cart ownership, order totals, checkout metadata) per `AGENTS.md` testing guidelines.
- (2026-09-26) `bcrypt` is a dependency but unused since password signup was removed (`userController.hashPassword` is dead code); either drop the dep or remove the helper.
- (2026-09-26) `APIFeatures.paginate()` (default limit 2) is dead — `productController` paginates manually (default 8); remove or unify to avoid confusion.
- (2026-09-26) `getUserId` is a `POST /getUserId` that only reads by email; make it `GET` with query param (or keep POST but document why) to follow REST conventions.
