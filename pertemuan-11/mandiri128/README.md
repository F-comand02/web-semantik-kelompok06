# Pertemuan 11 - Tugas Mandiri: Dari Endpoint ke Graf Lokal

## Bagian A - LIMIT dan triple
- Triple dengan LIMIT 10: 30
- Triple dengan LIMIT 30: 90
- Baris SELECT LIMIT 10 / kota berbeda: 10
- Mengapa tidak (atau mengapa tepat) 30 triple: iya, Karena LIMIT 10 membatasi jumlah solusi menjadi maksimal 10, sedangkan setiap solusi hanya menghasilkan 3 pola triple. 3x10= 30

## Bagian B - DBpedia ke Turtle
- Output demo_c.py: 48 triple, film tanpa tanggal: 16
- Sumber data: DBpedia / film_nolan.ttl
- Triple yang tetap tercetak untuk film tanpa tanggal: Untuk film yang tidak memiliki dbo:releaseDate, triple ?film a schema:Movie, schema:name ?judul, dan schema:director dbr:Christopher_Nolan tetap tercetak karena informasi tersebut tersedia. Sementara itu, triple schema:datePublished ?rilis tidak tercetak karena data tanggal rilis tidak ditemukan. Tidak ada pesan error karena penggunaan OPTIONAL memungkinkan data tanggal rilis tidak tersedia tanpa menggagalkan keseluruhan query.
- Query lokal tanpa internet: Query Q_TANPA_TANGGAL tetap berhasil dijalankan ketika internet dimatikan karena query tersebut menggunakan data dari file lokal film_nolan.ttl, bukan mengambil data langsung dari DBpedia.Namun, jika seluruh program demo_c.py dijalankan ulang tanpa internet, program akan gagal pada bagian pengambilan data dari DBpedia karena membutuhkan koneksi internet untuk mengirim query dan menerima hasilnya.
- Mengapa dbo:Film memberi 0 pada film_nolan.ttl: Query kedua menggunakan schema:Movie karena tipe film yang disimpan dalam film_nolan.ttl adalah schema:Movie, bukan dbo:Film. Keduanya berasal dari vocabulary yang berbeda. Oleh karena itu, jika menggunakan dbo:Film, hasilnya 0 karena tipe tersebut tidak tersimpan dalam file Turtle.

## Bagian C - Materialisasi

### 1. Output demo_d.py
Sebelum: 0
Sesudah: 3
Ada Rina: 3

### 2. Mengapa Ada Rina bernilai 3?
Karena setelah Rina ditambahkan, aturan materialisasi belum dijalankan kembali. Akibatnya, tipe foaf:Person untuk Rina belum terbentuk sehingga jumlah Person tetap 3.

### 3. Output materialisasi_ulang.py
Putaran 1: 4 triple baru | Person: 3
Rina masuk | Person: 3
Putaran 2 | Person: 4
Triple turunan disimpan terpisah: 6

### 4. Tiga triple yang bukan baru
Tiga triple tersebut sudah ada di graf awal (kampus.ttl). Hal ini terjadi karena penggunaan rdfs:subClassOf* memungkinkan jalur nol langkah, sehingga tipe awal juga dihasilkan kembali. Namun, triple tersebut tidak dihitung sebagai triple baru karena sudah ada di graf.

### 5. Kegunaan kampus_turunan.ttl dan langkah manual yang tersisa
File kampus_turunan.ttl berguna untuk menyimpan triple hasil inferensi secara terpisah dari data asli.

Langkah manual yang masih diperlukan adalah menjalankan ulang aturan materialisasi setiap kali ada data baru agar triple turunannya ikut diperbarui.

## Bagian D - Diagnosis
| Query | Hasil mesin | Gejala | Penyebab (baris yang salah) | Hasil setelah diperbaiki |
|-------|-------------|--------|-----------------------------|--------------------------|
| rusak_a | [isi] | [isi] | [isi] | [isi] |
| rusak_b | [isi] | [isi] | [isi] | [isi] |
| rusak_c | [isi] | [isi] | [isi] | [isi] |

## Bagian E - Etika dan diskusi
| Aturan | a_kota_limit.rq | demo_c.py |
|--------|-----------------|-----------|
| 1 User-Agent | [isi] | [isi] |
| 2 LIMIT | [isi] | [isi] |
| 3 Simpan, jangan ulangi | [isi] | [isi] |
| 4 Jangkar jalur | [isi] | [isi] |
- Versi yang melanggar aturan 4 (tidak dijalankan) dan alasannya: [isi]

### Diskusi 1 - Taksonomi berubah
[150-250 kata]

### Diskusi 2 - SELECT atau CONSTRUCT
[150-250 kata]

### Cek diri
| Pernyataan | Bukti dari tugas ini |
|------------|----------------------|
| 1 | [isi] |
| 2 | [isi] |
| 3 | [isi] |
| 4 | [isi] |
| 5 | [isi] |
