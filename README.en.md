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
| Android  | [Download APK](#)                                                                                                      |
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
