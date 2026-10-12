# Redesign notes (October 2026)

Notes for reviewing the `redesign/academic-2026` branch. Nothing here is deployed until the branch is merged into `main`.

## What changed

- **Structure.** Navigation is About, Research, Teaching, Publications, Projects, CV and Contact. The homepage runs: introduction, the G.H.O.S.T. paper, Fall 2026 teaching, six selected publications, research themes, code and research artifacts, grants, mentoring, talks and service, about (biography, experience, education, outside work), contact. `/publications`, `/teaching` and `/cv` are full pages, each with a Ukrainian version under `/uk`.
- **Content model.** All content is in `src/data/` as typed data, separate from layout. `src/app/page.tsx` is no longer a 900-line file mixing content and UI.
- **Publications.** 34 entries: 5 journal articles, 26 conference papers, 1 preprint, the dissertation and 1 white paper. Author order, pages and DOIs were checked against Crossref on October 12, 2026. Crossref supplied four DOIs that the CV lacked (two IEEE Sensors 2022 papers, ELNANO 2020 and SMDS 2021). The JDIQ 2024 author order is Chuprov, Zatsarenko, Reznik and Khokhlov, as the publisher lists it.
- **Research.** Each theme states the question, method, outputs and status. G.H.O.S.T. is described as published research with simulation artifacts. The repository's limits are stated explicitly: modeled latency, no deployed network, no smart contract. Business email compromise is labeled as work in progress, with no venue or publication.
- **Projects.** AuthModuleLab is described as an educational example, with its teaching scope (salted SHA-256, JSON storage, in-memory sessions).
- **Design (second pass).** A dark "security console" look: deep navy background with a cyan-to-violet light scheme, glass panels, Unbounded for display type, IBM Plex Sans for text and JetBrains Mono for terminal details (all three cover Cyrillic). The hero is an interactive 3D network globe drawn on canvas: packets arc between nodes and flagged threats are intercepted with a red burst. The portrait sits in a holographic ID badge whose duotone tint "decrypts" to natural color on hover. Other motion: the name and section titles decode from glyphs, a typed research line cycles through topics, stats count up, sections reveal as you scroll, cards light up under the cursor and tilt, a keyword marquee, data rain behind the contact form and page headers, a scroll progress bar and cross-page view transitions. The entropy chart from the public G.H.O.S.T. results draws itself when it comes into view. Every animation stops for visitors who set "reduce motion", canvases pause when off screen, and all content is readable without JavaScript.
- **Accessibility.** Phone navigation with a menu button (Escape closes it and focus returns to the button), a skip link, visible focus, real links and buttons instead of clickable divs, labeled form fields, `aria-live` form status, and `<html lang>` that follows the page language. There are no modal dialogs any more.
- **Images.** The eight AI-generated decorative PNGs (about 55 MB) are removed. The portrait is now a 12 KB square crop for the hero plus a 45 KB version for metadata. A new dark social card (1200×630) shows the globe and badge.
- **Contact.** The email address is shown on every page. The form keeps the Gmail integration and recipient. It now validates length and format on the server, strips line breaks from header fields, encodes non-ASCII names, sets Reply-To, has a hidden honeypot field and a per-client rate limit (5 per 10 minutes), and returns generic errors instead of exception text. An empty submission still returns `400 {"error":"Missing fields"}`, as the smoke test expects.
- **Discovery.** Per-page titles and descriptions, canonical and `hreflang` alternates, Open Graph and Twitter cards, schema.org `Person` JSON-LD, `sitemap.xml` and `robots.txt`.
- **CV.** `public/Igor_Khokhlov_CV.pdf` is regenerated from the `/cv` page: 6 pages, no browser headers or local paths, and it includes the 2026 G.H.O.S.T. citation.
- **Unchanged.** `/terminal`, `/system-stats.json`, `/api/deployment`, the deployment workflow and scripts, `deploy/`, credential handling (`GOOGLE_AUTH_PATH`) and dependencies. The smoke test gained checks for the new pages and the Ukrainian language attribute.

## Decisions made without confirmation

Please review these. Each is easy to change in `src/data/`.

1. **Master's degree label.** Shown as "Master's degree, Electronic Systems (2007)" and "Bachelor's degree (2005)". The sources disagree between M.S. and M.A., and the SHU page reverses the years.
2. **Ukrainian title.** "Асистент-професор з кібербезпеки (Assistant Professor)" replaces "Доцент", so the rank is not misread.
3. **UKRAINE microgrid project.** Removed from the site. Its name, sponsor, dates and status could not be confirmed, and it should not be conflated with the CRDF Global grant.
4. **Citation metrics.** Omitted: no citation counts and no "over 30 publications" claim. Google Scholar is linked instead.
5. **Office room.** Omitted, because E-1055 and E-1066 conflict.
6. **Outstanding Student Paper Award** (WF-IoT 2020). Shown, based on the earlier public profile; please confirm.
7. **BrightTALK talk title.** Listed as "How AI Can Be Used to Enhance Your Cybersecurity" (January 2025). The brief's wording may include "Events" in the title.
8. **Service list.** Peer review and program committee service is not listed because venue names were not available. Library talks and media appearances are described generally.
9. **Grant dates** are shown as years (2022–2027, 2021–2022, 2020–2021). No funding amounts are shown.
10. **Owen Weissman example.** It describes his 2025 Academic Festival project as feeding into G.H.O.S.T. I found no public festival record to link, so it links only to the paper.
11. **Teaching methods.** The three short method notes on `/teaching` (build and analyze, controlled labs, evidence and explanation) are written from the teaching statement and the public authentication lab. Please check they match your courses.
12. **Earlier personal site.** Kept only as a link labeled "archived" in the profile list.
13. **Possible missing paper.** Crossref lists a 2021 Ukrainian-journal paper, "Protection of the microcontroller from reading" (doi:10.32838/2663-5941/2021.6/44), which is not in the CV. It is not added.

## Updating the CV PDF

The PDF is a print of `/cv`. After content changes, open `/cv` in Chrome, print to PDF on Letter paper with headers and footers off, and replace `public/Igor_Khokhlov_CV.pdf`.
