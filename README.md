# Sentob Turizm Qishlog'i — Web Platformasi

Navoiy viloyati, Nurota tumanidagi Sentob turizm qishlog'i uchun premium darajadagi turizm veb-sayti.

## Texnologiyalar

- Next.js 16 (App Router, Turbopack, Server Actions)
- React 19 + TypeScript (strict)
- Tailwind CSS v4
- Framer Motion, Lucide Icons
- Supabase (PostgreSQL, Auth, RLS)
- Zod, React Hook Form
- Zustand, @tanstack/react-query (o'rnatilgan — kelgusi client-side interaktiv holatlar uchun; hozirgi ma'lumot oqimi asosan Server Components + Server Actions orqali, bu Next.js App Router uchun tavsiya etilgan yondashuv)

Shadcn UI o'rniga o'zimiz yozgan minimal, dizaynga moslashtirilgan komponent kutubxonasi (`components/ui`) ishlatildi — bu premium, o'ziga xos ko'rinishni saqlab qolish uchun.

## Loyihani ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda oching: http://localhost:3000

## Production build

```bash
npm run build
npm start
```

## Loyiha tuzilishi

```
app/
  layout.tsx        — root layout, metadata, LanguageProvider
  page.tsx           — bosh sahifa
  robots.ts           — SEO robots.txt
  sitemap.ts          — SEO sitemap.xml
  globals.css        — dizayn tokenlari (rang, shrift)
components/
  layout/            — Header, Footer, LanguageSwitcher
  home/               — Hero, About, Attractions, Experiences, GuestHousesPreview, MapPreview
  ui/                 — Button, Reveal (scroll animatsiyasi), SocialIcon
  JsonLd.tsx          — Schema.org strukturaviy ma'lumot
lib/
  i18n/               — UZ/RU/EN lug'atlar va LanguageProvider (reload'siz til almashtirish)
  utils.ts            — cn() klass birlashtiruvchi
```

## Milestone holati

- [x] **Milestone 1** — Loyiha scaffold, dizayn tizimi, i18n (UZ/RU/EN, reload'siz), Header/Footer, to'liq Bosh sahifa (Hero, About, Attractions, Experiences, Guest Houses preview, Map preview), scroll animatsiyalari (Framer Motion, pastdan asta-sekin chiqish), asosiy SEO (metadata, robots, sitemap, JSON-LD).
- [x] **Milestone 2** — Supabase ulanishi (SQL sxema, RLS, overlap-booking himoyasi), `/guest-houses` va `/guest-houses/[slug]` sahifalari, to'liq Booking oqimi (Check In/Out, Guests, Rooms, jonli Price Calculator, server-side narx qayta hisoblash, Idempotency-Key, admin tasdiqlashi uchun `pending` status).
- [x] **Milestone 3** — Gallery (`/gallery`: masonry + kategoriya filter + lightbox), 360° Virtual Tour (`/360-tour`: drag-to-pan custom viewer, YouTube emas), Events (`/events`: kalendar view + ro'yxat, `/events/[slug]`), Blog (`/blog`, `/blog/[slug]`: to'liq SEO metadata + JSON-LD Article), Reviews (Google/Tripadvisor/Local manbalar, 5-yulduzli reyting, bosh sahifada).
- [x] **Milestone 4** — Admin panel (`/admin`): Supabase Auth login, rol boshqaruvi (Admin/Manager/User — har so'rovda DB'dan qayta tekshiriladi), Dashboard statistikasi, Bookings tasdiqlash/bekor qilish, Guest Houses/Gallery/Events/Blog/Reviews uchun to'liq CRUD, Users rol boshqaruvi, Settings (aloqa ma'lumotlari), Media Manager, Analytics (bandlar statistikasi).
- [x] **Milestone 5** — OpenWeather integratsiyasi (Bugungi/3 kunlik/7 kunlik), PWA (manifest, ikonalar, offline service worker), Dark/Light Mode (localStorage + tizim afzalligi, FOUC'siz), to'liq SEO audit (haqiqiy OG/Twitter Card rasmi, JSON-LD, `icons`/`manifest` metadata), Vercel deployment konfiguratsiyasi (xavfsizlik headerlari).

Loyiha production-ready holatda — barcha 5 milestone yakunlangan. Quyida loyihani ishga tushirish va deploy qilish bo'yicha to'liq yo'riqnoma.

## Milestone 2'ni ishga tushirish

1. [supabase.com](https://supabase.com)da yangi loyiha yarating.
2. SQL Editor'da `supabase/schema.sql` faylini to'liq ishga tushiring (jadvallar, RLS, seed data avtomatik yaratiladi).
3. `.env.example`dan nusxa olib `.env.local` yarating, quyidagilarni to'ldiring:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase loyiha sozlamalaridan (Settings → API).
   - `SUPABASE_SERVICE_ROLE_KEY` — **faqat serverda ishlatiladi, hech qachon clientga oshkor qilinmaydi** (booking API shu kalit orqali narxni qayta hisoblab, band qilishni yozadi).
4. `npm run dev` — `/guest-houses` sahifasida haqiqiy Supabase ma'lumotlari ko'rinadi.

### Booking oqimi qanday ishlaydi

- Mehmon `/guest-houses/[slug]` sahifasida sana, mehmonlar va xonalar sonini tanlaydi — narx **darhol** hisoblanadi (frontend taxminiy ko'rsatkich).
- Yuborilganda so'rov `app/api/bookings/route.ts`ga boradi: bu yerda narx **qayta**, Supabase'dagi haqiqiy `price_per_night` asosida hisoblanadi (clientga ishonilmaydi).
- Har bir yuborish uchun tasodifiy `Idempotency-Key` yaratiladi — tarmoq xatosi tufayli ikki marta bosilsa ham, bitta booking yoziladi.
- Sanalar mos kelmasa (band qilingan kunlar bilan to'qnashsa), PostgreSQL exclusion constraint xatoni qaytaradi va foydalanuvchiga tushunarli xabar ko'rsatiladi.
- Booking `pending` statusda yoziladi — Milestone 4'dagi Admin panelda tasdiqlanadi.

## Milestone 3'ni ishga tushirish

1. SQL Editor'da `supabase/migrations/002_gallery_tour_events_blog_reviews.sql` faylini ishga tushiring (`001_core_schema.sql`dan keyin).
2. Bu migratsiya `gallery_items`, `tour_scenes`, `events`, `blog_posts`, `reviews` jadvallarini va namunaviy (seed) ma'lumotlarni yaratadi.
3. `/gallery`, `/360-tour`, `/events`, `/blog` sahifalari avtomatik ishlay boshlaydi.
4. Google/Tripadvisor sharhlarini avtomatik sinxronlashtirish (real API integratsiyasi) keyingi bosqichda — hozircha `reviews` jadvaliga qo'lda yoki admin panel orqali kiritiladi.

## Milestone 4'ni ishga tushirish (Admin panel)

1. SQL Editor'da `supabase/migrations/003_site_settings.sql` faylini ishga tushiring.
2. Supabase Dashboard → **Authentication → Users → Add user** orqali o'zingiz uchun admin hisob yarating (email + parol). Ommaviy ro'yxatdan o'tish sahifasi ataylab yo'q — adminlar faqat shu yo'l bilan qo'shiladi.
3. SQL Editor'da shu foydalanuvchini admin qiling:
   ```sql
   update public.profiles set role = 'admin' where id = 'YANGI_USER_UUID';
   ```
   (UUID'ni Authentication → Users bo'limidan nusxalab oling.)
4. `/admin/login` sahifasiga kirib, shu email/parol bilan tizimga kiring.
5. Admin panelda: Dashboard, Bookings (tasdiqlash/bekor qilish), Guest Houses/Gallery/Events/Blog/Reviews (to'liq CRUD), Users (faqat `admin` roli rol o'zgartira oladi), Settings, Media Manager, Analytics mavjud.

**Muhim:** `SUPABASE_SERVICE_ROLE_KEY` faqat serverda (Server Actions, Route Handlers) ishlatiladi va hech qachon brauzerga yuborilmaydi — barcha admin mutatsiyalar avval `requireAdmin()` orqali rolni qaytadan tekshiradi.

**Translations bo'limi haqida eslatma:** hozirgi holatda barcha UZ/RU/EN matnlar kod ichidagi lug'at fayllarida (`lib/i18n/dictionaries/*.ts`) saqlanadi — bu tezkor va build-vaqtida tekshiriladigan yondashuv. To'liq DB-asoslangan Translations boshqaruv paneli (admin orqali matnlarni tahrirlash) katta arxitektura o'zgarishini talab qiladi; agar kerak bo'lsa, alohida qo'shimcha vazifa sifatida qo'shib beraman.

## Admin panelning qayta qurilishi — oq ekran va redirect loop tuzatildi

`/app/admin` bo'limi to'liq qayta qurildi (**faqat admin — ommaviy sayt o'zgarmadi**). Sabab: haqiqiy va tez-tez uchraydigan xato topildi.

### Topilgan asosiy xato (redirect loop)

Eski kodda `proxy.ts` faqat "tizimga kirganmi yo'qmi"ni tekshirar, rolni tekshirmasdi. Rol tekshiruvi faqat `requireAdmin()` ichida, sahifa darajasida bo'lardi. Natijada:

1. Foydalanuvchi tizimga kirgan, lekin `profiles` jadvalida qatori yo'q yoki roli `admin`/`manager` emas.
2. `proxy.ts` uni o'tkazib yuboradi (chunki faqat "user bormi" tekshiradi).
3. `requireAdmin()` rolni tekshiradi → ruxsat yo'q → `/admin/login?error=forbidden`ga redirect qiladi.
4. Lekin sessiya hali ham amalda! `proxy.ts` `/admin/login`da "user bor" deb ko'radi va uni yana `/admin`ga qaytaradi.
5. **2-4 qadamlar cheksiz takrorlanadi** — brauzerda "ERR_TOO_MANY_REDIRECTS" yoki oq ekran.

### Tuzatish

- `proxy.ts` endi **rolni ham shu yerda**, bitta so'rovda tekshiradi. Agar sessiya bor-u rol noto'g'ri bo'lsa — **avval `signOut()` qilinadi**, keyingina `/admin/login`ga yo'naltiriladi. Shunday qilib keyingi so'rovda sessiya endi yo'q, va hech qanday loop mumkin emas.
- `requireAdmin()` — ikkinchi mudofaa qatlami sifatida qoldi (har so'rovda rolni qaytadan DB'dan o'qiydi), lekin u ham xuddi shunday "signOut keyin redirect" mantig'iga ega, shuning uchun ikkalasi hech qachon ziddiyatga kirmaydi.
- Supabase muhit o'zgaruvchilari sozlanmagan bo'lsa, `proxy.ts` va `lib/supabase/{server,admin}.ts` endi tushunarli xato qaytaradi (oldin "oq ekran" yoki tushunarsiz crash bo'lardi).
- `app/admin/error.tsx` va `app/admin/(dashboard)/error.tsx` qo'shildi — endi har qanday kutilmagan xato **hech qachon oq ekran emas**, balki tushunarli xabar va "Qayta urinish" tugmasi bilan ko'rsatiladi.
- `app/admin/(dashboard)/loading.tsx` — sahifalar orasida navigatsiya paytida skelet ko'rinish.

### Login va sessiya — endi Server Action orqali

- Eski versiya: login formasi brauzer tomonida (`createSupabaseBrowserClient`) ishlardi.
- Yangi versiya: `lib/admin/actions/login.ts` — **server tomonidagi** Server Action. Bu login jarayonini butunlay serverga o'tkazadi, sessiya cookie'lari to'g'ridan-to'g'ri serverda o'rnatiladi (race condition xavfisiz), va rate limiting shu yerda amalga oshiriladi.

### Rate limiting (5 urinish → 15 daqiqa blok)

- Yangi jadval: `supabase/migrations/004_login_rate_limit.sql` → `login_attempts` (faqat service-role orqali, RLS yoqilgan, ommaviy siyosat yo'q).
- Email bo'yicha hisoblanadi (katta-kichik harflarga sezgir emas). 5 marta noto'g'ri parol/email → 15 daqiqaga bloklanadi, muvaffaqiyatli kirishda hisoblagich nolga tushadi.
- Amalga oshirilishi: `lib/admin/rate-limit.ts`.

### Responsive UI

- `AdminSidebar` qayta qurildi: desktop'da doimiy panel, mobil'da hamburger tugma + slide-in drawer (ommaviy saytdagi mobil menyu uslubiga mos).

### Bu qayta qurish uchun qo'shimcha SQL

SQL Editor'da `supabase/migrations/004_login_rate_limit.sql` faylini ishga tushiring (001–003'dan keyin, bir marta).

## Milestone 5'ni ishga tushirish (Weather, PWA, Dark Mode, SEO)

### OpenWeather
1. [openweathermap.org/api/one-call-3](https://openweathermap.org/api/one-call-3) orqali ro'yxatdan o'ting (bepul reja kuniga 1000 so'rovni o'z ichiga oladi, karta tasdiqlash talab qilinishi mumkin).
2. API kalitni `.env.local`ga `OPENWEATHER_API_KEY` sifatida qo'shing.
3. Bosh sahifadagi "Sentob ob-havosi" bo'limi avtomatik ishlay boshlaydi (Bugungi / 3 kunlik / 7 kunlik tablar). Kalit sozlanmagan bo'lsa, widget xushmuomala xabar ko'rsatadi (sayt buzilmaydi).

### PWA (Progressive Web App)
- `public/manifest.webmanifest`, `public/icons/*.png` (brend ranglaridagi tog' logotipi bilan avtomatik generatsiya qilingan) va `public/sw.js` (oddiy network-first offline keshlash) tayyor.
- Foydalanuvchilar mobil brauzerdan "Bosh ekranga qo'shish" orqali saytni ilova sifatida o'rnata oladi.
- Service worker faqat production build'da (`npm run build && npm start` yoki Vercel'da) faollashadi, `npm run dev`da emas.

### Dark / Light Mode
- Header'dagi oy/quyosh tugmasi orqali almashtiriladi, tanlov `localStorage`da saqlanadi va sahifa qayta ochilganda kutilmagan miltillashsiz (FOUC'siz) qo'llaniladi.
- Hozircha to'liq qamrov: Header, Bosh sahifaning barcha bo'limlari (Hero, About, Attractions, Experiences, Guest Houses, Map, Weather, Reviews) va Footer.
- Ichki sahifalar (Guest House detali, Gallery, Events, Blog, Admin panel) yorug' rejimda to'liq ishlaydi va Dark Mode yoqilganda ham buzilmaydi (asosiy fon/matn ranglari to'g'ri almashadi), lekin ularning **har bir kartasi** uchun alohida qorong'i rang palitrasi hali qo'shilmagan — bu tez orada qo'shsa bo'ladigan kichik jilo ishi.

### SEO audit
- Har bir sahifada `title`, `description`, `canonical` mavjud; mehmon uyi/tadbir/maqola sahifalari o'ziga xos OpenGraph rasmini ishlatadi (agar `cover_image` bo'lsa), qolganlari umumiy branded OG rasmini meros qilib oladi.
- `public/images/og-cover.jpg` — 1200×630 o'lchamdagi haqiqiy OpenGraph/Twitter Card rasmi (Sentob logotipi, sarlavha va UN Tourism belgisi bilan).
- `app/robots.ts` va `app/sitemap.ts` barcha sahifalarni (shu jumladan dinamik guest-house/event/blog sahifalarini) o'z ichiga oladi.
- Schema.org JSON-LD: bosh sahifada `TouristDestination`, har bir blog postida `Article`.

### Vercel'ga deploy qilish
1. Repozitoriyni GitHub'ga yuklang (yoki to'g'ridan-to'g'ri Vercel CLI orqali `vercel` buyrug'ini ishga tushiring).
2. [vercel.com/new](https://vercel.com/new) orqali loyihani import qiling — Next.js avtomatik aniqlanadi (`vercel.json` allaqachon `framework: "nextjs"` deb belgilangan).
3. Environment Variables bo'limida `.env.example`dagi barcha kalitlarni kiriting (ayniqsa `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENWEATHER_API_KEY`).
4. Deploy tugmasini bosing. `vercel.json` xavfsizlik headerlarini (X-Frame-Options, X-Content-Type-Options va h.k.) va `sw.js`/`manifest.webmanifest` uchun to'g'ri keshlash siyosatini avtomatik qo'llaydi.
5. Deploy'dan so'ng Supabase loyihasidagi **Authentication → URL Configuration**da saytning haqiqiy domenini (`https://sentob.uz` yoki Vercel domeni) qo'shishni unutmang — aks holda admin login redirect ishlamasligi mumkin.

## Muhit o'zgaruvchilari

`.env.example` faylida barcha kerakli kalitlar va ularning nima uchun ishlatilishi izohlangan (Supabase, OpenWeather; Google Maps va Telegram bot — keyingi kengaytmalar uchun zaxirada).

## Eslatma

Loyiha barcha 5 milestone bo'yicha `tsc --noEmit`, `eslint` va `next build` orqali xatosiz tekshirilgan production-ready holatda topshirilmoqda.
