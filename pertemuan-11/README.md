# Pertemuan 11 - CONSTRUCT dan Hierarki Data

## Langkah 1 - Solution menjadi triple

| Solution | ?d | ?mk | Triple yang dicetak |
|---|---|---|---|
| 1 | ex:budi | ex:tif2108 | ex:tif2108 a ex:MataKuliahAktif .<br>ex:tif2108 ex:diampuOleh ex:budi . |
| 2 | ex:budi | ex:tif2104 | ex:tif2104 a ex:MataKuliahAktif .<br>ex:tif2104 ex:diampuOleh ex:budi . |
| 3 | ex:sari | ex:tif2108 | ex:tif2108 a ex:MataKuliahAktif .<br>ex:tif2108 ex:diampuOleh ex:sari . |
| 4 | ex:ida | ex:tif2104 | ex:tif2104 a ex:MataKuliahAktif .<br>ex:tif2104 ex:diampuOleh ex:ida . |

- **Jumlah solution:** 4
- **Jumlah cetakan triple:** 8
- **Jumlah triple di graf hasil:** 6
- **Triple yang tercetak lebih dari sekali:** 
  - `ex:tif2108 a ex:MataKuliahAktif .` (dari Solution 1 dan Solution 3)
  - `ex:tif2104 a ex:MataKuliahAktif .` (dari Solution 2 dan Solution 4)

---

## Langkah 2 - Tebak lalu cek
| Soal | Tebakan | Hasil mesin | Penjelasan bila meleset |
|------|---------|-------------|-------------------------|
| A    |     3   | 3           | -                       |
| B    | 4       | 4           | -                       |
| C    | 3       | 3           | -                       |
| D    |  1      | 0           | Ternyata yang punya ex:tendik itu tidak punya ex:nama jadinya dia kosong karena gabisa buat RDF dengan perintah construct dan itu tidak eror karena Optional              |

## Langkah 3 - Graf kampus lokal
- Berkas sumber dan IRI dasar graf: [isi]
- Kelas dosen dan properti nama: [isi]
- Triple hasil pemetaan: [isi]
- foaf:Person sebelum / sesudah: [isi] / [isi]
- Triple asli vs triple turunan: [jawaban]
- Dosen baru setelah program selesai: [jawaban]

## Langkah 4 - Wikidata
- Jumlah triple Q6: [isi]
- Jumlah baris Q6 versi SELECT: [isi]
- Penjelasan perbedaan: [isi]
- Q7 dengan + vs *: [isi]
- Kelas yang mengejutkan dan alasannya: [isi]

## Langkah 5 - Graf dari Python
- Jumlah triple universitas.ttl: [isi]
- Jumlah baris universitas_per_kota.csv: [isi]
- setReturnFormat(TURTLE): [isi]
- Graph().parse(data=...): [isi]
- Mengapa q_kota tidak memanggil endpoint: [isi]

## Refleksi
1. Mengapa jumlah triple hasil CONSTRUCT bisa lebih kecil dari jumlah baris SELECT dengan WHERE yang sama?
2. Bila taksonomi di graf kampus Anda berubah bulan depan, apa yang terjadi pada triple turunan di kampus_usu_v4.ttl?
3. Kapan Anda menyimpan hasil query sebagai tabel (CSV), dan kapan sebagai graf (Turtle)?
