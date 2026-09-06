# CONTENT REVIEW — Maskatech Labs ("Obsidian Precision" build)

Every sentence on the site that could be read as a factual claim, with its source line in FACTS.md.
Line numbers refer to FACTS.md. "Generic" = marketing language with no checkable claim.

## Items the owner must confirm before launch

1. **cases@maskatech.com** (FACTS L14) — the mailbox (or forward) must exist. It appears in: nav-less
   header CTA target, Appliances note, For practices, Contact (visible link + form), Footer, 404, JSON-LD,
   and `assets/js/site-config.js` (`contactEmail`).
2. **"Chicago, IL"** (FACTS L15–16, owner inference) — printed in ONE place only: the footer bottom bar,
   sourced from `site-config.js` (`city`) with the same static text in `index.html`. To remove: delete the
   `city` value in `site-config.js` and the `<p class="mono" data-cfg="city">` line in the footer.
   Related: JSON-LD `"areaServed": "Chicago"` (required by BRIEF §SEO) — remove if not wanted.
   The clinic's own address (FACTS L31) also contains "Chicago"; that is the verified clinic address.
3. **og-image.png** — `og.html` must be screenshotted at 1200×630 and saved to `/assets/img/og-image.png`
   (referenced by the `og:image` / `twitter:image` tags).
4. **Clinic phone (773) 857-2290** (FACTS L32) is printed as the clinic's main line, as a `tel:` link.
5. The contact form is a `mailto:` form (no server, no third party). Submissions open the visitor's mail app.

## Head / metadata

| Text | Source |
|---|---|
| `<title>` "Maskatech Labs — Digital Dental Laboratory" | L8–9 |
| Meta description: "Maskatech Labs is a digital dental laboratory. From intraoral scan to finished appliance: night guards and clear retainers, digitally designed for the individual case." | L9, L20–21, L55–56 |
| OG/Twitter description: "Scan in. Appliance out. Night guards and clear retainers, digitally designed for the individual case." | L55, L20–21, L56 |
| Canonical / og:url / sitemap `https://maskatech.com/` | L11–12 |
| JSON-LD: name "Maskatech Labs", url, email cases@maskatech.com | L8, L11–12, L14 |
| JSON-LD description: "Digital dental laboratory fabricating custom oral appliances for dental practices." | L9 |
| JSON-LD `areaServed: "Chicago"` | BRIEF §SEO; inference L15–16 — **confirm** |
| site.webmanifest description: "Digital dental laboratory. Custom oral appliances for dental practices." | L9 |

## Hero

| Text | Source |
|---|---|
| "Digital dental laboratory · Custom oral appliances" | L9 |
| "Scan in. Appliance out." | L55 (verbatim) |
| "Maskatech Labs is a digital dental laboratory." | L9 |
| "Your practice sends an intraoral scan." | L22 |
| "We return a precision-fabricated appliance, digitally designed for the individual case." | L22–23, L47, L56 |
| Spec strip — "Intake: Intraoral scan from the practice" | L22 |
| Spec strip — "Design: Digital, for the individual case" | L56 |
| Spec strip — "Output: Night guards · Clear retainers" | L20–21 |
| HUD readouts "Mesh // Dental arch", "θ 000.0°", "Scan 62%", "Motion on/off", vertex-free | Decorative readouts of the canvas animation (rotation angle, scan-pass progress). Not business metrics. Marked `aria-hidden`. |
| Fallback image alt "Wireframe scan mesh of a dental arch" | Describes the illustration only |

## 01 / Workflow

| Text | Source |
|---|---|
| "From intraoral scan to finished appliance." | L55 (verbatim) |
| "One digital thread runs through every case, from the scan your practice takes to the appliance delivered back for the delivery appointment." | L22–23 |
| Scan — "The practice takes an intraoral scan of the patient and sends the case. The scan is the case." | L22 (second sentence restates the first) |
| Design — "The appliance is digitally designed on that scan, for the individual case and its prescription." | L56, L47 |
| Fabricate — "Precision-fabricated from the design. Digitally exact." | L47, L56 |
| Finish & inspect — "Hand-finished. Every case is inspected before it leaves the lab." | L56, L58 (verbatim) |
| Deliver — "The finished appliance is delivered back to the practice for the scheduled delivery appointment." | L22–23 |
| Glyph captions (aria-hidden SVG): "Intraoral scan", "Occlusal view", "Case design", "Per prescription", "Fabrication", "Digitally exact", "Hand-finished", "Inspected", "Lab", "Practice", "Delivered back", "Delivery appointment" | L22–23, L56, L58 |

## 02 / Appliances

| Text | Source |
|---|---|
| "Night guards and clear retainers, engineered to the scan." | L20–21, L56 |
| "Each appliance is designed on the patient's own scan and built for that case. Nothing is generic." | L56 (case-by-case design); second sentence restates it |
| Night guard — tag "Upper · Lower" | L20 |
| Night guard — "An occlusal guard covering the upper or lower arch, as prescribed." | L20 |
| Night guard — "Patients whose dentist prescribes an occlusal guard." | Generic (no claim about the lab) |
| Night guard — "Designed on the patient's own scan, so the fit is engineered to that arch rather than approximated." | L56 ("Engineered fit", "Digitally designed for the individual case") |
| Clear retainer — tag "Per arch, as prescribed" | L21 |
| Clear retainer — "A clear retainer, digitally designed on the scan." | L21, L47 |
| Clear retainer — "Patients whose dentist prescribes a clear retainer." | Generic |
| Clear retainer — "Designed to the scanned arch, case by case, so the retainer follows the arch as it is." | L56 |
| "Additional appliances by request — ask us about your case." | L24–25 (verbatim soft line) |

## 03 / Precision

| Text | Source |
|---|---|
| "Hand-finished. Digitally exact." | L56 (verbatim) |
| "Four rules govern how a case moves through the lab. They do not change from one case to the next." | Frames the four principles listed on the page (L56–59). "Four" counts page items, not a business metric. |
| "Engineered fit — Every appliance is designed on the patient's own scan and built to that geometry." | L56 |
| "Case-by-case design — Each appliance is designed for the individual case and its prescription." | L56 |
| "Inspected before it ships — Every case is inspected before it leaves the lab." | L58 (verbatim) |
| "Tooling that proves itself — We adopt new digital tooling as it proves itself." | L59 (verbatim) |

## 04 / For practices

| Text | Source |
|---|---|
| "Sending a case takes three steps." | Counts the three steps on the page (L22–23, BRIEF §6) |
| "Scan the patient, send the case with the prescription, and schedule the delivery appointment. We handle the rest." | L22–23; "We handle the rest" generic |
| "Scan the patient — Take an intraoral scan in your practice." | L22 |
| "Send the case with the prescription — Appliance, arch and any notes for the design." | L22, BRIEF §6 |
| "Receive it for the delivery appointment — We fabricate the appliance and deliver it back to your practice for the scheduled delivery appointment." | L22–23 |

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
| "Send the case details below. The form opens a prefilled email in your mail app. Nothing is stored on this site." | Describes site mechanics (mailto form, BRIEF §8) |
| "Or write directly — cases@maskatech.com" | L14 |
| Select options: Night guard – upper / Night guard – lower / Clear retainer / Other | BRIEF §8, L20–21 |
| Placeholder "Arch, prescription details, anything the design should account for." | Instruction, no claim |
| "Submitting opens your email app with the case details prefilled." / JS status "Opening your email app with the case details." | Site mechanics |

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
| "No page at this coordinate." / "The address may have been typed incorrectly, or the page has moved. The lab is still where it was." | Generic |
| "cases@maskatech.com", "© 2026 Maskatech Labs", "maskatech.com" | L14, L8, L11 |

## og.html (social card)

| Text | Source |
|---|---|
| "Digital dental laboratory" | L9 |
| "Scan in. Appliance out." | L55 |
| "Night guards and clear retainers, digitally designed for the individual case." | L20–21, L56 |
| "maskatech.com" | L11 |

## Deliberately absent (FORBIDDEN list, L41–52)

No turnaround times, case/doctor counts, founding year, certifications, equipment/software/material brands,
fabrication technology names, pricing, warranties, testimonials, team bios, lab address or phone, owner name,
or any email other than cases@maskatech.com. No product beyond night guards and clear retainers is listed;
other appliances appear only in the allowed soft line (L24–25).
