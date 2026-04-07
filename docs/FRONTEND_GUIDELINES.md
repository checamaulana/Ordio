# 🎨 Frontend Guidelines
# Sistem Pemesanan QR Code — Kopi Tempo

---

## 1. Struktur Folder Frontend

```
resources/
├── js/
│   ├── app.tsx                    # Entry point React + Inertia
│   ├── bootstrap.ts               # Bootstrap file (axios, etc)
│   ├── types/
│   │   ├── index.d.ts             # Global type definitions
│   │   └── models.ts              # TypeScript interfaces untuk model data
│   ├── lib/
│   │   └── utils.ts               # Utility functions (cn, formatRupiah, etc)
│   ├── hooks/
│   │   ├── use-polling.ts         # Custom hook untuk polling 10 detik
│   │   ├── use-notification.ts    # Custom hook untuk notifikasi suara + popup
│   │   └── use-cart.ts            # Custom hook untuk keranjang pelanggan
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── table.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── separator.tsx
│   │   │   └── label.tsx
│   │   ├── customer/              # Komponen khusus halaman pelanggan
│   │   │   ├── menu-category-tabs.tsx
│   │   │   ├── menu-item-card.tsx
│   │   │   ├── menu-item-detail.tsx
│   │   │   ├── cart-sheet.tsx
│   │   │   ├── cart-item.tsx
│   │   │   ├── order-summary.tsx
│   │   │   ├── payment-method-selector.tsx
│   │   │   └── qris-payment-view.tsx
│   │   ├── dashboard/             # Komponen khusus dashboard kasir
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── order-card.tsx
│   │   │   ├── order-detail-modal.tsx
│   │   │   ├── takeaway-form.tsx      # Komponen keranjang order takeaway
│   │   │   ├── payment-cash-modal.tsx
│   │   │   ├── payment-qris-modal.tsx
│   │   │   ├── menu-form.tsx
│   │   │   ├── category-form.tsx
│   │   │   ├── variant-form.tsx
│   │   │   ├── table-form.tsx
│   │   │   ├── qr-code-modal.tsx
│   │   │   ├── report-chart.tsx
│   │   │   └── notification-popup.tsx
│   │   └── shared/                # Komponen yang dipakai di kedua sisi
│   │       ├── app-logo.tsx
│   │       └── loading-spinner.tsx
│   ├── layouts/
│   │   ├── customer-layout.tsx    # Layout untuk halaman pelanggan (mobile)
│   │   └── dashboard-layout.tsx   # Layout untuk dashboard kasir (desktop)
│   └── pages/
│       ├── customer/              # Halaman pelanggan (Inertia pages)
│       │   ├── Menu.tsx           # /meja/{nomor}/menu
│       │   ├── Checkout.tsx       # /meja/{nomor}/checkout
│       │   ├── Payment.tsx        # /meja/{nomor}/pembayaran (QRIS)
│       │   ├── Success.tsx        # /meja/{nomor}/sukses
│       │   ├── Unpaid.tsx         # /meja/{nomor}/belum-bayar
│       │   └── Error.tsx          # Halaman error (meja tidak ditemukan)
│       ├── dashboard/             # Halaman kasir (Inertia pages)
│       │   ├── Orders.tsx         # Dashboard pesanan aktif
│       │   ├── TakeawayCreate.tsx # Halaman untuk input pesanan takeaway baru
│       │   ├── MenuItems.tsx      # Kelola item menu
│       │   ├── Categories.tsx     # Kelola kategori
│       │   ├── Tables.tsx         # Kelola meja
│       │   ├── ReportDaily.tsx    # Laporan harian
│       │   ├── ReportWeekly.tsx   # Laporan mingguan
│       │   ├── ReportMonthly.tsx  # Laporan bulanan
│       │   ├── ReportTopItems.tsx # Item terlaris
│       │   └── ReportRevenue.tsx  # Pendapatan
│       └── auth/
│           └── Login.tsx          # Halaman login kasir
├── css/
│   └── app.css                    # Tailwind CSS entry + custom styles
└── views/
    └── app.blade.php              # Blade template entry point (Inertia root)
```

---

## 2. Konvensi Penamaan

### File & Folder

| Jenis | Konvensi | Contoh |
|---|---|---|
| **Pages** (Inertia) | PascalCase | `Menu.tsx`, `Orders.tsx` |
| **Components** | kebab-case | `menu-item-card.tsx`, `order-card.tsx` |
| **Hooks** | kebab-case dengan prefix `use-` | `use-polling.ts`, `use-cart.ts` |
| **Types** | kebab-case | `models.ts`, `index.d.ts` |
| **Utilities** | kebab-case | `utils.ts` |
| **Layouts** | kebab-case | `customer-layout.tsx`, `dashboard-layout.tsx` |

### Komponen & Variabel

| Jenis | Konvensi | Contoh |
|---|---|---|
| **React Component** | PascalCase | `MenuItemCard`, `OrderCard` |
| **Props Interface** | PascalCase + `Props` suffix | `MenuItemCardProps`, `OrderCardProps` |
| **Hooks** | camelCase dengan prefix `use` | `usePolling`, `useCart` |
| **Event handlers** | camelCase dengan prefix `handle` | `handleSubmit`, `handleDelete` |
| **Boolean props/vars** | camelCase dengan prefix `is/has/can` | `isAvailable`, `hasDiscount`, `canOrder` |
| **Constants** | UPPER_SNAKE_CASE | `POLLING_INTERVAL`, `TAX_RATE` |

---

## 3. TypeScript Interfaces (Model Data)

```typescript
// resources/js/types/models.ts

// ============ Menu ============
interface Category {
  id: number;
  name: string;
  sub_categories: SubCategory[];
}

interface SubCategory {
  id: number;
  category_id: number;
  name: string;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category_id: number;
  sub_category_id: number | null;
  is_available: boolean;
  is_best_seller: boolean;
  has_discount: boolean;
  discount_type: 'percentage' | 'fixed' | null;
  discount_value: number | null;
  discounted_price: number | null; // Computed
  variant_groups: VariantGroup[];
}

interface VariantGroup {
  id: number;
  menu_item_id: number;
  name: string; // e.g., "Ukuran", "Level Gula"
  variant_options: VariantOption[];
}

interface VariantOption {
  id: number;
  variant_group_id: number;
  name: string; // e.g., "Large"
  additional_price: number; // e.g., 5000
}

// ============ Pesanan ============
interface Order {
  id: number;
  order_number: string;
  order_type: 'dine_in' | 'takeaway';
  table_id: number | null; // Nullable if takeaway
  table_number: number | null;
  status: 'diproses' | 'selesai';
  payment_status: 'belum_bayar' | 'menunggu_konfirmasi' | 'sudah_bayar';
  payment_method: 'cash' | 'qris';
  subtotal: number;
  discount_total: number;
  tax_amount: number;
  total: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  menu_item_name: string;
  quantity: number;
  unit_price: number; // Harga satuan (sudah termasuk variasi)
  subtotal: number;
  note: string | null;
  selected_variants: SelectedVariant[];
}

interface SelectedVariant {
  variant_group_name: string;
  variant_option_name: string;
  additional_price: number;
}

// ============ Meja ============
interface Table {
  id: number;
  number: number;
  status: 'kosong' | 'terisi';
  qr_code_url: string;
}

// ============ Keranjang (Frontend Only) ============
interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  note: string;
  selected_variants: {
    variant_group_id: number;
    variant_option_id: number;
    variant_group_name: string;
    variant_option_name: string;
    additional_price: number;
  }[];
  item_total: number; // (base price + variant prices) × quantity
}

// ============ Laporan ============
interface DailySalesReport {
  date: string;
  total_orders: number;
  total_revenue: number;
  orders: Order[];
}

interface TopItemReport {
  menu_item_id: number;
  menu_item_name: string;
  total_sold: number;
  total_revenue: number;
}

interface RevenueReport {
  period_start: string;
  period_end: string;
  total_revenue: number;
  cash_revenue: number;
  qris_revenue: number;
}
```

---

## 4. Tailwind CSS Guidelines

### 4.1 Konfigurasi Tema

```typescript
// tailwind.config.ts
// Tema warna akan dikonfigurasi oleh user kemudian
// Gunakan CSS variables dari shadcn/ui theming system

// Contoh struktur (warna placeholder):
export default {
  darkMode: ['class'],
  content: [
    './resources/**/*.{ts,tsx,blade.php}',
  ],
  theme: {
    extend: {
      // Warna custom akan ditambahkan di sini
      // Mengikuti shadcn/ui CSS variable pattern
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

### 4.2 Aturan Penggunaan

| Aturan | Detail |
|---|---|
| **Inline styles** | ❌ DILARANG. Gunakan Tailwind classes |
| **Custom CSS** | Minimal. Hanya untuk animasi/efek yang tidak bisa dicapai Tailwind |
| **Responsive** | Gunakan breakpoint prefix (`sm:`, `md:`, `lg:`, `xl:`) |
| **Dark mode** | Tidak diperlukan untuk versi awal |
| **`cn()` utility** | WAJIB digunakan untuk conditional classes |

### 4.3 Responsive Breakpoints

```
Mobile (Pelanggan): < 768px  → Default styles (mobile-first)
Tablet:             768px+   → md: prefix
Desktop (Kasir):    1024px+  → lg: prefix
Wide Desktop:       1280px+  → xl: prefix
```

---

## 5. Desain Responsif

### 5.1 Halaman Pelanggan (Mobile-First)

- Desain utama untuk layar **< 768px** (smartphone)
- Layout **single column**
- Touch-friendly: minimum tap target **44px × 44px**
- Font size minimum **16px** (untuk mencegah zoom di iOS)
- Floating cart button di pojok kanan bawah
- Bottom sheet/modal untuk detail item (bukan halaman baru)
- Scroll horizontal untuk kategori tabs

### 5.2 Dashboard Kasir (Desktop-First)

- Desain utama untuk layar **≥ 1024px** (desktop/laptop)
- Layout **sidebar + main content**
- Sidebar: navigasi menu (fixed di kiri)
- Main content: konten halaman aktif
- Data tables untuk daftar item dan pesanan
- Modal untuk form input dan detail

---

## 6. Pola Komponen

### 6.1 Struktur Komponen

Setiap komponen mengikuti pola:

```tsx
// resources/js/components/customer/menu-item-card.tsx

import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onSelect }: MenuItemCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border p-3 cursor-pointer transition-colors',
        !item.is_available && 'opacity-50 cursor-not-allowed'
      )}
      onClick={() => item.is_available && onSelect(item)}
    >
      {/* ... */}
    </div>
  );
}
```

### 6.2 Aturan Komponen

| Aturan | Detail |
|---|---|
| **Export** | Named export (bukan default export), **KECUALI** Pages (Inertia membutuhkan default export) |
| **Props** | Selalu definisikan interface Props |
| **Children** | Gunakan `React.PropsWithChildren` jika komponen menerima children |
| **Event handler** | Definisikan sebagai prop dengan prefix `on` (`onSelect`, `onDelete`) |
| **Loading state** | Gunakan `Skeleton` component dari shadcn/ui |
| **Error state** | Tampilkan pesan error yang user-friendly dalam Bahasa Indonesia |
| **Empty state** | Selalu handle empty state (misal: "Belum ada pesanan") |

---

## 7. State Management

### 7.1 Strategi

| Jenis State | Metode | Contoh |
|---|---|---|
| **Server state** | Inertia.js page props | Data menu, pesanan, meja |
| **Form state** | `useForm()` dari `@inertiajs/react` | Form tambah menu, login |
| **UI state** | `useState()` React | Modal open/close, active tab |
| **Cart state** | `useState()` + localStorage | Keranjang pelanggan |
| **Polling state** | Custom `usePolling()` hook | Auto-refresh pesanan |

### 7.2 Keranjang Pelanggan

- Cart disimpan di **React state** (bukan di server)
- Cart juga disimpan di **localStorage** sebagai backup (agar tidak hilang jika halaman di-refresh)
- Key localStorage: `cart_meja_{nomor_meja}`
- Cart di-clear setelah pesanan berhasil dikirim

### 7.3 Inertia.js Patterns

```tsx
// Navigasi (router)
import { router } from '@inertiajs/react';

// Redirect
router.visit(route('customer.menu', { table: tableNumber }));

// Form submission
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors } = useForm({
  name: '',
  price: 0,
});

const handleSubmit = () => {
  post(route('dashboard.menu.store'));
};

// Partial reload (untuk polling)
router.reload({ only: ['orders'] });

// Shared data (via HandleInertiaRequests middleware)
import { usePage } from '@inertiajs/react';
const { auth } = usePage().props;
```

---

## 8. Format & Utility Functions

### 8.1 Format Rupiah

```typescript
// resources/js/lib/utils.ts

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
// Output: "Rp 25.000"
```

### 8.2 Konstanta

```typescript
// resources/js/lib/constants.ts

export const TAX_RATE = 0.11; // 11%
export const POLLING_INTERVAL = 10000; // 10 detik
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
```

### 8.3 Kalkulasi Harga

```typescript
// resources/js/lib/price.ts

export function calculateItemPrice(
  basePrice: number,
  variantPrices: number[],
  quantity: number,
  discountType: 'percentage' | 'fixed' | null,
  discountValue: number | null
): { subtotal: number; discount: number; afterDiscount: number } {
  const unitPrice = basePrice + variantPrices.reduce((sum, p) => sum + p, 0);
  const subtotal = unitPrice * quantity;

  let discount = 0;
  if (discountType === 'percentage' && discountValue) {
    discount = Math.floor(subtotal * (discountValue / 100));
  } else if (discountType === 'fixed' && discountValue) {
    discount = discountValue * quantity;
  }

  return {
    subtotal,
    discount,
    afterDiscount: subtotal - discount,
  };
}

export function calculateTax(amount: number): number {
  return Math.floor(amount * TAX_RATE);
}
```

---

## 9. Notifikasi & Audio

### 9.1 Suara Notifikasi

```typescript
// resources/js/hooks/use-notification.ts

// Audio file disimpan di: public/sounds/notification.mp3
// Gunakan Web Audio API atau HTML5 Audio

export function useNotification() {
  const playSound = () => {
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(() => {
      // Browser mungkin memblokir autoplay
      // User harus berinteraksi dulu dengan halaman
    });
  };

  const showToast = (message: string) => {
    // Gunakan shadcn/ui toast
    toast({
      title: 'Pesanan Baru!',
      description: message,
    });
  };

  return { playSound, showToast };
}
```

### 9.2 Browser Notification Permission

- Saat kasir pertama kali membuka dashboard, minta izin browser notification
- Jika ditolak, tetap tampilkan toast di dalam aplikasi

---

## 10. Aksesibilitas (A11y)

| Aspek | Implementasi |
|---|---|
| **Keyboard navigation** | Semua elemen interaktif bisa diakses via keyboard (shadcn/ui default) |
| **ARIA labels** | Gunakan `aria-label` untuk tombol ikon tanpa teks |
| **Focus management** | Kelola focus saat modal dibuka/ditutup (shadcn/ui default) |
| **Color contrast** | Pastikan rasio kontras minimal 4.5:1 (WCAG AA) |
| **Alt text** | Semua gambar menu harus punya `alt` text (gunakan nama item) |
| **Language** | Set `<html lang="id">` |

---

## 11. Performance Guidelines

| Aspek | Implementasi |
|---|---|
| **Image optimization** | Compress foto menu sebelum upload (max 2MB, rekomendasi: 500KB) |
| **Lazy loading** | Gunakan `loading="lazy"` pada gambar menu di halaman pelanggan |
| **Code splitting** | Inertia.js otomatis melakukan code splitting per page |
| **Caching** | Manfaatkan browser cache untuk aset statis |
| **Polling efficiency** | Gunakan Inertia partial reload (`only: ['orders']`) bukan full page reload |
