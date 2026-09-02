## 2. Analisis Kesalahan XML

| No | Bagian yang Salah                                                                     | Alasan                                                                                                                         | Perbaikan                                                                                       |
| -- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| 1  | `<nama>Budi Santoso</Nama>`                                                           | XML bersifat **case-sensitive**, sehingga `<nama>` dan `</Nama>` dianggap sebagai tag yang berbeda.                            | Ubah menjadi `<nama>Budi Santoso</nama>`                                                        |
| 2  | `<angkatan>2024`                                                                      | Tag `<angkatan>` tidak memiliki tag penutup sehingga dokumen XML menjadi **tidak well-formed**.                                | Tambahkan tag penutup: `<angkatan>2024</angkatan>`                                              |
| 3  | `<deskripsi>Saya suka AI & Web Semantik</deskripsi>`                                  | Karakter `&` adalah karakter khusus dalam XML dan tidak boleh digunakan secara langsung dalam teks.                            | Ubah `&` menjadi `&amp;`: `<deskripsi>Saya suka AI &amp; Web Semantik</deskripsi>`              |
| 4  |  Struktur `<angkatan>` menyebabkan `<hobi>` dan `<deskripsi>` ikut terbaca di dalamnya| Karena `<angkatan>` tidak ditutup, elemen setelahnya secara struktur dianggap berada di dalam `<angkatan>`.                    | Tutup `<angkatan>` sebelum elemen `<hobi>`: `<angkatan>2024</angkatan>`                         |
| 5  | `<hobi>Programming</hobi>` dan `<hobi>Membaca</hobi>` berdiri sendiri                 | Ini **bukan error XML**, tetapi struktur data kurang terorganisir jika kedua hobi ingin dianggap sebagai satu kelompok.        | Gunakan elemen pembungkus, misalnya `<hobi><item>Programming</item><item>Membaca</item></hobi>` |
| 6  |  Tidak ada deklarasi XML                                                              | Deklarasi XML **tidak wajib**, jadi ini bukan error. Namun, deklarasi dapat menjelaskan versi XML dan encoding yang digunakan. | Tambahkan `<?xml version="1.0" encoding="UTF-8"?>` di awal dokumen                              |



## 5. Membaca XML Schema (XSD)

1. Root element yang diizinkan: buku
2. Tipe data judul: xs:string
3. Tipe data tahun: xs:gYear
4. Tipe data harga: xs:decimal
5. Atribut isbn tidak boleh dihilangkan, karena use="required" mewajibkan kehadirannya — dokumen tanpa atribut ini akan gagal validasi XSD.







## Pertanyaan Evaluasi

1. Apa perbedaan utama XML dan HTML?
| No | Aspek | XML | HTML |
| -- | ----- | --- | ---- |
| 1 | Tujuan | Menyimpan dan mengangkut data | Menampilkan dan memformat tampilan halaman web |
| 2 | Tag | Tidak punya tag baku — bebas membuat tag sendiri (mis. `<buku>`, `<harga>`) | Tag sudah ditentukan/baku (mis. `<p>`, `<div>`, `<table>`) dan punya arti tampilan tertentu |
| 3 | Fokus | Fokus pada struktur & isi data | Fokus pada cara data ditampilkan di browser |
| 4 | Aturan Penulisan | Sangat ketat — harus **well-formed** (tag harus ditutup, sensitif huruf besar/kecil, dll.) | Lebih longgar — browser masih bisa menampilkan HTML meski ada tag yang salah/tidak ditutup |
| 5 | Ekstensibilitas | **eXtensible** — bisa dikembangkan sesuai kebutuhan pembuatnya | Tidak *extensible*, tag terbatas pada spesifikasi HTML |

