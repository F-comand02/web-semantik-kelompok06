# Pertemuan 9 - SPARQL Dasar: Tell & Ask dan Endpoint

## Langkah 1 - Tabel binding

| Tahap | ?dosen | ?mk | ?namaMK |
|-------|--------|-----|---------|
| Pola 1, baris 1 | ex:budi | ex:tif2305 | – |
| Pola 1, baris 2 | ex:sari | ex:tif2410 | – |
| Pola 1, baris 3 | ex:sari | ex:tif2305 | – |
| Pola 2, baris 1 | – | ex:tif2305 | "Web Semantik" |
| Pola 2, baris 2 | – | ex:tif2410 | "Data Mining" |
| Hasil akhir, baris 1 | ex:budi | ex:tif2305 | "Web Semantik" |
| Hasil akhir, baris 2 | ex:sari | ex:tif2410 | "Data Mining" |
| Hasil akhir, baris 3 | ex:sari | ex:tif2305 | "Web Semantik" |

- Jumlah baris hasil akhir: 3 (setiap baris Pola 1 menemukan tepat satu pasangan di Pola 2, tidak ada yang gugur).
- Peran ?mk: ?mk tidak tampil di hasil karena `SELECT` hanya memproyeksikan ?dosen dan ?namaMK. Namun ?mk muncul di kedua pola, sehingga nilainya harus node yang sama. Inilah join di SPARQL. Tanpa ?mk sebagai penghubung, dosen akan dipasangkan dengan semua nama mata kuliah (hasil kali silang 3 × 2 = 6 baris).

## Langkah 2 - ASK dan dunia terbuka
1. [jawaban]
2. [jawaban]
3. [jawaban]

## Langkah 3 - Query lokal
- IRI dasar graf: [isi]
- Jumlah triple awal / akhir: [isi] / [isi]
- Fakta yang ditambahkan: [isi]

## Langkah 4 - Wikidata
- Jumlah baris Q1 dengan wdt:P31: [isi]
- Jumlah baris Q1 dengan wdt:P31/wdt:P279*: [isi]
- Penjelasan perbedaan: [isi]

## Langkah 5 - Endpoint dari Python
- agent=UA: [isi]
- setReturnFormat(JSON): [isi]
- b.get("kotaLabel", {}): [isi]

## Refleksi
1. Di titik mana SPARQL berbeda dari SQL?
2. Kapan Anda memakai graf lokal (rdflib) dan kapan endpoint publik?
3. Sebutkan satu hasil query yang mengejutkan dan jelaskan penyebabnya.