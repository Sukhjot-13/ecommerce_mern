Environment Variables (see `.env.example` — copy to `.env`):
DATABASE_PASSWORD
DATABASE
PORT
STRIPE_SECRET_KEY
CLIENT_URL
SERVER_URL

Auth model: write routes enforce ownership/admin checks via the `x-user-id`
header (see `utils/authGuard.js`). Stopgap until Firebase ID-token
verification lands — then derive identity from the verified token.
