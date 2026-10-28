# Gilang Jecko — Portfolio Website Build Kit

Semua data untuk membangun website portofolio Gilang Jecko: struktur, alur tiap section, semua teks final, link, daftar gambar, dan design system.

**Last updated:** 15 Oct 2026

---

## 0. Isi paket ini

```
portfolio-build-kit/
├── README.md                  ← dokumen ini (sumber utama, paling lengkap)
├── content.json               ← data yang sama dalam format JSON (untuk developer / AI builder)
├── design-tokens.css          ← warna, gradient, font, radius, shadow
├── images/
│   ├── wireframe/
│   │   ├── desktop-fullpage.png   ← wireframe website, desktop 1440px
│   │   └── mobile-fullpage.png    ← wireframe website, mobile 390px
│   └── behance-slides/            ← 21 slide Behance (2800×1576), layout case study statis
└── reference/
    ├── wireframe-portfolio.html   ← wireframe website (HTML, bisa dibuka di browser)
    └── behance-portfolio.html     ← sumber slide Behance (HTML)
```

> **Penting:** semua gambar di paket ini adalah **wireframe dan placeholder**. File karya asli (mockup, screenshot website, desain grafis, foto diri, logo klien) belum pernah dikirim. Daftar gambar yang harus disiapkan ada di **Section 9**.

> Kalau teks di wireframe berbeda dengan dokumen ini, **pakai dokumen ini**. Dokumen ini sudah memuat semua revisi terakhir (daftar tools baru, negara klien, brand Milkyano, dan lain-lain).

---

## 1. Profil singkat

| Field | Isi |
|---|---|
| Nama | Gilang Jecko |
| Jabatan | Creative Director · UI/UX Designer · Brand & Graphic Designer |
| Lokasi | Indonesia |
| Mulai berkarier | 2020 (6+ tahun) |
| Jumlah brand | 20+ |
| Negara klien | Indonesia, Australia, United States, Canada |
| Pendidikan | SMK Salafiyah Syafiiyah — Teknik Komputer dan Jaringan (TKJ), 2019–2021 |

---

## 2. Sitemap

```
/                     Homepage (one page, scroll)
/work/continue-peptides   Case study — Story 01
/work/huggooling          Case study — Story 02
/work/paw-studio          Case study — Story 03
/work/supps247            Case study — Story 04
```

### Urutan section di homepage

```
Nav (sticky)
 → 01 Hero
 → 02 About                     (01) About
 → 03 Experience + Skills       (02) Experience
 → 04 Brands along the journey  (marquee logo)
 → 05 Selected Work             (03) Selected Work — Story 01–04
 → 06 Websites                  (04) Websites
 → 07 Graphics                  (05) Graphics
 → 08 Contact
 → Footer
```

### Alur pengunjung (user flow)

```
Landing (Hero)
  ├── klik "View selected work ↓"  → scroll ke Selected Work
  ├── klik "Get in touch" / "Let's talk" → scroll ke Contact
  └── scroll → About → Experience → Brands → Selected Work
                                                  │
                         klik kartu "Read case study →"
                                                  ↓
                               Halaman case study (Story 0X)
                                 ├── "← Back to work" → kembali ke Selected Work
                                 └── "Next project →"  → case study berikutnya
                                                  │
  Websites: kartu "Live ↗" → buka website di tab baru
            kartu "Figma design" → buka gambar besar (lightbox)
  Graphics: filter kategori → klik gambar → lightbox
  Contact:  WhatsApp / Instagram / LinkedIn / Email → buka di tab baru
```

---

## 3. Design system

Detail lengkap di `design-tokens.css`.

**Konsep:** latar hitam yang bergradasi ke abu (kesan 3D), aksen putih dan pink. **Tidak ada warna solid**, setiap elemen memakai gradient.

| Token | Nilai | Dipakai untuk |
|---|---|---|
| Background | radial gradient `#2b2b30 → #121214 → #060607` dari atas | latar halaman |
| Card | linear 145° `#34343a → #1c1c20 → #0c0c0e` + highlight tepi atas + drop shadow | semua kartu |
| Card light | linear 145° `#ffffff → #e9e9ec → #c9c9cf` | 1 kartu statistik (variasi) |
| Pink | linear 135° `#ffd1ea → #ff8fcb → #e0479e` | tombol utama, kata italic, titik label, 1 kartu statistik |
| Text white | linear 180° `#ffffff → #b9b9c0` (text-clip) | semua judul |
| Text grey | `#9a9aa3` | teks pendukung, label |
| Glow orb | radial pink, blur 60–70px, opacity 0.35–0.5 | pojok hero, belakang Contact |

**Tipografi**
- **Space Grotesk** (400/500/600): semua teks dan judul
- **Instrument Serif Italic**: hanya untuk 1–2 kata aksen per judul, selalu dengan gradient pink (contoh: *journey*, *brands*, *stories*, *designed*, *playground*, *together*)
- Nama di hero: Space Grotesk 600, sangat besar (clamp 68–240px), letter-spacing −0.05em

**Elemen berulang**
- **Label section:** titik pink bercahaya + teks kecil uppercase, contoh `(01) ABOUT`
- **Pill / chip:** kapsul dengan gradient transparan + garis tepi tipis
- **Radius:** kartu 22px, placeholder gambar 16px, tombol/pill 999px

**Referensi gaya (Behance)**
- Tampilan dasar (bento grid, tipografi besar, label bernomor): [COGNIX — AI Education Website](https://www.behance.net/gallery/256133963/COGNIX-AI-Education-Website-design-Brand-Identity)
- Suasana (modern, glow): [Lyra AI — AI SaaS Landing Page](https://www.behance.net/gallery/255647215/Lyra-AI-AI-SaaS-Landing-Page)
- Struktur dan copy, bukan layout: [Portfolio — Nindia Rosdiana](https://www.behance.net/gallery/125905573/Portfolio)

---

## 4. Homepage — teks dan alur per section

### Nav (sticky, kapsul melayang)
- Kiri: **Gilang Jecko** (logo teks)
- Tengah: About · Experience · Work · Websites · Graphics (anchor link, disembunyikan di mobile)
- Kanan: tombol pink **Let's talk** → scroll ke Contact

---

### 01 · Hero
**Alur:** kesan pertama → nama besar → tagline → 2 tombol → 4 statistik.

- Pill: `● Available for freelance & full-time — 2026`
- Nama: **GILANG / JECKO** (2 baris)
- Tagline: *Creative Director, UI/UX & Brand Designer, designing brands from* ***first sketch*** *to final screen.* ("first sketch" = serif italic pink)
- Tombol: **View selected work ↓** (pink) · **Get in touch** (ghost)
- Visual kanan: foto diri / showreel (placeholder)
- Statistik (4 kartu bento):

| # | Angka | Label | Gaya kartu |
|---|---|---|---|
| (01) | 6+ | Years in design | gelap, angka gradient putih |
| (02) | 20+ | Brands worked with | pink |
| (03) | 300+ | Pets illustrated | putih/light |
| (04) | 15 | UI/UX projects | gelap, angka gradient pink |

Alternatif tagline:
- *Designing brands that look good and work even better.*
- *From brand identity to digital product: one designer, the whole picture.*

---

### 02 · About — `(01) About`
**Alur:** judul bercerita (dengan foto kecil di tengah kalimat) → paragraf.

- Judul: **The** *journey* / ~~behind~~ [foto] **the** *brands*
  ("behind" = huruf outline, "journey" dan "brands" = serif italic pink, [foto] = foto kecil inline)
- Pill kiri: `Based in Indonesia`
- Paragraf:

> Hi, I'm Gilang Jecko, a multidisciplinary designer based in Indonesia. I've worked in graphic design since 2020, across branding, social media, illustration, and UI/UX for agencies, studios, and international brands.
>
> I don't stop at the visuals. I've also managed social media, run a store, and handled operations, so I understand how design affects real business results. Today I lead creative direction, design digital products, and use AI tools to work faster and explore more ideas.

---

### 03 · Experience + Skills — `(02) Experience`
**Alur:** judul → kiri kartu Skills → kanan daftar pekerjaan (list rapat, bukan kartu per item).

- Judul: **Working** *experience*

**Kartu kiri — Skills**
- **Design Tools:** Adobe Photoshop, Adobe Illustrator, Adobe Lightroom, Figma, CapCut, Canva
- **AI Tools** *(opsional — di CV sudah dihapus, di website boleh tetap tampil)*: Claude, Higgsfield
- **Expertise:** UI/UX Design, Branding, Graphic Design, Illustration, Creative Direction, Social Media
- **Soft skills:** Communication, Collaboration, Time Management, Problem Solving, Adaptability

**Daftar kanan — Experience** (logo kecil · tahun · perusahaan · jabatan · tag Freelance)

| Tahun | Perusahaan | Jabatan | Tag |
|---|---|---|---|
| 2026 | Milkyano | Creative Director · UI/UX Designer | |
| 2026 | Continue Peptides | UI/UX Designer · Graphic Designer | Freelance |
| 2026 | FA Wear | UI/UX Designer · Brand Designer | Freelance |
| 2025 | Supps247 | UI/UX Designer | Freelance |
| 2025 | Licensed Baddie | Graphic Designer · Branding Design | Freelance |
| 2025 | Hush Chocolate | Graphic Designer | Freelance |
| 2023–25 | PAW Studio | Social Media Manager · Fullstack Graphic Designer · Store Manager · Illustrator · Admin | |
| 2022 | Elkiya Digital Agency | Social Media Manager · UI/UX Designer · Fullstack Graphic Designer | |

> Opsional: tiap baris bisa diklik untuk membuka detail. Detail lengkapnya ada di **Section 8**.

---

### 04 · Brands along the journey
**Alur:** judul tengah → deretan logo bergerak otomatis (marquee, loop tanpa henti, fade di kiri-kanan).

- Judul: **The** *brands* **along the journey**
- Logo (urutan bebas):

PAW Studio · Elkiya · Licensed Baddie · Ammache · Pixel and Profits · Supps247 · Continue Peptides · Karyabumi · FA Wear · Steroids · Iilumo · CarFinder · HugGooling · Milkysil · SNM · MKP Bikes · UBuildTinyHomes · Milkyano · Hush Chocolate · Aspire Academics · Mr Sparkle

---

### 05 · Selected Work — `(03) Selected Work`
**Alur:** judul → 4 kartu besar bergantian kiri-kanan (info | gambar, lalu gambar | info) → klik → halaman case study.

- Judul: **Selected** *stories*
- Sub: *Four brands I shaped end to end, from identity to digital product.*

| Story | Brand | Tagline kartu | [Year] | [Scope] | [Deliverables] |
|---|---|---|---|---|---|
| 01 | Continue Peptides | A premium peptide brand built to earn trust from day one. | 2026 | UI/UX · Graphic | Website · Thumbnails · Ads · Posts |
| 02 | HugGooling | Introducing the gooling, a pillow Indonesians grow up with, to Australia. | 2026 | Creative Direction · UI/UX · Brand | Mascot · Website · Packaging · Ads |
| 03 | PAW Studio | Turning beloved pets into art that lasts forever. | 2023–25 | Illustration · UI/UX · Social | 300+ Illustrations · Website · Ads |
| 04 | Supps247 | Affordable supplements that never look or feel cheap. | 2025 | UI/UX · Graphic | Website · Ads · Social · Email |

Tombol tiap kartu: **Read case study →**

---

### 06 · Websites — `(04) Websites`
**Alur:** judul → grid 3 kolom (2 di tablet, 1 di mobile) → "Live ↗" buka tab baru, "Figma design" buka lightbox.

- Judul: **Websites I've** *designed*
- Sub: *Live sites open in a new tab. Others are shown from the original Figma designs.*
- Brand dengan case study (Continue Peptides, HugGooling, PAW Studio, Supps247) **tidak diulang** di sini.

| # | Brand | Link | Status | Catatan |
|---|---|---|---|---|
| 1 | FA Wear | [fa-wear.com](http://fa-wear.com/) | Live ↗ | |
| 2 | Milkysil | [milkysil.com](https://www.milkysil.com/) | Live ↗ | via Milkyano |
| 3 | SNM | [snmclub.com.au](https://www.snmclub.com.au/) | Live ↗ | via Milkyano |
| 4 | Steroids | [steroidsdigital.com.au](https://www.steroidsdigital.com.au/) | Live ↗ | via Milkyano |
| 5 | CarFinder | [carfinderplus.com.au](https://www.carfinderplus.com.au/) | Live ↗ | |
| 6 | Pixel and Profits | [pixelandprofits.com](https://pixelandprofits.com/) | Live ↗ | |
| 7 | Ammache | [ammache.vercel.app](https://ammache.vercel.app/) | Live ↗ | domain Vercel; beri label "Concept" kalau belum punya domain sendiri |
| 8 | Iilumo | — | Figma design | belum launch; boleh diberi label "Coming soon" |
| 9 | Elkiya | — | Figma design | website sudah di-redesign pihak lain, pakai screenshot Figma sendiri |

*Belum terisi: tahun dan jenis website (e-commerce / landing page / company profile) untuk tiap brand.*

---

### 07 · Graphics — `(05) Graphics`
**Alur:** judul → filter kategori → grid masonry → klik gambar → lightbox.

- Judul: **Graphic** *playground*
- Filter: All · Social Media · Ads · Packaging · Illustration · Branding
- Brand yang punya karya graphic design:

Licensed Baddie · Continue Peptides · Supps247 · MKP Bikes · FA Wear · Elkiya · UBuildTinyHomes · Milkyano · Steroids · HugGooling · Iilumo · PAW Studio · Hush Chocolate

---

### 08 · Contact
**Alur:** kartu besar di tengah dengan glow pink di belakang → judul → kalimat ajakan → tombol kontak.

- Label: `● CONTACT`
- Judul: **Let's work** / *together*
- Teks: *Have a project in mind? I'm open to freelance and full-time opportunities.*
- Tombol:

| Kanal | Teks tombol | Link |
|---|---|---|
| WhatsApp (pink) | WhatsApp ↗ | https://wa.me/62895360086569 |
| Instagram | Instagram ↗ | https://instagram.com/gilangjecko |
| LinkedIn | LinkedIn ↗ | *URL belum ada — profil atas nama "Gilang Jacko"* |
| Email | Email ↗ | mailto:gilangjeko@gmail.com |

### Footer
- Kiri: `© 2026 Gilang Jecko`
- Kanan: `Back to top ↑`

---

## 5. Template halaman case study

Satu template dipakai untuk keempat case study.

```
← Back to work                                   GILANG JECKO
───────────────────────────────────────────────────────────
COVER         Story 0X · Nama brand (besar) · tagline
              Gambar utama full width
PROJECT INFO  Client · Industry · Year · My Role · Tools · Deliverables · Website
OVERVIEW      2–3 kalimat tentang brand
THE CHALLENGE 2–3 tantangan (kartu bernomor)
THE PROCESS   4–7 langkah (kartu bernomor 01–0X)
THE SOLUTION  Galeri: website desktop (besar) + mobile + aset (ads, social, packaging)
OUTCOME       hasil + tombol "Visit website ↗" (kalau live)
NEXT PROJECT  "Next project → Nama brand"
```

Urutan "Next project": Continue Peptides → HugGooling → PAW Studio → Supps247 → Continue Peptides.

---

## 6. Isi lengkap 4 case study

### Story 01 — Continue Peptides
**A premium peptide brand built to earn trust from day one.**

| | |
|---|---|
| Client | Continue Peptides |
| Industry | Peptides / Health & Supplement |
| Year | 2026 |
| My Role | UI/UX Designer, Graphic Designer |
| Tools | Figma, Photoshop, Claude, Higgsfield (Image & Video Generation) |
| Deliverables | Website, Product Thumbnails, Static Ads, Social Media Posts |
| Website | **Jangan pasang link.** Website sudah di-redesign oleh designer lain, jadi tampilkan screenshot dari file Figma sendiri |

**Overview**
Continue Peptides sells peptides to affluent, health-focused people who care about their wellbeing but rarely have time to visit a clinic. The brand brings clinic-level health solutions to their doorstep, and its design has to look as premium as its audience expects.

**The Challenge**
1. **Make a new brand feel established.** The brand had to feel premium but still fresh, and appeal to a wide audience without feeling cold or clinical. It also had to earn customer trust even though it had no track record yet.
2. **Get ads approved in a restricted category.** Peptides are a sensitive category on ad platforms. Ads were often rejected, and sometimes the ad account was restricted too, even though nothing was wrong with the product itself. I had to design ads that meet platform advertising policies while still selling the product.

**The Process**
1. **Competitor Research** — I analyzed peptide, supplement, and premium wellness brands to see how they build trust and to find ways Continue Peptides could stand out.
2. **Visual Direction** — I defined the color palette, typography, and imagery style. The goal was a look that feels premium and clean, but more approachable than a typical clinical brand.
3. **Wireframe & Website Design in Figma** — I mapped the user journey from landing to checkout, built wireframes, then designed the final website with a focus on clarity and trust.
4. **Ad Policy Research** — I studied the platforms' advertising guidelines and adjusted the visual and copy approach so the ads could pass review without losing their selling power.

**The Solution**
- **Website:** a clean, premium storefront designed so busy, high-end customers can understand and buy products quickly
- **Product thumbnails:** consistent, high-end product visuals across the catalog
- **Static ads & posts:** policy-compliant creatives that keep the premium brand look while passing ad review

**Outcome**
I delivered the full website design and ad creative system for the brand's launch phase in 2026, which gave Continue Peptides a professional, trusted presence from day one.

---

### Story 02 — HugGooling
**Introducing the gooling, a pillow Indonesians grow up with, to Australia.**

| | |
|---|---|
| Client | HugGooling (via Milkyano) |
| Industry | Home & Sleep / Body Pillow |
| Year | 2026 |
| My Role | Creative Director, UI/UX Designer, Graphic Designer, Illustrator |
| Tools | Figma, Photoshop, Higgsfield |
| Deliverables | Brand Mascot, Website, Product Photography, Ads, Social Media Design, Packaging |
| Website | [huggooling.com](https://huggooling.com) — Live, masih memakai desain sendiri |

**Overview**
HugGooling brings the *guling* (gooling), the hug pillow that's part of everyday sleep in Indonesia, to the Australian market. For most Australians this is a new product, so the brand had to explain what it is and also make them want one.

**The Challenge**
1. **Introduce an unfamiliar product.** Most Australians had never heard of a gooling. The design had to explain what it is, how it's used, and why it's worth having, quickly and without confusion.
2. **Earn trust for something new.** People are cautious about products they don't know. The brand had to feel credible and comfortable from the first impression.
3. **Make it lovable.** The brand needed a cute, warm personality that makes people smile and want to hug the product.

**The Process**
1. **Market & Audience Research** — I looked at how Australians shop for sleep and home products, and at how existing body pillow brands present themselves, to find the right tone for introducing the gooling.
2. **Creative & Visual Direction** — I set the brand's personality: cute, soft, and warm. I defined the color palette, typography, and visual style so every touchpoint feels like the same friendly brand.
3. **Mascot Design** — I created the HugGooling mascot to give the brand a face. It makes an unfamiliar product feel friendly and easy to remember, and it appears across the website, packaging, and social media.
4. **AI-Enhanced Product Photography** — Using real product photos as the base, I improved the angles and lighting with Higgsfield. The product looks its best while staying true to what customers actually receive, which matters for trust.
5. **Education-First Website Design** — I designed the website in Figma so it introduces the product before it sells it. The layout explains what a gooling is, how to use it, and why it helps you sleep better. Clear material information and high-quality product visuals sit throughout the page to build trust.
6. **Packaging Design** — I designed packaging that features the mascot, turning the unboxing into a memorable moment that customers want to share.
7. **Ads & Social Media** — I created ads and social content, led by the mascot, that introduce the product in a simple, eye-catching way and make people stop scrolling and get curious.

**The Solution**
- **Mascot:** a cute character that gives the brand its personality
- **Website:** a friendly, educational storefront that turns "what is this?" into "I need this"
- **Product photography:** realistic, AI-enhanced visuals that present the product at its best
- **Packaging:** cute, giftable packaging featuring the mascot
- **Ads & social media:** a consistent set of creatives that introduces the gooling to a new audience

**Outcome**
I led the creative direction and built the full brand experience, from the mascot to the website and packaging, to launch HugGooling in the Australian market. The website is live at huggooling.com.

*Catatan visual: tampilkan maskot sebesar mungkin, misalnya di cover. Kalau ada, sertakan sketsa awal maskot.*

---

### Story 03 — PAW Studio
**Turning beloved pets into art that lasts forever.**

| | |
|---|---|
| Client | PAW Studio |
| Industry | Custom Pet Illustration & Prints |
| Year | 2023 – 2025 |
| My Role | Illustrator, Fullstack Graphic Designer, UI/UX Designer, Social Media Manager, Store Manager |
| Tools | Photoshop, Figma |
| Deliverables | Custom Pet Illustrations, Website, Ads, Social Media Design |
| Website | [pawstudio.co.id](https://pawstudio.co.id) — Live, masih memakai desain sendiri |

**Overview**
PAW Studio creates custom illustrations of people's pets and turns them into printed keepsakes. Its customers love their animals and want a way to remember them forever. Over two years I worked across almost every part of the brand: illustrating customer pets, designing the website and content, managing social media, and running the store.

**The Challenge**
1. **Prove we can capture *their* pet.** Every pet is unique to its owner. Customers needed to believe we could draw their pet accurately, down to its markings, expression, and personality, before they ordered.
2. **Build a trusted pet illustration brand.** Custom orders need trust, because customers pay before they see the result. The brand had to feel reliable, professional, and caring.
3. **Turn emotion into sales.** The product is emotional. The challenge was to communicate that feeling across the website, ads, and social media in a way that leads to orders.

**The Process**
1. **Hand-Illustrated, 1:1 Accuracy** — I drew every illustration by hand in Photoshop, with no AI. I focused on 1:1 accuracy: fur patterns, eye color, and facial expressions, so each portrait looks exactly like the owner's pet.
2. **Before & After as Proof** — I used side-by-side comparisons of the original pet photos and the finished illustrations as the brand's main source of trust. Customers could see the accuracy for themselves before ordering.
3. **Website Design** — I designed the website in Figma to show the illustration gallery, explain the ordering process clearly, and make it easy for customers to send their pet photos and place an order.
4. **Social Media & Ads** — I managed social media and created content and ads that highlight the bond between owners and their pets. Every finished illustration also became new content.
5. **Store Management** — As Store Manager I handled the customer side: communicating with customers, managing orders, and making sure each client felt cared for from the first message to delivery.

**The Solution**
- **Custom illustrations:** accurate, hand-drawn pet portraits that customers keep forever
- **Before & after content:** proof-driven visuals that build trust instantly
- **Website:** a gallery-led storefront with a clear and simple ordering flow
- **Customer experience:** personal communication from order to delivery

**Outcome**
- **300+ pets illustrated** by hand over two years
- Built PAW Studio into a trusted pet illustration brand, with the website live at pawstudio.co.id

*Catatan visual: jadikan before/after tampilan utama. Pilih 3–4 hewan terbaik, foto asli berdampingan dengan ilustrasinya.*

---

### Story 04 — Supps247
**Affordable supplements that never look or feel cheap.**

| | |
|---|---|
| Client | Supps247 |
| Industry | Sports & Health Supplements |
| Year | 2025 |
| My Role | UI/UX Designer, Graphic Designer |
| Tools | Figma, Photoshop, Higgsfield |
| Deliverables | Website Design, Social Media Design, Ads, Email Marketing |
| Website | [supps247.com.au](https://supps247.com.au) — Live, tapi sebagian aset sudah diganti klien. Pakai screenshot Figma sendiri sebagai visual utama, link live sebagai referensi tambahan |

**Overview**
Supps247 is an Australian online supplement store that offers quality products at affordable prices. Its customers are gym-goers, athletes, and everyday health-conscious Australians who want supplements that work without overpaying for them.

**The Challenge**
1. **Affordable, not cheap.** Low prices can make people doubt quality. The design had to communicate value for money while keeping the brand credible, so customers feel they're making a smart purchase.
2. **Stand out in a crowded market.** The Australian supplement market is full of big brands and discount stores. Supps247 needed a clear identity that customers could recognize and trust.
3. **Make shopping easy.** With a large product range, customers needed to find what they wanted quickly, compare products, and check out without friction.

**The Process**
1. **Competitor Research** — I studied other Australian supplement retailers to understand how they present pricing, promotions, and product information, and found gaps where Supps247 could do better.
2. **Visual Direction** — I defined a bold, energetic look that fits the fitness audience, with a clean structure and consistent product presentation so the brand feels professional, not discount.
3. **Website Design in Figma** — I designed the shopping experience around clear navigation, easy-to-scan product pages, visible pricing and deals, and a smooth path to checkout.
4. **Ads & Social Media** — I created ads and social content that highlight deals and product benefits, built to grab attention and drive traffic to the store.
5. **Email Marketing** — I designed email campaigns for promotions, new products, and returning customers that keep the brand top of mind and bring shoppers back.

**The Solution**
- **Website:** a clean, easy-to-shop storefront where value and quality go together
- **Ads & social media:** bold, deal-focused creatives that fit the fitness audience
- **Email marketing:** on-brand email designs that drive repeat purchases

**Outcome**
I designed Supps247's full digital presence, from website to ads and email, which gave the brand a consistent and trustworthy look across every customer touchpoint. The website is live at supps247.com.au.

---

## 7. Daftar lengkap project

### UI/UX
PAW Studio · Elkiya · Licensed Baddie · Ammache · Pixel and Profits · Supps247 · Continue Peptides · Karyabumi · FA Wear · Steroids · Iilumo · CarFinder · HugGooling · Milkysil · SNM

### Graphic design
Licensed Baddie · Continue Peptides · Supps247 · MKP Bikes · FA Wear · Elkiya · UBuildTinyHomes · Milkyano · Steroids · HugGooling · Iilumo · PAW Studio

### Klien Milkyano
HugGooling · Milkysil · SNM · Steroids · Iilumo · MKP Bikes · Aspire Academics · Mr Sparkle

---

## 8. Detail pengalaman kerja (versi panjang, sama dengan CV)

Bisa dipakai untuk expand/accordion di section Experience, atau halaman About terpisah.

**Creative Director & UI/UX Designer** | Milkyano | 2026
- Lead creative direction for client brands including HugGooling, Milkysil, SNM, Steroids, Iilumo, MKP Bikes, Aspire Academics, and Mr Sparkle.
- Communicate regularly with Milkyano's clients to understand their needs, present design directions, and handle feedback and revisions.
- Translate client needs into creative direction for banners, social media content, and ads.
- Research each client's market, competitors, and audience, and independently build creative frameworks to guide every design decision.
- Define each brand's visual direction (color palette, typography, imagery style, and tone) and keep it consistent across websites, ads, social media, and packaging.
- Design website UI/UX in Figma, from user flows and wireframes to final desktop and mobile screens, for Milkysil (milkysil.com), SNM (snmclub.com.au), Steroids (steroidsdigital.com.au), and Iilumo.
- Produce graphic design assets for client brands, including ads, social media content, and brand visuals for MKP Bikes, Steroids, and Iilumo.

**UI/UX Designer & Graphic Designer (Freelance)** | Continue Peptides | 2026
- Designed the website for a premium peptide brand targeting busy, health-focused, high-income customers.
- Researched competitors in the peptide, supplement, and wellness market and defined a visual direction that feels premium, clean, and approachable.
- Mapped the user journey from landing page to checkout, then built wireframes and the final website design in Figma.
- Produced product thumbnails, static ads, and social media posts using Photoshop and AI tools (Higgsfield image and video generation, Claude).
- Studied ad platform policies and adjusted visuals and copy so ads could pass review in a restricted product category.

**UI/UX Designer & Brand Designer (Freelance)** | FA Wear | 2026
- Developed the brand identity and visual direction for a fashion brand.
- Designed the website UI/UX (fa-wear.com) in Figma, from page structure to final screens.
- Created graphic design assets for the brand's marketing and social media.

**UI/UX Designer (Freelance)** | Supps247 | 2025
- Designed the e-commerce website for an Australian supplement store (supps247.com.au), with clear navigation, easy-to-scan product pages, visible pricing and deals, and a smooth checkout flow.
- Researched Australian supplement retailers to find gaps in how competitors present pricing, promotions, and product information.
- Defined a bold, energetic visual direction for a fitness audience that presents affordable products as high quality and trustworthy.
- Designed ads and social media content highlighting deals and product benefits to drive traffic to the store.
- Designed email marketing campaigns for promotions, new product launches, and returning customers.

**Graphic Designer & Branding Designer (Freelance)** | Licensed Baddie | 2025
- Developed branding and visual identity assets for the brand.
- Designed graphic content for marketing and social media.
- Designed the website UI/UX for the brand.

**Graphic Designer (Freelance)** | Hush Chocolate | 2025
- Designed graphic assets for the brand's marketing and social media.

**Social Media Manager, Graphic Designer, Illustrator & Store Manager** | PAW Studio | 2023 – 2025
- Hand-illustrated 300+ custom pet portraits in Photoshop, matching each pet's fur pattern, eye color, and expression 1:1 to customer photos.
- Designed the brand website (pawstudio.co.id) in Figma with an illustration gallery, a clear ordering process, and an easy way for customers to send pet photos.
- Managed social media accounts: planned and created content, and turned finished illustrations into posts.
- Designed ads and social content built on before-and-after comparisons (original photo vs. illustration) to prove accuracy and build trust before purchase.
- Managed the store: handled customer communication, took and tracked orders, and followed up on delivery.
- Handled administrative tasks for daily studio operations.

**Social Media Manager, UI/UX Designer & Graphic Designer** | Elkiya Digital Agency | 2022
- Managed social media accounts and created content for the agency and its clients.
- Designed website UI/UX for the agency and its clients.
- Designed graphic assets such as social media posts and promotional materials.

---

## 9. Daftar gambar yang harus disiapkan

Belum ada satu pun file karya asli di paket ini. Ini yang dibutuhkan, beserta ukuran yang disarankan.

| Section | Gambar | Jumlah | Ukuran disarankan | Catatan |
|---|---|---|---|---|
| Hero | Foto diri / showreel | 1 | 1200×1000 | |
| About | Foto kecil inline di judul | 1 | 300×220 | boleh crop dari foto hero |
| Experience | Logo perusahaan | 8 | 112×112, PNG transparan | Milkyano, Continue Peptides, FA Wear, Supps247, Licensed Baddie, Hush Chocolate, PAW Studio, Elkiya |
| Brands | Logo brand (putih/monokrom) | 21 | tinggi 80, PNG/SVG transparan | lihat daftar di Section 4 |
| Selected Work | Cover mockup per case study | 4 | 1600×1100 | |
| Case study | Screen website desktop | 2–4 per story | 1440 lebar | Continue Peptides & Supps247: dari Figma sendiri |
| Case study | Screen website mobile | 1–2 per story | 390 lebar | |
| Case study | Aset (ads, social, packaging) | 3–6 per story | bebas | |
| Case study HugGooling | Maskot + sketsa awal | 2+ | bebas | maskot sebagai cover |
| Case study PAW Studio | Before/after (foto asli + ilustrasi) | 3–4 pasang | 1:1 | |
| Websites | Thumbnail website | 9 | 1200×800 | Iilumo & Elkiya dari Figma |
| Graphics | Karya grafis | 12+ | bebas (masonry) | beri kategori: Social Media / Ads / Packaging / Illustration / Branding |

---

## 10. Yang masih kosong

- [ ] URL LinkedIn (nama profil: Gilang Jacko)
- [ ] Link Behance (setelah portofolio di-upload)
- [ ] Tahun dan jenis website untuk: Milkysil, SNM, Steroids, CarFinder, Pixel and Profits, Ammache, Iilumo, Elkiya, FA Wear
- [ ] Ammache: punya domain sendiri, atau diberi label "Concept"?
- [ ] Detail pekerjaan untuk Aspire Academics dan Mr Sparkle (saat ini hanya disebut sebagai klien Milkyano)
- [ ] Semua gambar di Section 9

---

## 11. Aset terkait lain (di folder Documents)

- `CV-Gilang-Jecko-ATS.pdf` / `.docx` — CV ATS bahasa Inggris
- `CV-Gilang-Jecko-ID.pdf` — CV ATS bahasa Indonesia
- `behance-slides.zip` — 21 slide Behance (sama dengan `images/behance-slides/`)
- `portfolio-gilang-jecko.md` — teks portofolio versi awal (sudah digantikan dokumen ini)
