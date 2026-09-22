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
| Android   | [APK-ni yüklə](#)                                                                                                          |
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
