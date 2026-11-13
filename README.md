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

## Going live (one time, about 15 minutes)

1. **Supabase**: create a free account at supabase.com (sign in with GitHub) and create a new project. Region: Frankfurt (closest to Türkiye).
2. **Database**: in the project open *SQL Editor → New query*, paste the content of `supabase/schema.sql` and press *Run*.
3. **Admin user**: *Authentication → Users → Add user → Create new user*, enter the office email and a strong password, and tick *Auto confirm*. Then in *SQL Editor* run:
   ```sql
   insert into public.admins (email) values ('office-email@example.com');
   ```
4. **Turn off public sign-ups**: *Authentication → Sign In / Providers → Email*, disable *Allow new users to sign up*.
5. **Connect the site**: *Project Settings → API*, copy the *Project URL* and the *anon public* key into `js/config.js`.
6. Open `admin.html`, log in, and press **Import starter content** on the dashboard. Then replace the example prices and dates.

## Hosting on GitHub Pages

Repository *Settings → Pages → Build and deployment*: Source **Deploy from a branch**, branch **main**, folder **/ (root)**.
The site is published at `https://mm45561.github.io/kam-website/`.

### Custom domain (later)
Settings → Pages → Custom domain, then add the DNS records shown there at the domain registrar.

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
assets/vendor/      GSAP 3.13 and Lenis 1.3 (local copies, no CDN needed)
supabase/schema.sql database tables and security rules
assets/             logo and icons
```

## Animations

`js/motion.js` adds smooth scrolling (Lenis), section reveals on scroll (GSAP ScrollTrigger), a word-by-word headline (GSAP SplitText, split by words so Arabic letters stay joined) and a soft animated hero background. All of it is turned off for visitors whose device asks for reduced motion.

## Legal checklist (Türkiye)

- KVKK: the privacy notice page (`#/privacy`) and the consent checkbox on the form are included. Have a lawyer review the text and consider VERBİS registration if required.
- Add the company's legal name and tax number in *Admin → Settings*.
- Do not use university logos or claim to be an "official representative" without a written agreement.
