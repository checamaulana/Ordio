# Lessons Learned

- Implementasi fondasi (migrations, enums, models, services, seeders) perlu dipisah jelas agar pelacakan progres lebih mudah.
- Validasi runtime harus dijadwalkan saat PHP CLI tersedia di environment.
- Saat mengerjakan paralel multi-agent, route wiring sebaiknya ditugaskan ke satu agent atau difinalisasi di tahap integrasi untuk menghindari konflik.
- Type-check frontend dengan `node node_modules/typescript/bin/tsc --noEmit` tetap bisa dipakai saat `npm/bun` command tidak tersedia.
- Saat mengubah status/hapus order dine-in, reset status meja harus bergantung pada pengecekan order aktif berstatus `diproses` agar tidak mengosongkan meja terlalu cepat.
- Pada `useForm()` Inertia React, `transform()` tidak chainable; panggil `transform(...)` lalu `post(...)` di statement terpisah agar lolos type-check.
