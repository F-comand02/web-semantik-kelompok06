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
- IRI dasar graf: https://f-comand02.github.io/web-semantik-kelompok06/251402004/kampus#
- Jumlah triple awal / akhir: 51 / 54
- Fakta yang ditambahkan: ex:ida ex:mengajar ex:praktik_sparql. Mata kuliah ex:praktik_sparql ditambahkan sebagai ex:Course, dengan nama “Praktik SPARQL (contoh Langkah 3)”.

## Langkah 4 - Wikidata
- Jumlah baris Q1 dengan wdt:P31: 20 Baris
- Jumlah baris Q1 dengan wdt:P31/wdt:P279*: 20 Baris
- Penjelasan perbedaan: Tidak ada perubahan jumlah baris. Hal ini karena kedua query sama-sama menampilkan maksimal 20 baris sesuai LIMIT 20. Penambahan P279* memperluas pencarian dengan mencakup objek yang termasuk kategori universitas melalui hubungan subkelas, tetapi jumlah hasil yang ditampilkan tetap dibatasi maksimal 20 baris.

## Langkah 5 - Endpoint dari Python

Pada langkah ini dilakukan pengambilan data dari Wikidata menggunakan Python melalui SPARQL Endpoint. Program menggunakan library SPARQLWrapper untuk mengirim query SPARQL dan mengambil hasilnya dalam format JSON.

### 1. User-Agent (agent=UA)

Kode yang digunakan:

```python
UA = "KelasWebSemantik/1.0 (email_pengembang)"

sparql = SPARQLWrapper(
    "https://query.wikidata.org/sparql",
    agent=UA
)
```

**Penjelasan:**

User-Agent digunakan sebagai identitas aplikasi ketika mengakses endpoint Wikidata. Informasi ini membantu server mengetahui aplikasi yang melakukan permintaan data.

### 2. Format Hasil JSON (setReturnFormat)

Kode yang digunakan:

```python
sparql.setReturnFormat(JSON)
```

**Penjelasan:**

Perintah `setReturnFormat(JSON)` digunakan untuk menentukan format hasil query menjadi JSON (JavaScript Object Notation).

Format JSON memudahkan Python dalam membaca dan mengolah data hasil query SPARQL.

Untuk mengambil hasil query digunakan:

```python
hasil = sparql.queryAndConvert()
baris = hasil["results"]["bindings"]
```

### 3. Mengambil Label Kota

Kode yang digunakan:

```python
b.get("kotaLabel", {}).get("value", "")
```

**Penjelasan:**

Kode tersebut digunakan untuk mengambil nilai label kota dari hasil query Wikidata.

Keterangan:
- `b` merupakan satu baris data hasil query.
- `get("kotaLabel", {})` mengambil data label kota.
- `get("value", "")` mengambil nilai teks dari label kota.
- Jika data tidak ditemukan, program akan mengembalikan string kosong.

Penggunaan `get()` membuat program lebih aman ketika terdapat data yang tidak memiliki label kota.

### 4. Hasil Pengujian

Berdasarkan hasil pengambilan data dari Wikidata, diperoleh sebanyak 20 baris data universitas.

Data yang diperoleh berisi informasi universitas dan kota. Hasil query kemudian disimpan dalam file CSV dengan nama `hasil_universitas.csv`.

### Kesimpulan Langkah 5

Berdasarkan percobaan yang dilakukan, dapat disimpulkan bahwa Python dapat digunakan untuk mengambil data dari Wikidata melalui SPARQL Endpoint.

Penggunaan User-Agent membantu mengidentifikasi aplikasi, JSON mempermudah pengolahan hasil query, dan fungsi `get()` digunakan untuk mengambil nilai label kota.

Hasil pengambilan data dapat disimpan dalam format CSV sehingga lebih mudah dibaca dan digunakan kembali.

## Refleksi

### 1. Di titik mana SPARQL berbeda dari SQL?

SPARQL berbeda dari SQL terutama pada cara mengakses dan mengolah data.

SQL digunakan untuk mengambil data dari database relasional yang terdiri dari tabel, baris, dan kolom. Sementara itu, SPARQL digunakan untuk mengambil informasi dari graf RDF yang terdiri dari subject, predicate, dan object (triple).

Dalam SQL, pencarian data biasanya menggunakan SELECT, FROM, dan JOIN. Sedangkan SPARQL menggunakan pola triple untuk mencari hubungan antarentitas.

Perbedaan lainnya adalah SPARQL lebih cocok untuk menghubungkan data dari berbagai sumber melalui URI dan relasi semantik.

### 2. Kapan Anda memakai graf lokal (RDFLib) dan kapan endpoint publik?

Saya menggunakan graf lokal dengan RDFLib ketika ingin mengelola, menguji, dan memanipulasi data RDF sendiri tanpa harus bergantung pada koneksi internet.

Graf lokal juga cocok digunakan ketika data masih dalam tahap pengembangan, membutuhkan pengujian query, atau menggunakan data yang bersifat khusus.

Sementara itu, endpoint publik digunakan ketika membutuhkan informasi dari sumber eksternal seperti Wikidata. Dengan endpoint publik, saya dapat mengambil data yang lebih luas dan menghubungkan informasi dari berbagai entitas.

Jadi, graf lokal lebih cocok untuk pengolahan data sendiri, sedangkan endpoint publik lebih cocok untuk mencari dan memperoleh informasi dari sumber data terbuka.

### 3. Sebutkan satu hasil query yang mengejutkan dan jelaskan penyebabnya.

Salah satu hasil query yang cukup mengejutkan adalah ketika pola:

```sparql
?mk ex:nama "Web Semantik" .
```

menghasilkan 0 baris, padahal pada graf RDF terdapat data dengan nama "Web Semantik".

Hal tersebut terjadi karena literal pada graf RDF ditulis menggunakan tag bahasa Indonesia, yaitu `"Web Semantik"@id`, sedangkan query menggunakan `"Web Semantik"` tanpa tag bahasa.

Perbedaan tag bahasa menyebabkan kedua literal tersebut tidak cocok ketika dilakukan pencocokan pola.

Dari percobaan ini, saya memahami bahwa RDF memperhatikan tag bahasa pada literal, bukan hanya isi teksnya.

### Kesimpulan Refleksi

Melalui praktikum ini, saya mendapatkan pemahaman bahwa SPARQL memiliki cara kerja yang berbeda dari SQL karena berfokus pada hubungan antarentitas dalam graf RDF.

Saya juga memahami kapan harus menggunakan graf lokal dan endpoint publik serta pentingnya memperhatikan detail penulisan query, terutama dalam penggunaan literal dan tag bahasa.

Praktikum ini memberikan pengalaman dalam mengelola, mencari, dan menghubungkan data menggunakan teknologi Web Semantik.
