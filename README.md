# Maskatech Labs — website

Static marketing site for **Maskatech Labs**, the digital dental laboratory that fabricates custom appliances
(night guards, clear retainers) for dental practices, starting with its sister practice
[The Teeth Boutique](https://www.theteethboutique.com) in Chicago.

Canonical URL once deployed: **https://maskatech.com**

## What is in this repository

| Path | Purpose |
| --- | --- |
| `index.html` | The site (one page, anchored sections) |
| `404.html` | Not-found page |
| `og.html` | 1200×630 source card used to render `assets/img/og-image.png` |
| `assets/css/style.css` | All styles (CSS custom properties, no build step) |
| `assets/js/site-config.js` | **Edit contact details here** (email, city, sister-practice block) |
| `assets/js/main.js` | Behaviour (progressive enhancement; the site works with JavaScript off) |
| `assets/fonts/` | Self-hosted web fonts (Open Font License). No third-party font requests. |
| `assets/img/` | SVG artwork, favicon, Open Graph image |
| `robots.txt`, `sitemap.xml`, `site.webmanifest` | Crawler and PWA metadata |
| `CONTENT-REVIEW.md` | Every factual statement on the site and where it was verified. **Read this before launch.** |
| `.github/workflows/pages.yml` | Deploys the site to GitHub Pages on every push to `main` |

There is no build step and no framework. Every file is plain HTML, CSS and JavaScript.

## Preview locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy to GitHub Pages (one-time setup)

1. In this repository open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Merge to `main` (or run the "Deploy site to GitHub Pages" workflow manually from the Actions tab).
3. The site is published at `https://m-dminus.github.io/m-dminus/` until the custom domain below is attached.

## Attach the custom domain (maskatech.com)

The domain is registered at GoDaddy and today forwards to theteethboutique.com. To point it at this site:

1. **GitHub:** Settings → Pages → *Custom domain* → enter `maskatech.com` → Save. Wait for the DNS check, then tick **Enforce HTTPS** (GitHub says this option can take up to 24 hours to become available).
2. **GoDaddy → maskatech.com → DNS:**
   - Remove the existing *Forwarding* rule (it currently frames theteethboutique.com).
   - Add four **A** records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - Optionally add four **AAAA** records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
   - Add a **CNAME** record for `www` pointing to `m-dminus.github.io`.
3. **GoDaddy → maskatech.net:** set *Forwarding* to `https://maskatech.com` (permanent 301) so the .net resolves to the same site.

Source for the record values: GitHub Docs, "Managing a custom domain for your GitHub Pages site".
No `CNAME` file is needed in the repository when deploying with GitHub Actions.

## Before launch — the two items only you can finish

1. **Create the mailbox `cases@maskatech.com`** (GoDaddy email forwarding or any mail host) or change the address in
   `assets/js/site-config.js` **and** in `index.html`. It is the only contact channel on the site.
2. **Confirm "Chicago, IL"** as the lab's public location (footer/contact block), or remove it in `site-config.js`.

Everything else on the site was written only from verified facts; see `CONTENT-REVIEW.md`.

## Domain status (checked against the .com/.net registry on 2026-09-06)

| Domain | Status |
| --- | --- |
| maskatech.com | Registered via GoDaddy, Sept 11 2025 → Sept 11 2027. Currently forwards to theteethboutique.com. |
| maskatech.net | Registered via GoDaddy, Mar 7 2026. |
| maskatechlabs.com | **Not registered by anyone.** The site never references it. |
