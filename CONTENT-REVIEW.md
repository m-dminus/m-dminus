# CONTENT REVIEW — Maskatech Labs ("Cure Light" build)

Every sentence on the site (and every factual statement in `README.md`) that could be read as a factual claim, with the
source it was verified against on 2026-09-18. "Generic" = marketing or process language with no checkable claim about the
lab. Anything the owner should confirm before launch is listed first.

## Sources used (all checked 2026-09-18)

| Source | What it verified |
| --- | --- |
| Clinic's own email signature (sent from the clinic's mailbox, Dec 2025–May 2026) | "The Teeth Boutique", 1933 W Irving Park Rd. Suite 1, Chicago, IL 60613, (773) 857-2290 main, (773) 857-2280 main, (773) 857-2260 fax, website domain theteethboutique.com |
| CMS NPI Registry, NPI 1447086772 | Legal name "TEETH BOUTIQUE PLLC", taxonomy "Dentist, General Practice", 1933 W Irving Park Rd Ste 1, Chicago, IL 60613-5182, phone 773-857-2280 |
| Clinic → lab case emails (Dec 2025–Jan 2026) | Products: "Upper Night Guard", "Upper NG", "Lower Retainer"; intake: "we scanned a patient today … and have scheduled his delivery for 2/9/26"; the lab produces the appliance and it is delivered back for the delivery appointment |
| Printer-vendor support thread (Dec 2025, cc the lab) | Night guards are 3D printed in-house from a design file |
| "AI Retainer" design thread (Dec 2025) | An AI-assisted design workflow is in use (moderate evidence — **owner-confirm**) |
| Verisign RDAP (rdap.verisign.com) + GoDaddy availability lookup | maskatech.com registered (GoDaddy, 2025-09-11 → 2027-09-11); maskatech.net registered; **maskatechlabs.com not registered** |
| Direct HTTPS fetch of https://maskatech.com | Currently a frameset that loads https://www.theteethboutique.com |
| GitHub Docs ("Managing a custom domain for your GitHub Pages site", "Securing your GitHub Pages site with HTTPS") | A/AAAA/CNAME record values, "Enforce HTTPS can take up to 24 hours" |

The clinic website itself (theteethboutique.com) sits behind a bot challenge and could not be fetched on 2026-09-18; the
earlier build verified it on 2026-09-06. No clinic tagline is used for that reason.

## Items the owner must confirm before launch

1. **cases@maskatech.com** — the mailbox (or a forward) must exist. It is the only contact channel on the site. It appears
   in `assets/js/site-config.js` (`contactEmail`) and, so the site works without JavaScript, literally in `index.html`
   (Appliances note, For practices, Contact heading link, form `action`, footer), `404.html` and the JSON-LD. Change
   both places together.
2. **"AI-assisted design where it earns its place"** (Capabilities 02) — moderate evidence only (an AI design workflow was
   in use in Dec 2025). Delete the clause if you would rather not say it; the sentence still reads correctly.
3. **"Hand-finished"** (hero lede, Workflow 04, Capabilities 04) and **"Inspected before it leaves the lab"** (Workflow
   04, Capabilities 04) — generic finishing/QC language carried over from the earlier build; confirm it describes your
   process.
4. **"Serving Chicago practices"** (footer) — true today because the sister clinic is in Chicago. The site prints no lab
   address, city or phone anywhere else.
5. **Form select options** "Night guard – upper / lower", "Clear retainer – upper / lower", "Other" — products from the
   case emails; labels are the site's own wording.
6. **maskatechlabs.com** — you believe you own it; the .com registry had no record of it on 2026-09-18 and GoDaddy listed
   it as available. The site never mentions it. Register it (or not) and forward it to maskatech.com.

## Head / metadata

| Text | Source |
|---|---|
| `<title>` "Maskatech Labs — Digital Dental Laboratory" | Lab name (repo README, domain); "digital dental laboratory" = description of the business (scan-in, digital design, in-house fabrication: case emails + printer thread) |
| Meta description: "… Intraoral scan in, precision appliance out: night guards and clear retainers, digitally designed for the individual case and fabricated in-house." | Case emails (products, scan intake); printer thread (in-house fabrication); "precision" generic |
| OG/Twitter description: "Built from the scan up. Night guards and clear retainers, digitally designed for the individual case." | Case emails; headline is a slogan |
| Canonical / og:url / sitemap `https://maskatech.com/` | RDAP: maskatech.com registered to the owner via GoDaddy |
| JSON-LD: name, url, email cases@maskatech.com, description "Digital dental laboratory. Night guards and clear retainers, digitally designed for dental practices.", logo `assets/img/logo.svg` | As above; email = owner-confirm 1 |
| `site.webmanifest` name / short_name / description | As above |

## Hero

| Text | Source |
|---|---|
| "Digital dental laboratory" | Business description (above) |
| "Built from the scan up." | Slogan; refers to scan-based intake (case emails) |
| "Your practice sends an intraoral scan. We design the appliance on it, fabricate it in-house, finish it by hand and deliver it back for the delivery appointment." | Case emails (scan, delivery appointment); printer thread (in-house); "finish it by hand" = owner-confirm 3 |
| Spec strip: Intake "Intraoral scan" · Design "Digital, per case" · Fabrication "In-house, from the design file" · Output "Night guards · Clear retainers" | Case emails; printer thread; design thread |
| Readouts "Scan / Design / Print", "Layer nnn / 072", "Orbit nnn°", "Motion on/off" | Describe the canvas animation only (its phase, the number of contour rings drawn out of 72, the model's rotation). `aria-hidden`; not business numbers |
| Fallback image alt "A stylised night guard built up layer by layer, drawn as stacked contour lines" | Describes the illustration; scoped to a night guard because 3D printing is verified for night guards only |
| Ticker "Intraoral scan → Digital design → In-house fabrication → Hand finish → Delivery appointment" | As the lede; decorative, `aria-hidden` |

## 01 — Workflow

| Text | Source |
|---|---|
| "One digital thread, scan to chairside." / "Every case moves through the same digital pipeline. The scan is the source of truth from intake to delivery." | Framing of the scan-based process (case emails); "source of truth" generic |
| 01 Scan — "The practice takes an intraoral scan of the patient and sends the case. The scan is the case." | Case emails |
| 02 Design — "The appliance is designed digitally on that scan, for the individual arch." | Design thread; per-arch products in the case emails |
| 03 Fabricate — "Built in-house straight from the design file. Night guards are 3D printed, layer by layer." | Printer thread (night guards only — deliberately scoped) |
| 04 Finish & inspect — "Hand-finished. Inspected before it leaves the lab." | Owner-confirm 3 |
| 05 Deliver — "Back to your practice for the scheduled delivery appointment." | Case emails |
| Stage readouts "01…05 / 05" and the step name; five glyphs | Decorative, `aria-hidden` |

## 02 — Appliances

| Text | Source |
|---|---|
| "Two appliances, engineered to the scan." / "Each appliance is designed on the patient's own scan and built for that case. Nothing is generic." | Case emails (two products); design thread; "engineered", "nothing is generic" = marketing framing of per-case design |
| Night guard — "Upper · Lower"; "An occlusal guard covering the upper or lower arch."; "Patients whose dentist recommends an occlusal guard."; "Designed on the patient's own scan and 3D printed, so the fit is engineered to that arch." | Case emails (upper/lower night guards); printer thread (3D printed); the "who it is for" line is generic |
| Clear retainer — "Per arch"; "A clear retainer designed on the scanned arch, case by case."; "Patients whose dentist recommends a clear retainer."; "Designed to the arch as it was scanned, so the retainer follows it as it is." | Case emails ("Lower Retainer"); no printing claim is made for retainers |
| "Additional appliances by request." / "Ask about your case →" | Generic soft line (carried over from the earlier build) |

## 03 — Capabilities

| Text | Source |
|---|---|
| "Always on the current stack." / "Five things that are true of every case we take." | Framing; "five" counts the page items |
| 01 Scan-native — "Cases start as intraoral scans. The scan is the record, the model and the design input." | Case emails |
| 02 Digital design — "Every appliance is designed on the scan, with AI-assisted design where it earns its place." | Design thread; owner-confirm 2 |
| 03 Additive fabrication — "Night guards are 3D printed in-house from the design file. Layer by layer, digitally exact." | Printer thread (scoped to night guards) |
| 04 Hand-finished — "Digitally exact, finished by a person. Inspected before it leaves the lab." | Owner-confirm 3 |
| 05 Tooling that proves itself — "We adopt new digital tooling as it proves itself, so the stack never stands still." | Generic (first sentence carried over from the earlier build) |

## 04 — For practices

| Text | Source |
|---|---|
| "Sending a case takes three steps." / "Scan the patient, send the case, book the delivery appointment. We handle the rest." | Case emails; "three" counts the page steps |
| 01 "Take an intraoral scan in your practice." 02 "Appliance, arch and any notes for the design." 03 "We fabricate the appliance and deliver it back to your practice for the scheduled delivery appointment." | Case emails; step 02 is an instruction |

## 05 — Sister practice

| Text | Source |
|---|---|
| "Built for the practices we work with, starting with our sister clinic." / "Maskatech Labs fabricates appliances for The Teeth Boutique in Chicago." | Case emails from the clinic to the lab; clinic signature (name, city) |
| "General dentistry · Chicago" | NPI taxonomy "Dentist, General Practice"; clinic address |
| "The Teeth Boutique" | Clinic signature (the owner's message spelled it "Teet Boutique"; the clinic itself writes "The Teeth Boutique") |
| "1933 W Irving Park Rd, Suite 1, Chicago, IL 60613" | Clinic signature; NPI registry |
| "(773) 857-2290" | Clinic signature (first of its two main lines; the NPI registry lists the second, 857-2280) |
| "theteethboutique.com" → https://www.theteethboutique.com | Clinic signature domain |

## 06 — Start a case

| Text | Source |
|---|---|
| "Send the case details below. The form opens a prefilled email in your mail app. Nothing is stored on this site." | Site mechanics (mailto form; no server, no third party) |
| "Or write directly — cases@maskatech.com" | Owner-confirm 1 |
| Select options | Owner-confirm 5 |
| Placeholder "Arch and anything the design should account for."; "Submitting opens your email app with the case details prefilled."; JS status "Opening your email app with the case details."; generated subject "New case — <appliance>" and body lines Name / Practice / Email / Appliance / Notes | Site mechanics |

## Footer

| Text | Source |
|---|---|
| "Digital dental laboratory. Night guards and clear retainers, digitally designed for the individual case and fabricated in-house." | As the meta description |
| "© 2026 Maskatech Labs" (year set by JS, static fallback 2026) | Lab name |
| "Serving Chicago practices" | Owner-confirm 4 |
| "Sister practice: The Teeth Boutique ↗", "maskatech.com" | Clinic signature; RDAP |
| Outlined "Maskatech" wordmark | Decorative, `aria-hidden` |

## 404.html

| Text | Source |
|---|---|
| "Page not found — Maskatech Labs"; "No layer at this address."; "The address may have been typed incorrectly, or the page has moved. Everything else is where it was." | Generic; no location |
| "cases@maskatech.com", "© 2026 Maskatech Labs", "maskatech.com" | Owner-confirm 1; lab name; RDAP |

## og.html (social card)

| Text | Source |
|---|---|
| "Digital dental laboratory"; "Built from the scan up."; "Night guards and clear retainers, digitally designed for the individual case and fabricated in-house."; Intake / Design / Fabrication cells; "maskatech.com" | As the hero and meta description |

## README.md

| Statement | Source |
|---|---|
| Business description, sister practice, canonical URL | As above |
| Domain status table (maskatech.com dates and registrar; maskatech.net; maskatechlabs.com not registered) | Verisign RDAP + GoDaddy lookup, 2026-09-18 |
| "As of 2026-09-18 it forwards (in a frame) to theteethboutique.com" | Direct HTTPS fetch of https://maskatech.com |
| GitHub Pages A / AAAA / CNAME values; "Enforce HTTPS can take up to 24 hours"; no CNAME file with GitHub Actions; custom 404 behaviour | GitHub Docs (cited in the README) |
| "the site works with JavaScript off"; "No third-party font requests"; "no build step"; "every asset path is relative" | Repo inspection and a JavaScript-disabled render (see the PR test plan) |

## Brand and company names in the repository

None is visible site copy and none is an equipment, software or material brand:

| Name(s) | Where | Why |
|---|---|---|
| "Syne", "Inter Tight", "Geist Mono" | `font-family` values in CSS, `og.html`, `logo.svg`; file names in `assets/fonts/`; licence texts | The three self-hosted typefaces (SIL Open Font License) |
| "Helvetica Neue", Helvetica, Arial, `system-ui`, SFMono-Regular, Menlo, Consolas, "Liberation Mono" | Fallback font stacks | System fonts named so text renders before or without the web fonts |
| Bonjour Monde / Syne authors, Sora, Undercase Type, rsms, Vercel | `assets/fonts/OFL-*.txt` | Upstream copyright lines reproduced verbatim as the OFL requires |
| GoDaddy, GitHub (Pages, Actions, Docs), Verisign, CMS NPI Registry, Python | `README.md`, this file | Registrar, hosting and verification sources; developer documentation, not site copy |
| Twitter, "Open Graph" | `index.html` `<head>` meta names, `og.html` title | Standard social-card meta names; not rendered |
| Safari | Code comment in `assets/js/main.js` | Explains a browser-compatibility branch |

## Deliberately absent

No turnaround times, case or doctor counts, accuracy percentages, certifications, equipment/software/material or resin
brands, pricing, warranties, testimonials, team names or bios, founding year, lab address or phone, any email other than
cases@maskatech.com, any clinic tagline, and no reference to maskatechlabs.com. "3D printed" appears only where it is
scoped to night guards. Decorative readouts describe the on-page animation only.
