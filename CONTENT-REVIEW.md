# CONTENT REVIEW — Maskatech Labs ("Obsidian Precision" build)

Every sentence on the site (and every factual statement in `README.md`) that could be read as a factual claim,
with its source line in FACTS.md. Line numbers refer to FACTS.md. "Generic" = marketing or process language with
no checkable claim about the lab. The build brief is an instruction, not a fact source: wording that exists only
because the brief asked for it is labelled as such and listed for the owner to confirm.

## Items the owner must confirm before launch

1. **cases@maskatech.com** (FACTS L14) — the mailbox (or forward) must exist. It appears in: the Appliances note
   link ("Ask about a case", `href` only), For practices (visible link), Contact (visible link + form `action`),
   Footer, 404 (ghost button), JSON-LD `email`, the fallback address in `assets/js/main.js` (form handler), and
   `assets/js/site-config.js` (`contactEmail`).
2. **"Chicago, IL"** (FACTS L15–16, owner inference) — printed in ONE place only: the footer bottom bar, sourced
   from `site-config.js` (`city`) with the same static text in `index.html`. To remove: delete the `city` value in
   `site-config.js` and the `<p class="mono" data-cfg="city">` line in the footer. The JSON-LD carries no
   `areaServed` (removed: it was a second copy of the same inference). The clinic's own address (FACTS L31) also
   contains "Chicago"; that is the verified clinic address, not the lab's.
3. **Prescription wording — removed (brief deviation to sign off).** The build brief (§6) asked for "send the case
   with the prescription", but FACTS L21–22 describes intake only as scan-and-send and no line mentions a
   prescription. The site therefore does not say that cases arrive with a prescription or that appliances are made
   "as prescribed"; every instance was reworded to the verified intake wording (Workflow "Design", the glyph caption,
   both appliance cards, Precision 02, the For-practices lede and step 02, and the Notes placeholder — see the tables
   below). If cases do arrive with a prescription, add that to FACTS.md and the wording can be restored.
4. **Form select options** "Night guard – upper / Night guard – lower / Clear retainer / Other" — products L19–20;
   the option labels and the "Other" entry were requested by the build brief (§8), no FACTS source for the wording.
5. **"Sending a case takes three steps."** — page framing that counts the three steps listed on the page; the
   three-step structure was requested by the build brief (§6). No FACTS source for "three"; the underlying process
   (scan → send → delivered back for the delivery appointment) is L21–22.
6. **Clinic phone (773) 857-2290** (FACTS L32) is printed as the clinic's main line, as a `tel:` link, exactly as
   written in `site-config.js`.
7. **og-image.png** — `og.html` must be screenshotted at 1200×630 and saved to `assets/img/og-image.png`
   (referenced by the `og:image` / `twitter:image` tags). The shipped file is that render, losslessly re-compressed
   (pixel-identical, 8-bit RGB, 1200×630).
8. The contact form is a `mailto:` form (no server, no third party). Submissions open the visitor's mail app.

## Head / metadata

| Text | Source |
|---|---|
| `<title>` "Maskatech Labs — Digital Dental Laboratory" | L8–9 |
| Meta description: "Maskatech Labs is a digital dental laboratory. From intraoral scan to finished appliance: night guards and clear retainers, digitally designed for the individual case." | L9, L19–20, L55–56 |
| OG/Twitter description: "Scan in. Appliance out. Night guards and clear retainers, digitally designed for the individual case." | L55, L19–20, L56 |
| Canonical / og:url / sitemap `https://maskatech.com/` | L11–12 |
| JSON-LD: name "Maskatech Labs", url, email cases@maskatech.com | L8, L11–12, L14 |
| JSON-LD description: "Digital dental laboratory fabricating custom oral appliances for dental practices." | L9 |
| JSON-LD `logo` `https://maskatech.com/assets/img/logo.svg` | Points at the repo's own wordmark under the canonical URL (L11–12) |
| site.webmanifest name "Maskatech Labs", short_name "Maskatech", description "Digital dental laboratory. Custom oral appliances for dental practices." | L8 (wordmark "MASKATECH" allowed), L9 |
| `assets/img/logo.svg` `<title>` / aria-label "Maskatech Labs"; wordmark text "MASKATECH" + "LABS" | L8 |

## Hero

| Text | Source |
|---|---|
| "Digital dental laboratory · Custom oral appliances" | L9 |
| "Scan in. Appliance out." | L55 (verbatim) |
| "Maskatech Labs is a digital dental laboratory." | L9 |
| "Your practice sends an intraoral scan." | L21–22 |
| "We return a precision-fabricated appliance, digitally designed for the individual case." | L21–22, L47, L56 |
| Spec strip — "Intake: Intraoral scan from the practice" | L21–22 |
| Spec strip — "Design: Digital, for the individual case" | L56 |
| Spec strip — "Output: Night guards · Clear retainers" | L19–20 |
| HUD readouts "Mesh // Dental arch", "θ ---.-°", "Scan --%", "Motion on/off" | Decorative readouts of the canvas animation (rotation angle, scan-pass progress). The HTML ships placeholders ("---.-°", "--%", empty bar); JS writes the live values. Not business metrics. Marked `aria-hidden`. |
| Fallback image alt "Wireframe scan mesh of a dental arch" | Describes the illustration only. The canvas that takes over with JS draws the same subject and is `aria-hidden`; the image is only faded by CSS and keeps its alt, so the hero has the same single text alternative with and without JavaScript. |

## 01 / Workflow

| Text | Source |
|---|---|
| "From intraoral scan to finished appliance." | L55 (verbatim) |
| "One digital thread runs through every case, from the scan your practice takes to the appliance delivered back for the delivery appointment." | L21–22 |
| Scan — "The practice takes an intraoral scan of the patient and sends the case. The scan is the case." | L21–22 (second sentence restates the first) |
| Design — "The appliance is digitally designed on that scan, for the individual case." | L56, L47 |
| Fabricate — "Precision-fabricated from the design. Digitally exact." | L47, L56 |
| Finish & inspect — "Hand-finished. Every case is inspected before it leaves the lab." | L56, L58 (verbatim) |
| Deliver — "The finished appliance is delivered back to the practice for the scheduled delivery appointment." | L21–22 |
| Glyph captions (aria-hidden SVG): "Intraoral scan", "Occlusal view", "Case design", "Individual case", "Fabrication", "Digitally exact", "Hand-finished", "Inspected", "Lab", "Practice", "Delivered back", "Delivery appointment" | L21–22, L56, L58 |
| Stage HUD "Step 01…05" + step name | Counts the five page steps; decorative, `aria-hidden` |

## 02 / Appliances

| Text | Source |
|---|---|
| "Night guards and clear retainers, engineered to the scan." | L19–20, L56 |
| "Each appliance is designed on the patient's own scan and built for that case. Nothing is generic." | L56 (case-by-case design); second sentence restates it |
| Night guard — tag "Upper · Lower" | L19 |
| Night guard — "An occlusal guard covering the upper or lower arch." | L19 |
| Night guard — "Patients whose dentist recommends an occlusal guard." | Generic (describes the patient, no claim about the lab or its intake) |
| Night guard — "Designed on the patient's own scan, so the fit is engineered to that arch." | L56 ("Engineered fit", "Digitally designed for the individual case") |
| Clear retainer — tag "Per arch" | L20 (a retainer is ordered per arch, e.g. a lower retainer) |
| Clear retainer — "A clear retainer, digitally designed on the scan." | L20, L47 |
| Clear retainer — "Patients whose dentist recommends a clear retainer." | Generic (describes the patient, no claim about the lab or its intake) |
| Clear retainer — "Designed to the scanned arch, case by case, so the retainer follows the arch as it is." | L56 |
| "Additional appliances by request — ask us about your case." | L23–25 (verbatim soft line, L25) |
| Link text "Ask about a case" | Generic call to action |

## 03 / Precision

| Text | Source |
|---|---|
| "Hand-finished. Digitally exact." | L56 (verbatim) |
| "Four principles behind every case." | Page framing for the four principles listed below (L56–59). "Four" counts page items, not a business metric. |
| "Engineered fit — Every appliance is designed on the patient's own scan and built to that geometry." | L56 |
| "Case-by-case design — Each appliance is designed for the individual case." | L56 |
| "Inspected before it leaves the lab — Every case is inspected before it leaves the lab." | L58 (verbatim; the brief's "before it ships" was not used because nothing in FACTS says appliances are shipped — L22 says "delivered back to the practice") |
| "Tooling that proves itself — We adopt new digital tooling as it proves itself." | L59 (verbatim) |

## 04 / For practices

| Text | Source |
|---|---|
| "Sending a case takes three steps." | Page framing — see confirm item 5 |
| "Scan the patient, send the case, and schedule the delivery appointment. We handle the rest." | L21–22; "We handle the rest" generic |
| "Scan the patient — Take an intraoral scan in your practice." | L21–22 |
| "Send the case — Appliance, arch and any notes for the design." | L21–22 (the practice sends the case); the second sentence is an instruction listing what to include, no claim |
| "Receive it for the delivery appointment — We fabricate the appliance and deliver it back to your practice for the scheduled delivery appointment." | L21–22 |

## 05 / Sister practice

| Text | Source |
|---|---|
| "Built for the practices we work with, starting with our sister clinic." | L57 |
| "Maskatech Labs fabricates appliances for The Teeth Boutique in Chicago." | L33–34 (allowed wording, verbatim) |
| "The Teeth Boutique" | L28–29 (verified spelling) |
| "General + Cosmetic Dentistry" | L28 (exact tagline) |
| "1933 W Irving Park Rd, Suite 1, Chicago, IL 60613" | L31 |
| "(773) 857-2290" | L32 (main line only) |
| "theteethboutique.com" → https://www.theteethboutique.com | L30 |

## 06 / Start a case

| Text | Source |
|---|---|
| "Send the case details below. The form opens a prefilled email in your mail app. Nothing is stored on this site." | Site mechanics (mailto form; no server, no third party) |
| "Or write directly — cases@maskatech.com" | L14 |
| Select options: Night guard – upper / Night guard – lower / Clear retainer / Other | L19–20 (products); labels per build brief §8 — see confirm item 4 |
| Placeholder "Arch and anything the design should account for." | Instruction, no claim |
| "Submitting opens your email app with the case details prefilled." / JS status "Opening your email app with the case details." | Site mechanics |
| Generated email subject "New case — <selected appliance>" and body lines "Name / Practice / Email / Appliance / Notes" (`assets/js/main.js`) | Site mechanics; echoes the visitor's own input |

## Footer

| Text | Source |
|---|---|
| "Digital dental laboratory. Custom oral appliances for dental practices, from intraoral scan to finished appliance." | L9, L55 |
| "© 2026 Maskatech Labs" (year set by JS, static fallback 2026) | L8 |
| "Chicago, IL" | L15–16 — **confirm** (single location, from site-config.js) |
| "Sister practice: The Teeth Boutique ↗" | L28, L33 |
| "maskatech.com" | L11–12 |

## 404.html

| Text | Source |
|---|---|
| `<title>` "Page not found — Maskatech Labs"; meta description "The page you requested does not exist. Return to Maskatech Labs." | L8; site mechanics |
| "No page at this coordinate." / "The address may have been typed incorrectly, or the page has moved. Everything else is where it was." | Generic (location-neutral: the site gives no lab address, FACTS L15, L51) |
| "cases@maskatech.com", "© 2026 Maskatech Labs", "maskatech.com" | L14, L8, L11 |

## og.html (social card)

| Text | Source |
|---|---|
| `<title>` "Maskatech Labs — Open Graph card" (not indexed; `noindex`) | L8 |
| "Digital dental laboratory" | L9 |
| "Scan in. Appliance out." | L55 |
| "Night guards and clear retainers, digitally designed for the individual case." | L19–20, L56 |
| "maskatech.com" | L11 |

## README.md

| Statement | Source |
|---|---|
| "digital dental laboratory that fabricates custom appliances (night guards, clear retainers) for dental practices, starting with its sister practice The Teeth Boutique in Chicago" | L9, L19–20, L28, L31, L33–34, L57 |
| Canonical URL https://maskatech.com | L11–12 |
| "The domain is registered at GoDaddy." | L11 |
| Domain status: maskatech.com registered via GoDaddy Sept 2025, expires Sept 2027; maskatech.net registered via GoDaddy Mar 2026 | L11–12 (month-level, as recorded) |
| Font licences | `assets/fonts/OFL-space-grotesk.txt`, `assets/fonts/OFL-jetbrains-mono.txt` (upstream SIL OFL 1.1 texts, in-repo) |
| GitHub Pages A / AAAA / CNAME record values; "Enforce HTTPS can take up to 24 hours" | GitHub Docs, "Managing a custom domain for your GitHub Pages site" (cited in README) |
| Project URL `https://m-dminus.github.io/m-dminus/` and CNAME target `m-dminus.github.io` | Derived from this repository's owner and name (`m-dminus/m-dminus`); URL form per GitHub Docs, "Managing a custom domain for your GitHub Pages site" |
| "As of 2026-09-06 it forwards (in a frame) to theteethboutique.com" / "the one that currently frames theteethboutique.com" | Direct HTTPS fetch of https://maskatech.com on 2026-09-06 returned a frameset page whose frame source is https://www.theteethboutique.com |
| Domain status table: maskatech.com registered via GoDaddy Sept 11 2025 → Sept 11 2027; maskatech.net registered via GoDaddy Mar 7 2026; maskatechlabs.com not registered | Verisign RDAP registry lookups (rdap.verisign.com) on 2026-09-06; maskatechlabs.com returned HTTP 404 (no record) |
| "the site works with JavaScript off" (`assets/js/main.js` row) | Repo inspection: every section is static markup; `html:not(.js)` rules in `style.css` show the menu, stepper panels and fallback image without JS; verified with a JS-disabled render |
| "No third-party font requests" (`assets/fonts/` row) | Repo inspection: the only `url()` values in `assets/fonts/*.css` and `style.css` are relative `.woff2` paths or `data:` URIs; no external stylesheet, script or font host is referenced by any page |
| "There is no build step and no framework. Every file is plain HTML, CSS and JavaScript." | Repo inspection: no package manifest, bundler config or framework import; the pages link the source files directly |
| "Every asset path in the site is relative, so it works at that sub-path" | Repo inspection: no `href`, `src` or `url()` in `index.html`, `404.html`, `og.html`, `style.css` or the font CSS starts with `/` |
| "GitHub Pages serves the custom `404.html` for missing URLs" and the root-absolute-path note for `404.html` | GitHub Docs, "Creating a custom 404 page for your GitHub Pages site" (a `404.html` at the publishing source root is served for missing URLs); the relative-vs-root-absolute path behaviour is plain HTML resolution, not a GitHub claim |
| "No `CNAME` file is needed in the repository when deploying with GitHub Actions" | GitHub Docs, "Managing a custom domain for your GitHub Pages site" (the CNAME file is created only when publishing from a branch) |
| "GitHub says this option [Enforce HTTPS] can take up to a day to become available" | GitHub Docs, "Securing your GitHub Pages site with HTTPS" |

## Brand and company names in the repository

None of the following is visible site copy, and none is an equipment, software or material brand of the kind FACTS L45
forbids. They are listed so the owner's check is complete:

| Name(s) | Where | Why it is there |
|---|---|---|
| "Space Grotesk", "JetBrains Mono" | `font-family` values in `assets/css/style.css`, `assets/fonts/*.css`, `og.html`, `assets/img/logo.svg`; `<link>` filenames in `index.html`, `404.html`, `og.html`; licence file names | The two self-hosted typefaces (SIL Open Font License) |
| "Helvetica Neue", Helvetica, Arial, `system-ui`; SFMono-Regular, Menlo, Consolas, "Liberation Mono" | Fallback font stacks in `assets/css/style.css` (lines 48–49), `og.html` and `assets/img/logo.svg` | System fonts named only so text renders before or without the web fonts |
| JetBrains, SIL, `github.com`, `openfontlicense.org`, `scripts.sil.org` | `assets/fonts/OFL-jetbrains-mono.txt`, `assets/fonts/OFL-space-grotesk.txt` | Upstream copyright lines and licence URLs, reproduced verbatim as the OFL requires |
| GoDaddy, GitHub (GitHub Pages, GitHub Actions, GitHub Docs), Python (`python3`) | `README.md` | Registrar (FACTS L11–12), hosting/deploy instructions, and a local preview command; developer documentation, not site copy |
| Twitter ("Open Graph / Twitter" comment, `twitter:*` meta names) | `index.html` `<head>` | Standard social-card meta names required by the card format; not rendered |
| Safari | Code comment in `assets/js/main.js` (line 20) | Explains a browser-compatibility branch |
| "Open Graph" | `og.html` title, `README.md` | Name of the social-card protocol |

No page renders any of these names, and no company logo appears anywhere (FACTS L49).

## Deliberately absent (FORBIDDEN list, L41–52)

No turnaround times, case/doctor counts, founding year, certifications, equipment/software/material brands,
fabrication technology names, pricing, warranties, testimonials, team bios, lab address or phone, owner name,
or any email other than cases@maskatech.com. No product beyond night guards and clear retainers is listed;
other appliances appear only in the allowed soft line (L23–25). "maskatechlabs.com" (L13) is not referenced anywhere on the site; `README.md` names it only in the domain-status table to record that it is unregistered.
