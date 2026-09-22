<details>
<summary><b>EN</b></summary>
  <p align="center">
  <img src="./docs/media/logo.png" alt="Music Shop Logo" width="120"/>
</p>

<h1 align="center">Music Shop</h1>

<p align="center">
  An offline-first, cross-platform (iOS & Android) e-commerce app for musical instruments.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
</p>

---

> **About this repository**
> This repo is a **code showcase** of Music Shop, shared for review purposes. It does not include environment variables, EAS build configuration, or push-notification credentials, so it isn't meant to be cloned and run locally. To try the actual app, use the links below.

## 📲 Try It Out

| Platform | Link                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Android  | [Download APK](https://github.com/MeftunMemmedov/music-shop_rnexpo/releases/tag/v1.0.0)                                                                                                      |
| Android  | [Try on Appetize.io](https://appetize.io/app/android/com.anonymous.shopapp?device=pixel7&osVersion=13.0&toolbar=true)  |
| iOS      | [Try on Appetize.io](https://appetize.io/app/ios/com.anonymous.shopapp?device=iphone14pro&osVersion=16.2&toolbar=true) |

## ✨ Features

- **Product filtering** — filter by category, brand, price
- **Comments** — create, edit, and delete product reviews
- **Guest shopping** — cart and wishlist work without an account, with a limited item cap for guests; items merge into the user's account on login
- **Cart management** — adjust item quantities directly from the cart
- **Order placement** — full checkout flow (details → review → confirmation); no real payment processing, since this is a semi-real portfolio project
- **Smart notifications**
  - Before login: a "we miss you" nudge after prolonged inactivity, and a reminder when items are left in the cart
  - After login: alerts when a wishlisted item goes on sale, and updates when an order's status changes
- **Offline-first experience** — browse products, categories, brands, and notifications with no connection; manage the wishlist offline (pending actions sync automatically once back online); manage the cart offline when not logged in
- **Authentication** — Email/Password and Google OAuth, with a full forgot-password / reset-password flow

## 🛠️ Tech Stack

**Mobile App**

| Category                | Tools                                             |
| ----------------------- | ------------------------------------------------- |
| Framework               | React Native (Expo, Expo Router)                  |
| Language                | TypeScript                                        |
| Styling / UI            | NativeWind, GlueStack UI, Expo Vector Icons, Moti |
| Typography              | Google Sans                                       |
| State Management        | Redux Toolkit                                     |
| Data Fetching / Caching | TanStack Query, Axios                             |
| Local Storage / Offline | SQLite (expo-sqlite), AsyncStorage                |
| Forms & Validation      | React Hook Form, Zod                              |

**Backend**

| Category             | Tools                        |
| -------------------- | ---------------------------- |
| Backend-as-a-Service | Supabase                     |
| Authentication       | Email/Password, Google OAuth |

## 📂 Project Structure

> The tree below follows Expo Router's file-based routing and reflects how the app is organized. Some file names may differ slightly in the actual repo.

```
music-shop/
src/                                      # Main source directory containing the entire application codebase
├── api/                                  # API client configuration, endpoint definitions, and HTTP requests
│   ├── auth/                             # Authentication-related API endpoints and services
│   │   ├── helpers/                      # Helper utilities specific to auth requests (e.g., token parsing)
│   │   └── index.ts                      # Main entry point exporting authentication API functions
│   ├── helpers/                          # General API utilities (e.g., query params formatters, URL builders)
│   └── index.ts                          # Base HTTP client setup (e.g., Axios/fetch instance, interceptors)
├── app/                                  # File-based routing directory (Expo Router)
│   ├── (drawer)/                         # Route group for drawer navigation pages
│   ├── pagename/                         # Folder representing a specific route path
│   │   └── index.tsx                     # Main screen component rendered for the 'pagename' route
│   ├── _layout.tsx                       # Root/nested layout wrapper defining navigation structures
│   └── index.tsx                         # Home screen / initial entry page route
├── assets/                               # Static media files and design assets
│   ├── fonts/                            # Custom typography and font files (.ttf, .otf)
│   └── images/                           # App images, vectors, and icons
├── components/                           # Reusable, modular UI components (e.g., Buttons, Inputs, Cards)
├── constants/                            # Application-wide constants, color palettes, storage keys and etc.
├── helpers/                              # General-purpose utility and helper functions
├── hooks/                                # Custom React hooks (e.g., useWishlist, useResponsive and etc.)
├── i18n/                                 # Internationalization setup, translation keys, and locale configurations
├── providers/                            # Providers wrapping the application
├── schemas/                              # Data and form validation schemas (e.g., Zod)
├── screens/                              # Standalone view components and full-screen UI layouts
├── sqlite/                               # Local SQLite database initialization, custom queries, and migrations
├── store/                                # Redux Toolkit global state management
│   ├── sliceName/                        # Domain-specific state slice (e.g., user, cart)
│   │   ├── asyncThunks/                  # Asynchronous Redux thunk action definitions
│   │   │   ├── actions.ts                # Async thunk actions
│   │   │   └── index.ts                  # Async thunk implementations for API interactions
│   │   ├── index.ts                      # Redux slice definition (reducers and sync action creators)
│   │   └── initialState.ts               # Default initial state values for this slice
│   ├── hooks.ts                          # Typed Redux hooks (e.g., useAppDispatch, useAppSelector)
│   ├── index.ts                          # Redux store configuration and root reducer setup
│   └── provider.tsx                      # Redux StoreProvider component wrapper for the app tree
└── types/                                # Global TypeScript type definitions, interfaces, and declaration files
```

## 🏗️ Architecture

### State Management — Redux Toolkit

Redux Toolkit is scoped to session-critical, frequently-read state: authentication status, the current user's profile, cart contents, and the user's own comments.

- Cart and comment mutations use **optimistic UI** — the UI updates immediately while the request runs in the background, keeping interactions instant even on a slow connection.
- Keeping the user's own comments in the store (instead of re-fetching on every visit) avoids duplicate `GET` requests when the user revisits their comment history or edits/deletes an existing comment.

### Data Layer — Axios + TanStack Query + SQLite

- A shared **Axios instance** wraps every API call with:
  - A request interceptor that always attaches a valid access token, using a single in-flight refresh promise so concurrent requests never trigger duplicate token-refresh calls.
  - A response interceptor that transparently refreshes the session and retries the original request once on a `401`; if the refresh itself fails, tokens are cleared and the user is signed out.
- **TanStack Query** runs in `offlineFirst` mode for both queries and mutations, driven by a `NetInfo`-backed online manager, so the app can serve cached data and queue mutations the moment the device goes offline.
  - A curated set of query keys (categories, brands, slides, notifications, wishlist) is persisted to disk through a custom **SQLite-backed persister**, so this data survives app restarts even without a connection.
  - Mutations paused while offline (e.g. toggling a wishlist item) are persisted as well and automatically resumed once connectivity returns, with exponential-backoff retries and duplicate-conflict handling (an "already exists" response is treated as success, not an error).
- **SQLite** also acts as a bounded local cache for products and orders — each table is capped at a fixed row count and trimmed by recency, so on-device storage stays bounded. Product and order queries try the network first and transparently fall back to this local cache on failure, which is what powers offline browsing.

## 🧩 Design Patterns

A few recurring patterns show up across the codebase:

- **Facade** — `useWishlist` (and similar hooks) hide TanStack Query's query/mutation plumbing behind a small, purpose-built interface (`items`, `count`, `isInWishlist`, `toggle`), so screens never touch query keys or cache internals directly.
- **Optimistic Update (with rollback)** — mutations update the cache immediately in `onMutate`, and roll back to the previous snapshot in `onError` if the request fails.
- **Repository** — the SQLite helpers (`getProductBySlugFromDB`, `saveProductsToDB`, `getLocalOrders`, etc.) wrap raw SQL behind a small set of typed functions, keeping storage details out of the UI and query layers.
- **Interceptor** — Axios request/response interceptors centralize cross-cutting concerns (attaching the access token, retrying once on a `401`) instead of repeating that logic in every API call.
- **Request Deduplication (in-flight promise memoization)** — a single shared `refreshPromise` ensures that if several requests hit a `401` at the same time, only one token-refresh call is made; the rest await the same promise.
- **Network-First with Cache Fallback** — reads try the network first and transparently fall back to the local SQLite cache on failure.
- **Debounced Input** — search input is debounced (500ms) before triggering a query, to avoid firing a request on every keystroke.
- **Soft Gate (usage cap)** — guests are allowed a limited number of cart/wishlist items before being prompted to sign in, rather than blocking guest usage entirely.

## 📡 Offline Support

| While Offline                                                  | Available                  |
| -------------------------------------------------------------- | -------------------------- |
| Browse products + visited product details, categories, brands  | ✅                         |
| View notifications                                             | ✅                         |
| Manage wishlist (auto-syncs once back online, logged-in users) | ✅                         |
| Manage cart                                                    | ✅ (guest users only)      |
| Place new orders                                               | ❌ (requires a connection) |

## 🤔 Why These Choices

**Redux Toolkit vs. TanStack Query.** These aren't interchangeable — TanStack Query owns _server state_ (fetching, caching, revalidation, offline queuing), while Redux Toolkit is used only for the _client state_ that needs to be mutated optimistically, ahead of or independently from any server round-trip: auth status, cart items, and the user's own comments. Keeping the split this strict avoids the common trap of duplicating server-fetched data inside a global store, which quickly leads to two sources of truth and stale-data bugs.

**Single-flight token refresh.** If several requests fail with a `401` around the same time, each one would otherwise trigger its own refresh call — wasting requests and risking a race where an earlier refresh invalidates a token an in-flight request still relies on. Sharing one in-flight refresh promise across all callers guarantees exactly one refresh happens, and every waiting request resolves against its result.

**Offline access to products & wishlist.** If a user loses connection after finding something they like, the cart is intentionally disabled while offline for logged-in users — cart/checkout is a transactional flow that isn't part of the offline-first scope. The wishlist stays available offline instead, so the user can still save the item and move it to the cart once they're back online.

**Guest cart/wishlist cap.** The limit isn't there to restrict usage — it's a soft nudge. Once a guest has added enough items to show real interest, they're prompted to create an account rather than being blocked outright.

**Network-first reads with SQLite fallback, and queued offline mutations.** Two different problems, two matching solutions: for _reads_ (products, categories), the app tries the network first and falls back to the local cache so a dropped connection doesn't erase what the user has already browsed. For _writes_ made offline (like toggling a wishlist item), TanStack Query's own paused-mutation mechanism holds the action and replays it automatically once connectivity returns — no hand-rolled sync queue needed.

## 📱 App Screens

<details>
<summary>Click to expand full screen list</summary>

- Onboarding
- **Home** — featured categories, hero carousel, featured products
- **Discover** — full category list with subcategories
- **Search** — search, filter, and sort
- **Products by Category** — filtered results with subcategory navigation
- **Product Details** — full product info, reviews, cart/wishlist actions
- **Cart**
- **Checkout**
  - Form — shipping details, delivery options
  - Payment — simulated payment step
  - Complete — order confirmation
- **Notifications**
- **Auth**
  - Sign In
  - Sign Up
  - Forgot Password
  - Reset Password
- **About**
- **Account**
  - Account Settings
  - Orders (with status filtering)
  - Order Details
  - My Comments (edit/delete)
  - Wishlist

</details>

## ⚠️ Known Limitations

- No real payment gateway — the Payment step simulates the process for demo purposes only
- Multi-language support is scaffolded (i18n is set up) but translations haven't been written yet — the app currently ships in a single language
- No automated test suite yet

## 🗺️ Roadmap

- [ ] Full multi-language support
- [ ] Unit / E2E test coverage

## 📄 License

This project was built purely as a personal portfolio piece and is **not open source**. All rights are reserved — the source code and assets may not be copied, reused, or redistributed without explicit permission from the author.

## 📬 Contact

- 📧 Email: [mftndev6386@gmail.com](mailto:mftndev6386@gmail.com)
- 💼 LinkedIn: [linkedin.com/in/](https://www.linkedin.com/in/m%C9%99ftun-m%C9%99mm%C9%99dov-378a2a2b1/)
- 📄 CV / Resume: [Download CV](#)
</details>


<details open>
<summary><b>AZ</b></summary>
<p align="center">
  <img src="./docs/media/logo.png" alt="Music Shop Logo" width="120"/>
</p>

<h1 align="center">Music Shop</h1>

<p align="center">
  Musiqi alətləri üçün offline-first, cross-platform (iOS və Android) e-ticarət tətbiqi.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
</p>

---

> **Bu repo haqqında**
> Bu repo Music Shop layihəsinin **kod nümayişi**dir, yalnız baxış üçün paylaşılıb. Environment dəyişənlərini, EAS build konfiqurasiyasını və ya push-notification credential-larını əhatə etmir, yəni klonlanıb lokal işə salınmaq üçün nəzərdə tutulmayıb. Tətbiqi canlı sınamaq üçün aşağıdakı linklərdən istifadə edin.

## 📲 Sınayın

| Platforma | Link                                                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------------------- |
| Android   | [APK-ni yüklə](https://github.com/MeftunMemmedov/music-shop_rnexpo/releases/tag/v1.0.0)                                                                                                          |
| Android   | [Appetize.io-da sınayın](https://appetize.io/app/android/com.anonymous.shopapp?device=pixel7&osVersion=13.0&toolbar=true)  |
| iOS       | [Appetize.io-da sınayın](https://appetize.io/app/ios/com.anonymous.shopapp?device=iphone14pro&osVersion=16.2&toolbar=true) |

## ✨ Xüsusiyyətlər

- **Məhsul filtrləmə** — kateqoriyaya, brendə, qiymətə görə filtrləmə
- **Rəylər (Comments)** — məhsul rəylərinin yaradılması, redaktəsi və silinməsi
- **Qonaq (guest) rejimində alış-veriş** — hesab olmadan da səbət və istək siyahısı işləyir, qonaqlar üçün məhdud məhsul limiti var; giriş edildikdə bu elementlər istifadəçinin hesabına köçürülür
- **Səbət idarəetməsi** — məhsul miqdarını birbaşa səbətdən dəyişmək
- **Sifariş vermə** — tam checkout axını (detallar → nəzərdən keçirmə → təsdiq); real ödəniş sistemi yoxdur, çünki bu yarı-real bir portfolio layihəsidir
- **Ağıllı bildirişlər**
  - Giriş etməmişdən əvvəl: uzun müddət fəaliyyətsizlikdən sonra "sizi darıxdıq" bildirişi, səbətdə qalan məhsullar üçün xatırlatma
  - Giriş etdikdən sonra: istək siyahısındakı məhsul endirimə düşəndə, sifarişin statusu dəyişəndə bildiriş
- **Offline-first təcrübə** — internet olmadan məhsullara, kateqoriyalara, brendlərə və bildirişlərə baxmaq; offline istək siyahısı idarəetməsi (gözləyən əməliyyatlar internet gələn kimi avtomatik sinxronlaşır); giriş edilməyibsə offline səbət idarəetməsi
- **Autentifikasiya** — Email/Şifrə və Google OAuth, tam "şifrəni unutdum / şifrəni sıfırla" axını ilə

## 🛠️ Texnologiya Stack-i

**Mobil Tətbiq**

| Kateqoriya              | Alətlər                                           |
| ----------------------- | ------------------------------------------------- |
| Framework               | React Native (Expo, Expo Router)                  |
| Dil                     | TypeScript                                        |
| Styling / UI            | NativeWind, GlueStack UI, Expo Vector Icons, Moti |
| Tipoqrafiya             | Google Sans                                       |
| State Management        | Redux Toolkit                                     |
| Data Fetching / Caching | TanStack Query, Axios                             |
| Local Storage / Offline | SQLite (expo-sqlite), AsyncStorage                |
| Formalar & Validasiya   | React Hook Form, Zod                              |

**Backend**

| Kateqoriya           | Alətlər                   |
| -------------------- | ------------------------- |
| Backend-as-a-Service | Supabase                  |
| Autentifikasiya      | Email/Şifrə, Google OAuth |

## 📂 Layihə Strukturu

> Aşağıdakı struktur Expo Router-in fayl-əsaslı routing sisteminə uyğundur və tətbiqin ümumi təşkilini əks etdirir. Faktiki repodakı bəzi fayl adları bir qədər fərqli ola bilər.

```
music-shop/
src/                                       # Bütün tətbiqin kod bazasını ehtiva edən əsas mənbə qovluğu
├── api/                                   # API klient konfiqurasiyası, endpoynt tərifləri və HTTP sorğuları
│   ├── auth/                              # Autentifikasiya ilə bağlı API endpoyntləri və xidmətləri
│   │   ├── helpers/                       # Autentifikasiya sorğularına özəl köməkçi funksiyalar (məs. tokenin pars olunması)
│   │   └── index.ts                       # Autentifikasiya API funksiyalarını ixrac edən əsas giriş nöqtəsi
│   ├── helpers/                           # Ümumi API köməkçi funksiyaları (məs. sorğu parametrlərinin formatlaşdırıcıları, URL qurucuları)
│   └── index.ts                           # Əsas HTTP klient quraşdırması (məs. Axios/fetch instansiyası, interceptor-lar)
├── app/                                   # Fayl əsaslı yönləndirmə (routing) qovluğu (Expo Router)
│   ├── (drawer)/                          # Yan menyu (drawer) naviqasiya səhifələri üçün marşrut qrupu
│   ├── pagename/                          # Müəyyən bir marşrut (route) yolunu təmsil edən qovluq
│   │   └── index.tsx                      # 'pagename' marşrutu üçün render edilən əsas ekran komponenti
│   ├── _layout.tsx                        # Naviqasiya strukturlarını təyin edən kök/iç-içə leyaut (layout) bükücüsü
│   └── index.tsx                          # Ana ekran / ilkin giriş səhifəsi marşrutu
├── assets/                                # Statik media faylları və dizayn resursları
│   ├── fonts/                             # Xüsusi şrift və tipoqrafiya faylları (.ttf, .otf)
│   └── images/                            # Tətbiq şəkilləri, vektorlar və ikonlar
├── components/                            # Yenidən istifadə oluna bilən, modulyar UI komponentləri (məs. Düymələr, İnputlar, Kartlar)
├── constants/                             # Tətbiq miqyasında sabitilər (constants), rəng palitraları, storage açarları və s.
├── helpers/                               # Ümumi təyinatlı yardımçı və köməkçi funksiyalar
├── hooks/                                 # Xüsusi React hook-ları (məs. useWishlist, useResponsive və s.)
├── i18n/                                  # Beynəlxalqlaşdırma (i18n) quraşdırması, tərcümə açarları və lokal konfiqurasiyaları
├── providers/                             # Tətbiqi əhatə edən provider-lər (kontekst təminatçıları)
├── schemas/                               # Məlumat və forma doğrulama (validation) sxemləri (məs. Zod)
├── screens/                               # Müstəqil görünüş komponentləri və tam ekran UI düzəlişləri
├── sqlite/                                # Lokal SQLite verilənlər bazasının inisializasiyası, xüsusi sorğular və miqrasiyalar
├── store/                                 # Redux Toolkit qlobal vəziyyət idarəetməsi (state management)
│   ├── sliceName/                         # Domenə özəl vəziyyət dilimi (state slice) (məs. user, cart)
│   │   ├── asyncThunks/                   # Asinxron Redux thunk action tərifləri
│   │   │   ├── actions.ts                 # Asinxron thunk action-ları
│   │   │   └── index.ts                   # API qarşılıqlı əlaqələri üçün asinxron thunk tətbiqləri (implementasiyaları)
│   │   ├── index.ts                       # Redux slice tərifi (reducer-lər və sinxron action creator-lar)
│   │   └── initialState.ts                # Bu slice üçün ilkin vəziyyət (initial state) dəyərləri
│   ├── hooks.ts                           # Tipləndirilmiş Redux hook-ları (məs. useAppDispatch, useAppSelector)
│   ├── index.ts                           # Redux store konfiqurasiyası və kök reducer (root reducer) quraşdırması
│   └── provider.tsx                       # Tətbiq ağacı üçün Redux StoreProvider komponent bükücüsü
└── types/                                 # Qlobal TypeScript tip tərifləri, interfeyslər və bəyannamə (declaration) faylları
```

## 🏗️ Arxitektura

### State Management — Redux Toolkit

Redux Toolkit yalnız sessiya üçün kritik, tez-tez oxunan state-lər üçün istifadə olunur: autentifikasiya statusu, cari istifadəçinin profili, səbətin məzmunu və istifadəçinin öz rəyləri.

- Səbət və rəy mutasiyaları **optimistic UI** istifadə edir — sorğu arxa planda işləyərkən interfeys dərhal yenilənir, bu da yavaş internetdə belə interaksiyaları ani edir.
- İstifadəçinin öz rəylərinin store-da saxlanması (hər dəfə yenidən çəkmək əvəzinə) rəy tarixçəsinə baxarkən və ya mövcud rəyi redaktə/silərkən təkrar `GET` sorğularının qarşısını alır.

### Data Qatı — Axios + TanStack Query + SQLite

- Ortaq bir **Axios instance** hər API çağırışını belə əhatə edir:
  - Request interceptor həmişə etibarlı access token əlavə edir, eyni anda gedən sorğuların hər biri ayrı-ayrı token-refresh çağırışı etməsin deyə tək bir in-flight refresh promise istifadə olunur.
  - Response interceptor `401` gələndə sessiyanı şəffaf şəkildə yeniləyir və orijinal sorğunu bir dəfə təkrar edir; refresh özü uğursuz olarsa token-lər silinir və istifadəçi sistemdən çıxarılır.
- **TanStack Query** həm query, həm də mutation-lar üçün `offlineFirst` rejimində işləyir, `NetInfo`-əsaslı online manager tərəfindən idarə olunur, beləliklə cihaz offline olan kimi tətbiq keşlənmiş datanı göstərə və mutasiyaları növbəyə qoya bilir.
  - Seçilmiş bəzi query key-lər (kateqoriyalar, brendlər, slaydlar, bildirişlər, istək siyahısı) xüsusi bir **SQLite-əsaslı persister** vasitəsilə diskə yazılır, beləliklə bu data internet olmadan da tətbiq yenidən açılanda qalır.
  - Offline vaxt dayandırılan mutasiyalar (məsələn, istək siyahısına əlavə/silmə) də saxlanılır və internet qayıdan kimi avtomatik təkrar işə salınır, exponential-backoff retry məntiqi və dublikat-konflikt idarəetməsi ilə ("artıq mövcuddur" cavabı xəta yox, uğur kimi qəbul edilir).
- **SQLite** həm də məhsullar və sifarişlər üçün limitli lokal keş rolunu oynayır — hər cədvəl sabit sətir sayı ilə məhdudlaşır və ən köhnə qeydlər silinir, beləliklə cihazdakı yaddaş həcmi nəzarətdə qalır. Məhsul və sifariş sorğuları əvvəlcə şəbəkəni sınayır, uğursuz olarsa şəffaf şəkildə bu lokal keşə keçir — offline gəzintini məhz bu təmin edir.

## 🧩 Dizayn Pattern-ləri

Kod bazasında təkrarlanan bir neçə pattern var:

- **Facade** — `useWishlist` (və bənzər hook-lar) TanStack Query-nin query/mutation mexanizmini kiçik, məqsədyönlü bir interfeysin (`items`, `count`, `isInWishlist`, `toggle`) arxasında gizlədir, beləliklə ekranlar heç vaxt birbaşa query key-lərə və ya keş daxili detallara toxunmur.
- **Optimistic Update (rollback ilə)** — mutasiyalar keşi `onMutate`-də dərhal yeniləyir, sorğu uğursuz olarsa `onError`-da əvvəlki vəziyyətə qayıdır.
- **Repository** — SQLite köməkçi funksiyaları (`getProductBySlugFromDB`, `saveProductsToDB`, `getLocalOrders` və s.) xam SQL-i kiçik, tipli funksiyaların arxasında gizlədir, saxlama detallarını UI və query qatından uzaq tutur.
- **Interceptor** — Axios-un request/response interceptor-ları cross-cutting işləri (access token əlavə etmə, `401`-də bir dəfə təkrar cəhd) hər API çağırışında təkrarlamaq əvəzinə mərkəzləşdirir.
- **Request Deduplication (in-flight promise memoization)** — bir neçə sorğu eyni anda `401` alarsa, ortaq bir `refreshPromise` yalnız bir token-refresh çağırışının olmasını təmin edir; qalanlar həmin promise-i gözləyir.
- **Network-First with Cache Fallback** — oxuma əməliyyatları əvvəlcə şəbəkəni sınayır, uğursuz olarsa şəffaf şəkildə lokal SQLite keşinə keçir.
- **Debounced Input** — axtarış sorğusu hər hərf yazılışında deyil, 500ms debounce ilə işə salınır.
- **Soft Gate (istifadə limiti)** — qonaqlara girişə məcbur etmədən əvvəl məhdud sayda səbət/istək siyahısı elementinə icazə verilir.

## 📡 Offline Dəstəyi

| Offline olarkən                                                                     | Mövcuddur                       |
| ----------------------------------------------------------------------------------- | ------------------------------- |
| Məhsullara + baxılmış məhsul detallarına, kateqoriyalara, brendlərə baxmaq          | ✅                              |
| Bildirişlərə baxmaq                                                                 | ✅                              |
| İstək siyahısını idarə etmək (giriş edilibsə, internet qayıdanda avto-sinxronlaşır) | ✅                              |
| Səbəti idarə etmək                                                                  | ✅ (yalnız qonaq istifadəçilər) |
| Yeni sifariş vermək                                                                 | ❌ (internet tələb olunur)      |

## 🤔 Bu Seçimlərin Səbəbi

**Redux Toolkit ilə TanStack Query.** Bunlar bir-birini əvəz etmir — TanStack Query _server state_-ə (fetch, keşləmə, yenilənmə, offline növbəyə qoyma) cavabdehdir, Redux Toolkit isə yalnız server sorğusundan asılı olmadan və ya ondan əvvəl optimistik şəkildə dəyişdirilməli olan _client state_ üçün istifadə olunur: auth statusu, səbət elementləri, istifadəçinin öz rəyləri. Bu bölgünü sərt saxlamaq server-dən gələn datanın qlobal store-da təkrarlanması kimi ümumi bir tələyə düşməyin qarşısını alır, bu da tez bir zamanda iki mənbə problemi və köhnəlmiş data xətalarına gətirib çıxarır.

**Tək axınlı (single-flight) token yeniləmə.** Bir neçə sorğu təxminən eyni vaxtda `401` ilə uğursuz olarsa, hər biri öz refresh çağırışını edə bilər — bu həm sorğuları boşa xərcləyər, həm də bir refresh-in davam edən sorğunun hələ istifadə etdiyi token-i etibarsız etmə riski yaradar. Bütün çağıranlar arasında tək bir in-flight refresh promise paylaşmaq yalnız bir refresh-in baş verməsini təmin edir, gözləyən hər sorğu onun nəticəsinə görə həll olunur.

**Məhsullara və istək siyahısına offline giriş.** İstifadəçi bəyəndiyi bir şeyi tapdıqdan sonra internetini itirərsə, giriş etmiş istifadəçilər üçün səbət offline vaxt qəsdən deaktiv edilir — səbət/checkout tranzaksion bir axındır və offline-first əhatəsinə daxil deyil. Bunun əvəzinə istək siyahısı offline də əlçatan qalır, beləliklə istifadəçi məhsulu yenə də yadda saxlaya bilər və internet qayıdanda səbətə köçürə bilər.

**Qonaq səbət/istək siyahısı limiti.** Bu limit istifadəni məhdudlaşdırmaq üçün deyil — sadəcə yumşaq bir təşviqdir. Qonaq real maraq göstərəcək qədər məhsul əlavə edəndə, tamamilə bloklanmaq əvəzinə hesab yaratmağa dəvət olunur.

**Şəbəkə-əvvəlliyi oxumalar SQLite fallback ilə, offline mutasiyalar isə növbədə.** İki fərqli problem, iki uyğun həll: _oxumalar_ (məhsullar, kateqoriyalar) üçün tətbiq əvvəlcə şəbəkəni sınayır və lokal keşə keçir, beləliklə itən internet istifadəçinin artıq gördüyü məzmunu silmir. Offline zamanı edilən _yazma_ əməliyyatları üçün (məsələn, istək siyahısına toggle) TanStack Query-nin öz dayandırılmış-mutasiya mexanizmi əməliyyatı saxlayır və internet qayıdanda avtomatik təkrar edir — əl ilə yazılmış sinxronizasiya növbəsinə ehtiyac qalmır.

## 📱 Tətbiq Ekranları

<details>
<summary>Tam ekran siyahısını göstərmək üçün klikləyin</summary>

- Onboarding
- **Ana səhifə** — seçilmiş kateqoriyalar, hero karusel, seçilmiş məhsullar
- **Discover** — bütün kateqoriyaların alt-kateqoriyalarla siyahısı
- **Axtarış** — axtarış, filtr və sıralama
- **Kateqoriyaya görə məhsullar** — alt-kateqoriya naviqasiyası ilə filtrlənmiş nəticələr
- **Məhsul detalları** — tam məhsul məlumatı, rəylər, səbət/istək siyahısı əməliyyatları
- **Səbət**
- **Checkout**
  - Forma — çatdırılma detalları, çatdırılma seçimləri
  - Ödəniş — simulyasiya edilmiş ödəniş addımı
  - Tamamlandı — sifariş təsdiqi
- **Bildirişlər**
- **Auth**
  - Giriş
  - Qeydiyyat
  - Şifrəni unutdum
  - Şifrəni sıfırla
- **Haqqımızda**
- **Hesab**
  - Hesab ayarları
  - Sifarişlər (status filtri ilə)
  - Sifariş detalları
  - Mənim rəylərim (redaktə/sil)
  - İstək siyahısı

</details>

## ⚠️ Məlum Məhdudiyyətlər

- Real ödəniş sistemi yoxdur — Ödəniş addımı yalnız demo məqsədilə simulyasiya edilir
- Çoxdilli dəstək üçün skelet hazırdır (i18n qurulub), amma tərcümələr hələ yazılmayıb — tətbiq hazırda tək dildə işləyir
- Hələ avtomatlaşdırılmış test paketi yoxdur

## 🗺️ Yol Xəritəsi

- [ ] Tam çoxdilli dəstək
- [ ] Unit / E2E test əhatəsi

## 📄 Lisenziya

Bu layihə yalnız şəxsi portfolio işi kimi hazırlanıb və **açıq mənbə (open source) deyil**. Bütün hüquqlar qorunur — mənbə kodu və asset-lər müəllifin açıq icazəsi olmadan kopyalanmaz, yenidən istifadə edilmə və ya yenidən paylaşılma bilməz.

## 📬 Əlaqə

- 📧 E-poçt: [mftndev6386@gmail.com](mailto:mftndev6386@gmail.com)
- 💼 LinkedIn: [linkedin.com/in/](https://www.linkedin.com/in/m%C9%99ftun-m%C9%99mm%C9%99dov-378a2a2b1/)
- 📄 CV / Rezyume: [CV-ni yüklə](#)
</details>
