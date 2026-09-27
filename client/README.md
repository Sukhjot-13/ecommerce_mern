Environment Variables:
VITE_API_HOST
VITE_STRIPE_PUBLIC_KEY
VITE_apiKey
VITE_authDomain
VITE_projectId
VITE_storageBucket
VITE_messagingSenderId
VITE_appId

Admin account

> Admin access is granted via the `role: "admin"` field on the User document
> in MongoDB (set it directly in the database for your own user). Default
> credentials must never be committed — the previous placeholder
> (admin@admin.com / 123456) was removed. If that account exists in any real
> database, rotate or delete it immediately.
