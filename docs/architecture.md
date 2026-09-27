# Architecture — ecommerce_mern (ShopSphere)

MERN monorepo: `server/` (Express + Mongoose + Stripe + Multer) serving `/api/v1/*` JSON APIs and `/images` static files; `client/` (Vite + React 18 + Chakra UI + Firebase Auth + Stripe.js) SPA. Auth = Firebase client-side; backend links Firebase `uid`/email to a Mongo `User` (`role: user|admin`). No server-side session/JWT enforcement; admin gating is client-side (`AdminRoutes`, `gUser.role === "admin"`).

## Environment Variables

| Var | Used in | Purpose |
|---|---|---|
| `DATABASE` | `server/server.js:7,14` | MongoDB connection string with `<PASSWORD>` placeholder |
| `DATABASE_PASSWORD` | `server/server.js:7,14` | Password substituted into `DATABASE` via `.replace("<PASSWORD>", …)`; boot fails (`process.exit(1)`) if either is missing |
| `PORT` | `server/server.js:27` | Listen port, defaults to `8080` |
| `STRIPE_SECRET_KEY` | `server/controllers/paymentController.js:1` | Stripe secret for checkout sessions + payment intents |
| `CLIENT_URL` | `server/controllers/paymentController.js:5,18,103` | Stripe `cancel_url` + post-payment redirect (`/success`); defaults `http://localhost:3000` |
| `SERVER_URL` | `server/controllers/paymentController.js:6,17` | Stripe `success_url` (`/api/v1/payment/success?session_id=…`); defaults `http://localhost:8080` |
| `VITE_API_HOST` | `client/src/*` (UserContext, all pages/components) | Backend base URL for every API call + image URLs |
| `VITE_STRIPE_PUBLIC_KEY` | `client/src/pages/MyCart.jsx:33` | Stripe publishable key for `loadStripe` / card checkout |
| `VITE_apiKey` | `client/src/firebase.js:6` | Firebase `apiKey` |
| `VITE_authDomain` | `client/src/firebase.js:7` | Firebase `authDomain` |
| `VITE_projectId` | `client/src/firebase.js:8` | Firebase `projectId` |
| `VITE_storageBucket` | `client/src/firebase.js:9` | Firebase `storageBucket` |
| `VITE_messagingSenderId` | `client/src/firebase.js:10` | Firebase `messagingSenderId` |
| `VITE_appId` | `client/src/firebase.js:11` | Firebase `appId` |

Reference: `server/.env.example` lists all 6 server vars. Gap: `server/README.md` lists only 4 (missing `CLIENT_URL`, `SERVER_URL` — see suggestions).

## Repo root

- `AGENTS.md` — Purpose: repo-local AI/architecture guidelines (docs live in `docs/`, env section required, permission-gate standard). No functions.
- `docs/architecture.md` — This file. `docs/suggestions.md` — dated improvement/vulnerability log.

## Server

- `server/server.js` — Purpose: process entrypoint; validates `DATABASE`/`DATABASE_PASSWORD`, connects Mongoose, listens on `PORT`. No exports.
- `server/app.js` — Purpose: Express app wiring (json, morgan, cors, `/images` static, 7 routers). Exports: the `app` instance.
- `server/.env.example` — Purpose: template for the 6 server env vars (never commit real values). No functions.
- `server/package.json` / `server/package-lock.json` — Purpose: manifest/lock (`express`, `mongoose`, `stripe`, `multer`, `cors`, `dotenv`, `morgan`, `slugify`; dev `nodemon`, `vitest`; `start: nodemon server.js`, `test: vitest run`).
- `server/.gitignore` — Purpose: ignores `node_modules`, `.env`.
- `server/README.md` — Purpose: lists 4 env vars (stale: omits `CLIENT_URL`, `SERVER_URL`).
- `server/images/*` (~60 files, e.g. `images-1722218*.jpeg/avif/png`) — Purpose: Multer-uploaded product photos served via `/images`. No functions.

### server/controllers/*.js

- `server/controllers/userController.js` — Purpose: user CRUD backed by Firebase `uid`.
    - `createUser(req, res)` — creates User from `{userName, email, uid}` → 201.
  - `getUserId(req, res)` — looks up user by `?email=` query (legacy `POST {email}` alias kept) → `{_id, role}` (used by `UserContext` to hydrate session).
  - `getUserById(req, res)` — `GET /:userId` → full user doc.
- `server/controllers/productController.js` — Purpose: product catalog + creation.
  - `getAllProducts(req, res)` — dual mode: with `slug` param returns one product (populates `reviews.user.userName`, `category`); without returns paginated/filtered list via `APIFeatures` (`totalResults` via `getQuery()`, manual `skip/limit`, default limit 8).
  - `createProduct(req, res)` — parses multipart fields + `req.files` paths; inner `parseJsonArray(value, field)` parses `tags`/`features` JSON; creates Product.
- `server/controllers/cartController.js` — Purpose: per-user cart.
  - `addToCart(req, res)` — `{id, productId, quantity}` (default 1); validates presence + non-zero integer qty; creates cart if missing; increments/decrements, splices line when qty ≤ 0.
  - `getCart(req, res)` — `GET /:userId`, populates `products.product`.
  - `removeFromCart(req, res)` — `{id, productId}` filters the line out.
- `server/controllers/orderController.js` — Purpose: order persistence/query.
  - `createOrder(req, res)` — validates userId/paymentIntentId/items, reloads Product prices, recomputes `orderTotal` via `computeOrderTotal` (client total never trusted), saves → 201. Route guarded by `requireOwner`.
  - `getAllOrders(req, res)` — requires `?userId`, returns that user's orders with `items.productId` populated.
- `server/controllers/paymentController.js` — Purpose: Stripe flows; reads `STRIPE_SECRET_KEY`, `CLIENT_URL`, `SERVER_URL`.
  - `createCheckoutSession(req, res)` — requires `items [{productId, quantity}]`; builds Stripe `line_items` server-side from Product prices (client arrays never forwarded); optional `{email, userId}` carried into `metadata` with a server-priced snapshot; `success_url` points at server `/payment/success`.
  - `successPayment(req, res)` — retrieves session + line items; resolves buyer via `metadata.userId` then email lookup (400 if unresolvable); parses `metadata.items` into schema-valid `{productId, quantity, price}` (400 if empty); saves Order; redirects to `${CLIENT_URL}/success`.
  - `paymentIntent(req, res)` — validates positive numeric `amount`; creates USD card PaymentIntent; returns `client_secret`.
- `server/controllers/reviewController.js` — Purpose: product reviews.
  - `getAllReviews(req, res)` — optional `:id` product filter, populates `user.userName`, newest first.
  - `createReview(req, res)` — 404s if product missing; creates Review `{rating, comment, user, product: :id}` and `$push`es its id onto Product.reviews.
- `server/controllers/categoryController.js` — Purpose: categories.
  - `getAllCategories(req, res)` — returns all categories.
  - `createCategory(req, res)` — creates from `req.body`.

### server/models/*.js (Mongoose schemas, no functions except hooks)

- `server/models/userModel.js` — `User`: `userName*`, `email*` (unique, lowercase), `role` (`user|admin`, default `user`), `createdAt`, `uid*` (Firebase uid).
- `server/models/productModel.js` — `Product`: `name*`, `slug`, `category*` (→Category), `brand*`, `images*` [String], `price*`, `description*`, `tags[]`, `additionalFeatures[]`, `reviews[]` (→Review), timestamps; `pre("save")` slugifies `name`.
- `server/models/cartModel.js` — `Cart`: `user*` (→User), `products[]` of `{product* (→Product), quantity (default 1)}`, timestamps.
- `server/models/orderModel.js` — `Order`: `user*` (→User), `paymentIntentId*`, `items[]` of `{productId* (→Product), quantity* (min 1), price* (min 0)}`, `orderTotal*` (min 0), `createdAt`.
- `server/models/reviewModel.js` — `Review`: `rating*` (1–5), `comment*`, `user*` (→User), `product*` (→Product), timestamps.
- `server/models/categoryModel.js` — `Category`: `name*` (unique), `slug` (unique), timestamps; `pre("save")` slugifies `name`.

### server/routes/*.js (no functions; map HTTP → controller)

- `server/routes/userRoutes.js` — `POST /` → `createUser`; `GET /getUserId?email=` → `getUserId` (POST alias kept); `GET /:userId` → `getUserById` (registered last so it never swallows `/getUserId`). Mounted at `/api/v1/users`.
- `server/routes/productRoutes.js` — `GET|POST /:slug?` → `getAllProducts` / `uploadFiles + createProduct`. Mounted at `/api/v1/products`.
- `server/routes/cartRoutes.js` — `POST /add`, `GET /:userId`, `POST /remove`. Mounted at `/api/v1/cart`.
- `server/routes/orderRoutes.js` — `POST /` → `createOrder`; `GET /` → `getAllOrders(?userId=)`. Mounted at `/api/v1/order`.
- `server/routes/paymentRoutes.js` — `POST /create-checkout-session`, `GET /success`, `POST /intent`. Mounted at `/api/v1/payment`.
- `server/routes/reviewRoutes.js` — `GET|POST /:id?` → `getAllReviews` / `createReview`. Mounted at `/api/v1/reviews`.
- `server/routes/categoryRoutes.js` — `GET|POST /` → `getAllCategories` / `createCategory`. Mounted at `/api/v1/categories`.

### server/utils/*.js

- `server/utils/apiFeatures.js` — Purpose: chainable Mongo query builder. Class `APIFeatures` (`constructor(query, queryString)`, `filter()` strips page/sort/limit/fields/search + gte/gt/lte/lt operators, `sort()` default `-createdAt`, `limitFields()` default `-__v`, `search()` regex over name/description/tags/brand).
- `server/utils/multerConfig.js` — Purpose: upload middleware. `storage` (disk → `images/`, unique `fieldname-timestamp-rand+ext` filenames); exports `uploadFiles` (array of up to 5 `images` files).
- `server/utils/authGuard.js` (2026-09-26) — Purpose: ownership/admin enforcement (stopgap until Firebase ID-token verification). `callerId(req)` (header → body → query); `requireAdmin` (x-user-id must belong to role-`admin` user); `requireOwner(getTargetId)` (header must equal + exist). Guards product/category create, cart, order, review-write routes.
- `server/utils/orderTotals.js` (2026-09-26) — Purpose: pure order math. `computeOrderTotal(lines)` (validates price/qty, rounds to cents). Used by `createOrder` after server-side price reload so client totals are never trusted.
- `server/tests/orderTotals.test.js` (2026-09-26) — Purpose: vitest suite (6 tests) for `computeOrderTotal`. Run via server `npm test`.

## Client

- `client/package.json` / `client/package-lock.json` — Purpose: manifest/lock (react 18, react-router-dom 6, chakra, mui, axios, firebase, stripe-js, carousel; scripts `dev/build/preview`).
- `client/vite.config.js` — Purpose: Vite + React plugin; dev server port 3000. Exports: default config.
- `client/.eslintrc.cjs` — Purpose: eslint flat-legacy config (react, hooks, refresh; ignores `dist`).
- `client/.gitignore` — Purpose: ignores `node_modules`, `dist`, `.env`, editor files.
- `client/README.md` — Purpose: lists all 8 `VITE_*` vars. Admin access = `role: "admin"` set directly in MongoDB (placeholder creds removed 2026-09-26).
- `client/index.html` — Purpose: HTML shell (`#root`, `/src/main.jsx`, fonts, ShopSphere title/icon).
- `client/public/shopSphereLogo.png`, `client/public/vite.svg` — Purpose: static public assets.
- `client/src/assets/react.svg`, `client/src/assets/images/*` (`shopSphereLogo.png`, `shopSphere.png`, `logoWhite.jpeg`, `ecoFriendly.jpg`, `summer.png`, `summerCollection.png`) — Purpose: bundled brand/illustration images (logo in Header/Footer, `ecoFriendly` in Home eco banner).
- `client/src/main.jsx` — Purpose: React entrypoint; mounts `RouterProvider(router)` inside `UserContextProvider`. No exports.
- `client/src/App.jsx` — Purpose: layout shell (`ChakraProvider` + `Header` + `Outlet` + `Footer`). `App()` takes no props.
- `client/src/App.css`, `client/src/index.css` — Purpose: global styles (Anaheim font, body bg).
- `client/src/firebase.js` — Purpose: Firebase init from 6 `VITE_*` vars. Exports: `auth`.
- `client/src/context/UserContext.jsx` — Purpose: session state. `UserContextProvider({children})` subscribes `onAuthStateChanged`, hydrates `{uid, email, _id, role}` via `GET /users/getUserId?email=`, sets the `x-user-id` axios default header for server guards, manages `uid` cookie + `loading`; `logOut()` signs out of Firebase; `useUserData()` returns `{gUser, gSetUser, logOut, loading}`.
- `client/src/utils/Router.jsx` — Purpose: route table. Exports `router`: `/` Home, `/login`, `/register`, private (`myCart`, `profile`, `success`), admin (`createProduct`), public `/products`, `/products/:slug`.
- `client/src/utils/PrivateRoutes.jsx` — Purpose: client-side guards. `PrivateRoutes()` (requires `gUser`, else `/login`); `AdminRoutes()` (requires `gUser.role === "admin"`, else `/`); both show `Loading...` while `loading`.

### client/src/components/*

- `Header.jsx` — Purpose: nav + search + profile dropdown. Props: none. `Header()` state `menuOpen/dropdownOpen/searchText`; `toggleMenu/toggleDropdown`, `handleSearch` (navigates `/products?search=`), `handleLogout`. Shows Create-Product link only when `gUser.role === "admin"` (client-side only).
- `Footer.jsx` — Purpose: static footer (logo, socials, links, payment icons). Props: none.
- `ProductCard.jsx` — Purpose: product tile with add-to-cart. Props: `name, image, price, description, productId` (+unused `brandName/slug`). `handleAddToCart` requires login, `POST /cart/add {id: gUser._id, productId, quantity: 1}` + toasts.
- `SignIn.jsx` — Purpose: Firebase email/password login → `gSetUser` → `/`. Local `handleChange/handleSubmit`.
- `SignUp.jsx` — Purpose: Firebase registration + `updateProfile`, then `POST /users {userName, email, uid}`, Firebase sign-out, → `/login`. Local `handleChange/handleSubmit`.
- `ReviewForm.jsx` — Purpose: review submission. Props: `productId`. State `rating/comment`; `handleSubmit` posts `/reviews/:productId {rating, comment, user: gUser._id, product}`.
- `ReviewList.jsx` — Purpose: paginated review display (5/page). Props: `reviews` (defaults to `[]` when not an array). `paginate(pageNumber)`.
- `Success.jsx` — Purpose: order-confirmation alert, redirects `/` after 3s. Props: none.
- `header.css`, `reviewForm.css`, `reviewList.css`, `signUp.css` — Purpose: component styles. No functions.

### client/src/pages/*

- `Home.jsx` — Purpose: landing (carousel → `/products?search=…`, Why-Choose-Us, eco banner → `?search=eco`, testimonials). Props: none; local `testimonials/carouselData` constants.
- `Product.jsx` — Purpose: catalog grid + category filter + pagination synced to URL search params. `fetchProducts()` (GET `/products` + `location.search`), `fetchCategories()`, `handlePageChange`, `handleCategoryChange`.
- `ProductDetail.jsx` — Purpose: single-product view (carousel, brand/category/price, tags, features, reviews). Fetches `/products/:slug`; `handleAddToCart` (login-gated, `POST /cart/add`); `handleAddReview` redirects guests to `/login`; renders `ReviewForm` only for logged-in users.
- `MyCart.jsx` — Purpose: cart + Stripe card checkout. `CheckoutForm({totalAmount, cartProducts, onClose})` → `handleSubmit` creates PaymentIntent, confirms card, posts order `{userId, paymentIntentId, items: [{productId, quantity, price}], orderTotal}`. `MyCart()` → `fetchCart`, `updateCartState`, `removeFromCartState`, `handleQuantityChange` (±1 via `/cart/add`), `handleRemoveFromCart` (`/cart/remove`); modal `Elements` payment form.
- `CreateProduct.jsx` — Purpose: admin product/category creation form. `handleSubmit` (multipart FormData → `POST /products`), `resetForm`, `displayAlert`, `handleAddCategory` (POST `/categories`), `handleImageChange`, `handleInputChange`, `addFeature/removeFeature`, `handleAddTag/handleRemoveTag`.
- `Profile.jsx` — Purpose: profile + cart + order history. `fetchProfileData` (GET `/users/:id`), `fetchCartItems`, `fetchOrders` (GET `/order?userId=`).
- `Product.css`, `createProduct.css`, `myCart.css`, `productDetail.css` (near-empty) — Purpose: page styles. No functions.
