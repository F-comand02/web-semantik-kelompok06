# [Pertemuan 9](README.md) - SPARQL Dasar: Tell & Ask dan Endpoint
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

## Langkah 2 - ASK dan Asumsi Dunia Terbuka

Pada langkah ini dilakukan pengujian menggunakan query ASK dan SELECT untuk memahami konsep Open World Assumption (OWA) serta pencocokan pola pada SPARQL.

### 1. Query ASK

Query yang digunakan:

```sparql
ASK {
    ex:budi ex:mengajar ex:tif2410 .
}
```

**Hasil Query: FALSE**

**Penjelasan:**

Hasil query ASK adalah FALSE karena pada graf RDF tidak ditemukan triple yang menyatakan bahwa Budi mengajar mata kuliah TIF2410.

Berdasarkan data pada Langkah 1, Budi mengajar TIF2305, sedangkan TIF2410 diajar oleh Sari.

Menurut konsep Open World Assumption (OWA), informasi yang tidak ditemukan dalam graf RDF tidak selalu berarti bahwa informasi tersebut salah. Artinya, fakta tersebut belum diketahui atau belum dinyatakan dalam graf RDF.

### 2. Query SELECT dengan Dua Variabel

Query yang digunakan:

```sparql
SELECT ?a ?b
WHERE {
    ?a ex:mengajar ?mk .
    ?b ex:mengajar ?mk .
}
```

**Hasil Query: 5 Baris**

| No. | ?a | ?b | ?mk |
|---|---|---|---|
| 1 | ex:budi | ex:budi | ex:tif2305 |
| 2 | ex:budi | ex:sari | ex:tif2305 |
| 3 | ex:sari | ex:budi | ex:tif2305 |
| 4 | ex:sari | ex:sari | ex:tif2305 |
| 5 | ex:sari | ex:sari | ex:tif2410 |

**Penjelasan:**

Query tersebut menghasilkan 5 baris karena SPARQL mencocokkan semua kemungkinan pasangan individu yang mengajar mata kuliah yang sama.

Pada mata kuliah TIF2305 terdapat dua dosen, yaitu Budi dan Sari. Oleh karena itu, terdapat 4 kombinasi pasangan.

Sementara itu, pada mata kuliah TIF2410 hanya terdapat satu dosen, yaitu Sari, sehingga menghasilkan 1 kombinasi.

Baris dengan nilai ?a sama dengan ?b muncul karena SPARQL memperbolehkan kedua variabel memiliki nilai individu yang sama. Kedua variabel tidak diwajibkan memiliki nilai yang berbeda.

Untuk menghilangkan pasangan dengan individu yang sama, dapat menggunakan FILTER berikut:

```sparql
FILTER (?a != ?b)
```

### 3. Perbedaan Literal Bahasa pada RDF

Pola query yang digunakan:

```sparql
?mk ex:nama "Web Semantik" .
```

Sedangkan literal yang terdapat pada graf RDF adalah:

```turtle
ex:tif2305 ex:nama "Web Semantik"@id .
```

**Hasil Query: 0 Baris**

**Penjelasan:**

Query menghasilkan 0 baris karena terdapat perbedaan tag bahasa pada literal RDF.

Literal `"Web Semantik"` merupakan string tanpa tag bahasa, sedangkan `"Web Semantik"@id` merupakan string yang memiliki tag bahasa Indonesia.

Walaupun isi teksnya sama, keduanya dianggap sebagai literal yang berbeda karena adanya perbedaan tag bahasa.

Untuk mendapatkan hasil yang sesuai, query dapat ditulis sebagai berikut:

```sparql
SELECT ?mk
WHERE {
    ?mk ex:nama "Web Semantik"@id .
}
```

Dengan menambahkan tag bahasa `@id`, query dapat mencocokkan literal yang terdapat pada graf RDF.

### Kesimpulan Langkah 2

Berdasarkan percobaan yang telah dilakukan, dapat disimpulkan bahwa:

1. Query ASK digunakan untuk memeriksa apakah suatu pola triple tersedia dalam graf RDF.
2. Open World Assumption (OWA) menyatakan bahwa informasi yang tidak ditemukan belum tentu berarti salah.
3. Query SELECT dapat menghasilkan beberapa kombinasi pasangan variabel berdasarkan kecocokan pola triple.
4. Variabel SPARQL dapat memiliki nilai individu yang sama.
5. Literal RDF memperhatikan nilai dan tag bahasa sehingga perbedaan tag bahasa dapat memengaruhi hasil query.

Dengan demikian, langkah ini membantu memahami cara kerja query ASK, SELECT, serta konsep asumsi dunia terbuka dalam SPARQL.

## Langkah 3 - Query lokal
- IRI dasar graf: [isi]
- Jumlah triple awal / akhir: [isi] / [isi]
- Fakta yang ditambahkan: [isi]

## Langkah 4 - Wikidata
- Jumlah baris Q1 dengan wdt:P31: 20 Baris
- Jumlah baris Q1 dengan wdt:P31/wdt:P279*: 20 Baris
- Penjelasan perbedaan: Tidak ada perubahan jumlah baris. Hal ini karena kedua query sama-sama menampilkan maksimal 20 baris sesuai LIMIT 20. Penambahan P279* memperluas pencarian dengan mencakup objek yang termasuk kategori universitas melalui hubungan subkelas, tetapi jumlah hasil yang ditampilkan tetap dibatasi maksimal 20 baris.

## Langkah 5 - Endpoint dari Python
- agent=UA: [isi]
- setReturnFormat(JSON): [isi]
- b.get("kotaLabel", {}): [isi]

## Refleksi
1. Di titik mana SPARQL berbeda dari SQL?
2. Kapan Anda memakai graf lokal (rdflib) dan kapan endpoint publik?
3. Sebutkan satu hasil query yang mengejutkan dan jelaskan penyebabnya.
