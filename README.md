# Maskatech Labs — website

Static marketing site for **Maskatech Labs**, the digital dental laboratory that designs and fabricates custom
oral appliances (night guards, clear retainers) for dental practices, starting with its sister practice
[The Teeth Boutique](https://www.theteethboutique.com) in Chicago.

Canonical URL once deployed: **https://maskatech.com**

Design direction: **"Cure Light"** — a deep-indigo ground lit by two lights (amber where light touches something: the
print's cure line, buttons, active numerals; violet as cold ambient scan light), glass surfaces, monospace metadata and
big display type. The hero is a canvas sequence in which a night guard is scanned as a point cloud, designed as a
wireframe and then printed layer by layer, with a static SVG of the finished stack as the no-JavaScript / reduced-motion
fallback. Every readout on the page describes that animation only; there are no invented business numbers.

> An earlier, more conservative build of this site lives on the branch `claude/maskatech-labs-website-0w03e2`
> (pull request #1). This branch is a fresh design and does not depend on it.

## What is in this repository

| Path | Purpose |
| --- | --- |
| `index.html` | The site (one page, anchored sections) |
| `404.html` | Not-found page |
| `og.html` | 1200×630 source card used to render `assets/img/og-image.jpg` (not published) |
| `assets/css/style.css` | All styles (CSS custom properties, no build step) |
| `assets/js/site-config.js` | **Edit contact details here** (email, sister-practice block) |
| `assets/js/main.js` | Behaviour (progressive enhancement; the site works with JavaScript off) |
| `assets/fonts/` | Self-hosted web fonts (Syne, Inter Tight, Geist Mono; `fonts.css` + `.woff2`) with their SIL OFL licence texts (`OFL-*.txt`). No third-party font requests. |
| `assets/img/` | `appliance-layers.svg` (hero fallback, generated from the same geometry as the canvas), `logo.svg` (wordmark outlined as paths, no font dependency), `og-image.jpg` (rendered from `og.html`) |
| `favicon.svg` | Site icon (root, referenced by the pages and the manifest) |
| `robots.txt`, `sitemap.xml`, `site.webmanifest` | Crawler and PWA metadata |
| `CONTENT-REVIEW.md` | Every factual statement on the site and where it was verified. **Read this before launch.** (not published) |
| `.github/workflows/pages.yml` | Deploys the site to GitHub Pages on every push to `main`; the README, this review, `og.html` and the dotfiles are left out of the published site |
| `.nojekyll`, `.gitignore` | Tells GitHub Pages not to run Jekyll; ignores OS/editor files |

There is no build step and no framework. Every file is plain HTML, CSS and JavaScript.

Accessibility and motion: the site is complete with JavaScript disabled (static markup, fallback image, wrapped nav).
The hero animation never starts when the visitor's system asks for reduced motion, and the **Motion** button on the
stage turns it off or on at any time (remembered in the browser). Keyboard users get the same content in DOM order:
skip link, nav, hero copy, Motion button, sections; the canvas and all readouts are hidden from assistive technology.

## Preview locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then open the address it shows (port 8080) in a browser
```

## Deploy to GitHub Pages (one-time setup)

1. In this repository open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Merge to `main` (or run the "Deploy site to GitHub Pages" workflow manually from the Actions tab).
3. Until the custom domain below is attached, the site is served at `https://m-dminus.github.io/m-dminus/`
   (also shown in **Settings → Pages**). Every asset path in the site is relative, so it works at that sub-path
   exactly as it will at the root of maskatech.com.

## Attach the custom domain (maskatech.com)

The domain is registered at GoDaddy. As of 2026-09-18 it forwards (in a frame) to theteethboutique.com. To point it at this site:

1. **GitHub:** Settings → Pages → *Custom domain* → enter `maskatech.com` → Save. Wait for the DNS check, then tick **Enforce HTTPS** (GitHub says this option can take up to 24 hours to become available).
2. **GoDaddy → maskatech.com → DNS:**
   - Remove the existing *Forwarding* rule (the one that currently frames theteethboutique.com).
   - Add four **A** records for `@` pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - Optionally add four **AAAA** records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
   - Add a **CNAME** record for `www` pointing to `m-dminus.github.io`.
3. **GoDaddy → maskatech.net:** set *Forwarding* to `https://maskatech.com` (permanent 301) so the .net resolves to the same site.
4. Nothing to change in the pages: GitHub Pages serves the custom `404.html` for missing URLs (including nested ones such
   as `/a/b/`), and a small inline script in `404.html` resolves its relative asset paths against the site root — `/` on
   the custom domain, `/m-dminus/` on the project preview. If the repository is ever renamed, update the one `'m-dminus'`
   string in that script.

Source for the record values: GitHub Docs, "Managing a custom domain for your GitHub Pages site".
No `CNAME` file is needed in the repository when deploying with GitHub Actions.

## Before launch — items only you can finish

1. **Create the mailbox `cases@maskatech.com`** (GoDaddy email forwarding or any mail host) or change the address in
   `assets/js/site-config.js` **and** in every literal copy in `index.html` (including the JSON-LD block) and `404.html`
   — `CONTENT-REVIEW.md` item 1 lists each occurrence. It is the only contact channel on the site.
2. **Confirm or delete "AI-assisted design where it earns its place"** (Capabilities 02). The evidence for it is
   moderate; the sentence still reads correctly without the clause.
3. **Confirm the finishing wording** — "Hand-finished" and "Inspected before it leaves the lab" describe a generic
   finishing/QC step; make sure that is how you work.
4. **maskatechlabs.com is not registered** (see the table below). If you want it, buy it and forward it to maskatech.com.

Every factual statement on the site traces to a verified source in `CONTENT-REVIEW.md`; the list there is longer and
names every place each item appears.

## Domain status (checked against the .com/.net registry via RDAP and GoDaddy on 2026-09-18)

| Domain | Status |
| --- | --- |
| maskatech.com | Registered via GoDaddy, Sept 11 2025 → Sept 11 2027. Currently forwards to theteethboutique.com. |
| maskatech.net | Registered via GoDaddy. |
| maskatechlabs.com | **Not registered by anyone** on that date (the registry has no record; GoDaddy lists it as available). If you meant to own it, it still needs to be bought. The site never references it. Once registered, forward it (301) to https://maskatech.com like the .net. |
