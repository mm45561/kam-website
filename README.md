# KAM website

The website of **KAM (كَم للخدمات العامة)**: university admissions, scholarships and student services in Türkiye.

- Public site in Arabic, English and Turkish: `index.html`
- Admin panel: `admin.html`

## How it works

The site is plain HTML/CSS/JavaScript with no build step, so it can be hosted for free on GitHub Pages.

| Mode | When | Where the data lives |
|---|---|---|
| Demo | `js/config.js` is empty (default) | In each visitor's browser only. Admin password: `kam-demo` |
| Live | `js/config.js` has the Supabase URL and key | Supabase database (free plan), shared by everyone |

## Going live (one time, about 20 minutes)

1. **Supabase**: create a free account at supabase.com (sign in with GitHub) and create a new project. Region: Frankfurt (closest to Türkiye). Let Supabase generate the database password and keep it in a password manager.
2. **Database**: in the project open *SQL Editor → New query*, paste the content of `supabase/schema.sql` and press *Run*. It can be run again safely after updates.
3. **Admin user**: *Authentication → Users → Add user → Create new user*, enter the office email and a long password (16+ characters), and tick *Auto confirm*. Then in *SQL Editor* run:
   ```sql
   insert into public.admins (email) values ('office-email@example.com');
   ```
4. **Turn off public sign-ups**: *Authentication → Sign In / Providers → Email*, disable *Allow new users to sign up*.
5. **Connect the site**: *Project Settings → API*, copy the *Project URL* and the *anon public* key into `js/config.js`. Never put the `service_role` key anywhere in this repository.
6. **Two-step login**: open `admin.html` and log in. The first time, the panel shows a QR code: scan it with Google Authenticator or Microsoft Authenticator and enter the 6-digit code. From then on every login asks for the code.
7. Press **Import starter content** on the dashboard. Then replace the example prices and dates.

## Hosting on Cloudflare Pages

*Workers & Pages → Create → Pages → Connect to Git*, choose this repository, leave *Build command* empty and *Build output directory* as `/`. Every push to `main` publishes automatically. `_headers` adds the security headers (HTTPS only, content security policy, no framing) and keeps the admin panel out of Google.

Custom domain (later): in the Pages project open *Custom domains*, add the domain, then in Supabase set *Authentication → URL Configuration → Site URL* to it.

## Security

| Layer | Protection |
|---|---|
| Admin access | Email + password **and** a 6-digit authenticator code. The database itself refuses admin actions without the code step (`aal2` in `is_admin()`), so a stolen password is not enough. Auto sign-out after 30 minutes idle. |
| Database | Row Level Security on every table. Visitors can only read published content and send applications; they cannot read, change or delete applications. |
| Application form | Visitors may fill only the `data` column. A database trigger accepts only known fields with length limits, requires consent, and allows at most 5 applications per hour per internet address (stored as a salted hash, never the raw IP) and 300 per hour in total. Plus a hidden honeypot field. |
| Images | Admin-only upload, images only, 3 MB max. |
| Browser | No third-party scripts: Supabase, GSAP and Lenis are local copies in `assets/vendor`. Content Security Policy allows scripts only from the site itself. Admin-entered links are limited to http, https, mailto and tel. |
| Excel export | Cells that start with `=`, `+`, `-` or `@` are neutralised so a student's text can never run as a formula. |

The free Supabase plan pauses a project after 7 days without visits. `.github/workflows/keep-alive.yml` reads the public settings row every 3 days with the public anon key, the same request any visitor makes, so it never sees student data. GitHub turns scheduled workflows off after 60 days without commits: if that happens, open *Actions → Keep database awake → Enable workflow*.

Accounts to protect with two-step login: GitHub, Supabase, Cloudflare and the office email.

## Files

```
index.html          public site
admin.html          admin panel
css/                styles
js/config.js        Supabase connection (empty = demo mode)
js/store.js         data layer (demo / Supabase)
js/seed.js          starter content
js/i18n.js          interface texts (ar / en / tr)
js/schemas.js       admin panel fields
js/site.js          public site pages
js/admin.js         admin panel
js/motion.js        page animations (GSAP, ScrollTrigger, SplitText, Lenis)
assets/vendor/      GSAP 3.13, Lenis 1.3 and supabase-js 2.45.4 (local copies, no CDN)
_headers            security headers for Cloudflare Pages
robots.txt          keeps the admin panel out of search engines
supabase/schema.sql database tables and security rules
assets/             logo and icons
```

## Animations

`js/motion.js` adds smooth scrolling (Lenis), section reveals on scroll (GSAP ScrollTrigger), a word-by-word headline (GSAP SplitText, split by words so Arabic letters stay joined) and a soft animated hero background. All of it is turned off for visitors whose device asks for reduced motion.

## Before launch (depends on hosting, database and domain)

| Item | Depends on | Notes |
|---|---|---|
| Clean page addresses for Google (`/universities/...` instead of `#/universities/...`) | Hosting + domain | Needs a host with rewrite rules (Cloudflare Pages or Netlify `_redirects`). Hash pages are not indexed separately by Google. |
| `sitemap.xml`, `robots.txt`, canonical and hreflang tags | Domain | Need the final address. |
| Connect Supabase (`js/config.js`) and run `supabase/schema.sql` | Database | Until then the site is in demo mode. |
| Notify the office of each new application (email or Telegram) | Database | Supabase database webhook or Edge Function. |
| Stronger spam protection on the application form | Hosting | Rate limit and field checks are in the database already. Cloudflare Turnstile (free) can be added if bots still get through. |
| Students uploading documents (passport, diploma) | Database | Private storage bucket + KVKK consent text update. |
| Visitor statistics | Hosting + domain | Cloudflare Web Analytics (no cookies) or Google Analytics (needs a cookie notice). |
| Office email (info@domain) | Domain | Show it in Admin → Settings. |

## Legal checklist (Türkiye)

- KVKK: the privacy notice page (`#/privacy`) and the consent checkbox on the form are included. Have a lawyer review the text and consider VERBİS registration if required.
- Add the company's legal name and tax number in *Admin → Settings*.
- Do not use university logos or claim to be an "official representative" without a written agreement.
