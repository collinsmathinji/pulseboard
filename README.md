# Pulseboard

The weekly operating scorecard for founders. Built for the [Vaya HQ](https://vayahq.com/build-a-startup-dashboard-get-5-paying-users) challenge: ship a startup dashboard, get **5 paying users**, acquire for **$5,000** by **September 21, 2026**.

One screen: MRR, paying users, runway, this week's three priorities, and a customer log. **$12/month** or **$99/year**. Pay to use.

## Local setup

```bash
npm install
cp .env.example .env
```

Set at least the keys in `.env.example`. Point `DATABASE_URL` and `DIRECT_URL` at the Pulseboard Supabase project (Connect → ORM → Prisma). Then:

```bash
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with any email (instant login while `AUTH_ALLOW_EMAIL_LOGIN=true`). Without Stripe keys, the $12 checkout **unlocks the app locally** and does not charge a card.

The landing page plays `public/demo.mp4`. Re-record it with `npm run demo:record` while `npm run dev` is up.

## Environment keys

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | Supabase transaction pooler (`:6543`, `pgbouncer=true`) |
| `DIRECT_URL` | yes | Supabase session pooler (`:5432`) for `prisma db push` |
| `AUTH_SECRET` | yes | Auth.js session secret |
| `AUTH_URL` | yes | App origin |
| `AUTH_ALLOW_EMAIL_LOGIN` | recommended until OAuth is live | Instant email sign-in |
| `NEXT_PUBLIC_APP_URL` | yes | Stripe return URLs |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_GTM_ID` | optional | Site-wide Analytics / Tag Manager |
| `NEXT_PUBLIC_X_HANDLE` / `NEXT_PUBLIC_*_URL` | optional | Landing social links + Open Graph |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | optional | Google sign-in |
| `RESEND_API_KEY` / `EMAIL_FROM` | optional | Magic-link email |
| `STRIPE_SECRET_KEY` | yes for real payments | Checkout + portal |
| `STRIPE_WEBHOOK_SECRET` | recommended | Subscription updates |
| `STRIPE_PRICE_MONTHLY` / `STRIPE_PRICE_ANNUAL` | optional | If empty, Checkout uses $12/mo and $99/yr `price_data` |

Generate a secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Production database

Prisma talks to **Supabase Postgres**. Users, workspaces, customers, weekly reviews, and metric snapshots live in that database, so they survive deploys and server restarts.

1. Open the Pulseboard project in [Supabase](https://supabase.com/dashboard)
2. Connect → ORM → Prisma, copy `DATABASE_URL` (port `6543`) and `DIRECT_URL` (port `5432`)
3. Put both in `.env` locally and in the Vercel project env
4. Run `npx prisma db push` once against that database

## Vercel

Sign in first (`npx vercel login`), then from this folder:

```bash
npx vercel --yes
```

Add the env vars in the Vercel project, including live Stripe keys when you are ready to sell. Point the Stripe webhook to `https://<your-domain>/api/stripe/webhook` for `checkout.session.completed` and `customer.subscription.*`.

On Windows, enable Developer Mode (or run the terminal as Administrator) if the CLI fails on `symlink` / `EPERM`. Anonymous deploys are not enough — you need a Vercel account to get a public URL.

## Path to 5 paying users

See [LAUNCH.md](./LAUNCH.md) for posts, DMs, and the Vaya registration checklist.
